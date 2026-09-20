"""Database models package."""
from app.database.base import Base
from app.models.academic_record import AcademicRecord
from app.models.model_version import ModelVersion
from app.models.prediction import Prediction
from app.models.student import Student
from app.models.study_habit import StudyHabit

__all__ = [
    "Base",
    "Student",
    "AcademicRecord",
    "StudyHabit",
    "ModelVersion",
    "Prediction",
]
