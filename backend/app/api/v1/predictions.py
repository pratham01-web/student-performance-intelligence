"""Predictions API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.prediction import (
    CompletePredictionResponse,
    MarksPredictionResponse,
    PassFailPredictionResponse,
    PredictionHistoryResponse,
    PredictionInput,
)
from app.services import ml_service

router = APIRouter(prefix="/predictions", tags=["Predictions"])


@router.post("/predict", response_model=CompletePredictionResponse, status_code=status.HTTP_201_CREATED)
def predict_performance(
    input_data: PredictionInput,
    db: Session = Depends(get_db),
) -> CompletePredictionResponse:
    """Execute dual inference (predicted marks + pass/fail probability) and persist audit record."""
    try:
        prediction_record = ml_service.execute_and_record_prediction(db, input_data)
        passed = 1 if (prediction_record.predicted_marks or 0.0) >= 50.0 else 0

        return CompletePredictionResponse(
            prediction_id=prediction_record.id,
            student_id=prediction_record.student_id,
            predicted_marks=prediction_record.predicted_marks or 0.0,
            passed=passed,
            pass_probability=prediction_record.pass_probability or 0.0,
            model_version=prediction_record.model_version,
            prediction_type="both",
            input_features=prediction_record.input_features,
            created_at=prediction_record.created_at,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {exc}",
        )


@router.post("/marks", response_model=MarksPredictionResponse)
def predict_marks_only(input_data: PredictionInput) -> MarksPredictionResponse:
    """Fast continuous marks inference without persistence."""
    try:
        res = ml_service.ml_engine.predict(input_data)
        return MarksPredictionResponse(
            predicted_marks=res["predicted_marks"],
            model_version=ml_service.ml_engine.active_reg_name,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Marks inference error: {exc}",
        )


@router.post("/pass-fail", response_model=PassFailPredictionResponse)
def predict_pass_fail_only(input_data: PredictionInput) -> PassFailPredictionResponse:
    """Fast classification and pass probability inference without persistence."""
    try:
        res = ml_service.ml_engine.predict(input_data)
        return PassFailPredictionResponse(
            passed=res["passed"],
            pass_probability=res["pass_probability"],
            model_version=ml_service.ml_engine.active_clf_name,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Classification inference error: {exc}",
        )


@router.get("/history", response_model=PredictionHistoryResponse)
def get_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    student_id: int | None = Query(None, description="Filter history by student id"),
    db: Session = Depends(get_db),
) -> PredictionHistoryResponse:
    """Retrieve historical prediction audit logs."""
    skip = (page - 1) * page_size
    items, total = ml_service.get_prediction_history(
        db, skip=skip, limit=page_size, student_id=student_id
    )
    return PredictionHistoryResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
    )
