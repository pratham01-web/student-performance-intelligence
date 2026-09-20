"""Pydantic schemas for Prediction requests and responses."""
from datetime import datetime
from typing import Any
from pydantic import BaseModel, ConfigDict, Field


class PredictionInput(BaseModel):
    student_id: int | None = Field(None, description="Optional existing student profile ID")
    study_hours: float = Field(..., ge=0.0, le=24.0, description="Daily dedicated study hours")
    sleep_hours: float = Field(..., ge=0.0, le=24.0, description="Daily sleep hours")
    screen_time: float = Field(3.0, ge=0.0, le=24.0, description="Daily screen time hours")
    study_days: int = Field(5, ge=0, le=7, description="Weekly study days")
    attendance: float = Field(..., ge=0.0, le=100.0, description="Attendance percentage")
    previous_marks: float = Field(..., ge=0.0, le=100.0, description="Previous marks percentage")
    age: int = Field(16, ge=5, le=100, description="Student age")
    gender: str = Field("Male", description="Gender (Male, Female, Other)")
    class_level: str = Field("10th", description="Class level")
    semester: str = Field("Semester 1", description="Semester")


class MarksPredictionResponse(BaseModel):
    predicted_marks: float
    model_version: str
    prediction_type: str = "marks"


class PassFailPredictionResponse(BaseModel):
    passed: int
    pass_probability: float
    model_version: str
    prediction_type: str = "pass_fail"


class CompletePredictionResponse(BaseModel):
    prediction_id: int | None = None
    student_id: int | None = None
    predicted_marks: float
    passed: int
    pass_probability: float
    model_version: str
    prediction_type: str = "both"
    input_features: dict[str, Any]
    created_at: datetime


class PredictionHistoryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    student_id: int | None = None
    model_version: str
    prediction_type: str
    predicted_marks: float | None = None
    pass_probability: float | None = None
    input_features: dict[str, Any]
    created_at: datetime


class PredictionHistoryResponse(BaseModel):
    items: list[PredictionHistoryItem]
    total: int
    page: int
    page_size: int
