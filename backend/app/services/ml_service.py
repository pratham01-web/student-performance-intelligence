"""Machine Learning inference service.

Handles feature formatting, model loading, real-time prediction,
confidence estimation, and auditable persistence to PostgreSQL (AGENTS.md Section 8 & 11).
"""
import json
import logging
from pathlib import Path
from typing import Any
import joblib
import numpy as np
import pandas as pd
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import ModelVersion, Prediction
from app.schemas.prediction import CompletePredictionResponse, PredictionInput

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent


def resolve_artifacts_dir() -> Path:
    """Dynamically resolve ML artifacts directory across local and containerized environments."""
    import os
    env_path = os.environ.get("ML_ARTIFACTS_DIR")
    if env_path and Path(env_path).exists():
        return Path(env_path)
    candidates = [
        BASE_DIR / "ml" / "artifacts",
        Path(__file__).resolve().parent.parent.parent / "ml" / "artifacts",
        Path("/app/ml/artifacts"),
    ]
    for c in candidates:
        if c.exists() and (c / "preprocessor.joblib").exists():
            return c
    return BASE_DIR / "ml" / "artifacts"


ARTIFACTS_DIR = resolve_artifacts_dir()


class MLInferenceEngine:
    """Singleton-style wrapper holding loaded ML models and preprocessors."""

    def __init__(self, artifacts_dir: Path | None = None) -> None:
        self.artifacts_dir = artifacts_dir or resolve_artifacts_dir()
        self.preprocessor = None
        self.marks_regressor = None
        self.pass_fail_classifier = None
        self.metadata = {}
        self.active_reg_name = "marks_linear_regression"
        self.active_clf_name = "pass_fail_logistic_regression"
        self._load_artifacts()

    def _load_artifacts(self) -> None:
        """Load fitted scikit-learn models from filesystem."""
        try:
            prep_file = self.artifacts_dir / "preprocessor.joblib"
            reg_file = self.artifacts_dir / "marks_regressor.joblib"
            clf_file = self.artifacts_dir / "pass_fail_classifier.joblib"
            meta_file = self.artifacts_dir / "model_metadata.json"

            if prep_file.exists():
                self.preprocessor = joblib.load(prep_file)
            if reg_file.exists():
                self.marks_regressor = joblib.load(reg_file)
            if clf_file.exists():
                self.pass_fail_classifier = joblib.load(clf_file)
            if meta_file.exists():
                with open(meta_file, "r", encoding="utf-8") as f:
                    self.metadata = json.load(f)
                    self.active_reg_name = self.metadata.get("active_regression_model", self.active_reg_name)
                    self.active_clf_name = self.metadata.get("active_classification_model", self.active_clf_name)

            logger.info("Successfully loaded ML models and preprocessor.")
        except Exception as exc:
            logger.error("Error loading ML artifacts: %s", exc)

    def is_ready(self) -> bool:
        """Check if all ML artifacts are loaded."""
        return self.preprocessor is not None and self.marks_regressor is not None and self.pass_fail_classifier is not None

    def predict(self, input_data: PredictionInput) -> dict[str, Any]:
        """Execute real-time dual inference for marks and pass probability."""
        if not self.is_ready():
            self._load_artifacts()
            if not self.is_ready():
                raise RuntimeError("ML models not loaded. Please train models first.")

        # Prepare DataFrame conforming to training column layout
        features_dict = {
            "study_hours": [float(input_data.study_hours)],
            "sleep_hours": [float(input_data.sleep_hours)],
            "screen_time": [float(input_data.screen_time)],
            "study_days": [int(input_data.study_days)],
            "attendance": [float(input_data.attendance)],
            "previous_marks": [float(input_data.previous_marks)],
            "age": [int(input_data.age)],
            "gender": [str(input_data.gender)],
            "class_level": [str(input_data.class_level)],
            "semester": [str(input_data.semester)],
        }
        df_input = pd.DataFrame(features_dict)

        # Apply preprocessor
        X_trans = self.preprocessor.transform(df_input)

        # 1. Continuous Marks Prediction
        pred_marks_raw = float(self.marks_regressor.predict(X_trans)[0])
        predicted_marks = round(float(np.clip(pred_marks_raw, 0.0, 100.0)), 2)

        # 2. Pass/Fail Classification & Probability
        pass_prob_raw = float(self.pass_fail_classifier.predict_proba(X_trans)[0, 1])
        pass_probability = round(pass_prob_raw, 4)
        passed = 1 if predicted_marks >= 50.0 else 0

        # Snapshot of inputs for auditability
        input_snapshot = {
            "study_hours": input_data.study_hours,
            "sleep_hours": input_data.sleep_hours,
            "screen_time": input_data.screen_time,
            "study_days": input_data.study_days,
            "attendance": input_data.attendance,
            "previous_marks": input_data.previous_marks,
            "age": input_data.age,
            "gender": input_data.gender,
            "class_level": input_data.class_level,
            "semester": input_data.semester,
        }

        active_version_str = f"{self.active_reg_name}:{self.active_clf_name}"

        return {
            "predicted_marks": predicted_marks,
            "passed": passed,
            "pass_probability": pass_probability,
            "model_version": active_version_str,
            "input_features": input_snapshot,
        }


# Singleton engine instance
ml_engine = MLInferenceEngine()


def execute_and_record_prediction(db: Session, input_data: PredictionInput) -> Prediction:
    """Run model inference and persist audit record in PostgreSQL predictions table."""
    pred_result = ml_engine.predict(input_data)

    # Locate model version record if present in registry
    model_rec = db.scalars(
        select(ModelVersion).where(ModelVersion.model_name == ml_engine.active_reg_name)
    ).first()
    model_version_id = model_rec.id if model_rec else None

    prediction_record = Prediction(
        student_id=input_data.student_id,
        model_version_id=model_version_id,
        model_version=pred_result["model_version"],
        prediction_type="both",
        predicted_marks=pred_result["predicted_marks"],
        pass_probability=pred_result["pass_probability"],
        input_features=pred_result["input_features"],
    )

    db.add(prediction_record)
    db.commit()
    db.refresh(prediction_record)

    return prediction_record


def get_prediction_history(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    student_id: int | None = None,
) -> tuple[list[Prediction], int]:
    """Retrieve historical prediction audit logs."""
    query = select(Prediction)
    if student_id:
        query = query.where(Prediction.student_id == student_id)

    count_stmt = select(func.count()).select_from(query.subquery())
    total = db.scalar(count_stmt) or 0

    items_stmt = query.order_by(Prediction.created_at.desc()).offset(skip).limit(limit)
    items = list(db.scalars(items_stmt).all())

    return items, total
