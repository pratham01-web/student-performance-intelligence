"""Schemas package."""
from app.schemas.academic_record import AcademicRecordCreate, AcademicRecordResponse
from app.schemas.analytics import AnalyticsOverviewResponse, AnalyticsTrendsResponse
from app.schemas.model_version import ModelComparisonResponse, ModelVersionResponse
from app.schemas.prediction import (
    CompletePredictionResponse,
    MarksPredictionResponse,
    PassFailPredictionResponse,
    PredictionHistoryItem,
    PredictionHistoryResponse,
    PredictionInput,
)
from app.schemas.student import (
    StudentCreate,
    StudentDetailResponse,
    StudentListResponse,
    StudentResponse,
    StudentUpdate,
)
from app.schemas.study_habit import StudyHabitCreate, StudyHabitResponse

__all__ = [
    "StudentCreate",
    "StudentUpdate",
    "StudentResponse",
    "StudentDetailResponse",
    "StudentListResponse",
    "AcademicRecordCreate",
    "AcademicRecordResponse",
    "StudyHabitCreate",
    "StudyHabitResponse",
    "PredictionInput",
    "MarksPredictionResponse",
    "PassFailPredictionResponse",
    "CompletePredictionResponse",
    "PredictionHistoryItem",
    "PredictionHistoryResponse",
    "AnalyticsOverviewResponse",
    "AnalyticsTrendsResponse",
    "ModelVersionResponse",
    "ModelComparisonResponse",
]
