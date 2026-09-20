"""ML Models and Registry API endpoints."""
import json
from pathlib import Path
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models import ModelVersion
from app.schemas.model_version import ModelComparisonResponse, ModelVersionResponse
from app.services.ml_service import ARTIFACTS_DIR, ml_engine

router = APIRouter(prefix="/models", tags=["Model Governance"])


@router.get("", response_model=list[ModelVersionResponse])
def list_models(db: Session = Depends(get_db)) -> list[ModelVersionResponse]:
    """Retrieve all registered machine learning models and metrics."""
    try:
        models = list(db.scalars(select(ModelVersion).order_by(ModelVersion.created_at.desc())).all())
        return models
    except Exception:
        return []


@router.get("/comparison", response_model=ModelComparisonResponse)
def compare_models(db: Session = Depends(get_db)) -> ModelComparisonResponse:
    """Retrieve comparative evaluation metrics across baseline and candidate models."""
    models = list(db.scalars(select(ModelVersion).order_by(ModelVersion.created_at.asc())).all())

    # Fallback to metadata JSON if database registry is empty
    if not models:
        meta_file = ARTIFACTS_DIR / "model_metadata.json"
        if meta_file.exists():
            with open(meta_file, "r", encoding="utf-8") as f:
                meta = json.load(f)
                return ModelComparisonResponse(
                    models=[],
                    active_regression=meta.get("active_regression_model", "marks_linear_regression"),
                    active_classification=meta.get("active_classification_model", "pass_fail_logistic_regression"),
                )

    return ModelComparisonResponse(
        models=models,
        active_regression=ml_engine.active_reg_name,
        active_classification=ml_engine.active_clf_name,
    )
