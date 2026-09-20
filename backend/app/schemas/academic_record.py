"""Pydantic schemas for AcademicRecord entity."""
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class AcademicRecordBase(BaseModel):
    semester: str = Field(..., description="Semester designation, e.g. Semester 1")
    previous_marks: float = Field(..., ge=0.0, le=100.0, description="Previous marks percentage")
    attendance: float = Field(..., ge=0.0, le=100.0, description="Attendance percentage")
    exam_score: float | None = Field(None, ge=0.0, le=100.0, description="Final realized exam score")


class AcademicRecordCreate(AcademicRecordBase):
    pass


class AcademicRecordResponse(AcademicRecordBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    student_id: int
    created_at: datetime
    updated_at: datetime
