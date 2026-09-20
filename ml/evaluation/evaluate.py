"""Evaluation and inference validation utility for Student Performance Intelligence System.

Loads serialized model pipelines and evaluates performance on arbitrary test datasets.
"""
import json
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, f1_score, mean_absolute_error, r2_score

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ARTIFACTS_DIR = BASE_DIR / "ml" / "artifacts"
DATA_PATH = BASE_DIR / "ml" / "data" / "student_performance_dataset.csv"


def load_artifacts(artifacts_dir: Path = ARTIFACTS_DIR):
    """Load serialized preprocessor and active regression/classification models."""
    preprocessor = joblib.load(artifacts_dir / "preprocessor.joblib")
    marks_regressor = joblib.load(artifacts_dir / "marks_regressor.joblib")
    pass_fail_classifier = joblib.load(artifacts_dir / "pass_fail_classifier.joblib")
    with open(artifacts_dir / "model_metadata.json", "r", encoding="utf-8") as f:
        metadata = json.load(f)
    return preprocessor, marks_regressor, pass_fail_classifier, metadata


def evaluate_active_pipeline(data_path: Path = DATA_PATH) -> dict:
    """Evaluate current active pipeline on the complete dataset."""
    preprocessor, reg, clf, metadata = load_artifacts()
    df = pd.read_csv(data_path)

    features = metadata["features"]
    X = df[features]
    y_reg = df["exam_score"]
    y_clf = df["passed"]

    X_trans = preprocessor.transform(X)

    reg_pred = reg.predict(X_trans)
    reg_pred = np.clip(reg_pred, 0.0, 100.0)
    mae = float(mean_absolute_error(y_reg, reg_pred))
    r2 = float(r2_score(y_reg, reg_pred))

    clf_pred = clf.predict(X_trans)
    acc = float(accuracy_score(y_clf, clf_pred))
    f1 = float(f1_score(y_clf, clf_pred))

    results = {
        "dataset_samples": len(df),
        "regression": {
            "active_model": metadata.get("active_regression_model"),
            "mae": round(mae, 3),
            "r2": round(r2, 4),
        },
        "classification": {
            "active_model": metadata.get("active_classification_model"),
            "accuracy": round(acc, 4),
            "f1": round(f1, 4),
        },
    }
    return results


if __name__ == "__main__":
    res = evaluate_active_pipeline()
    print("Pipeline Evaluation Results:")
    print(json.dumps(res, indent=2))
