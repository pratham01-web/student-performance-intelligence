"""Pydantic schemas for Student entity."""
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class StudentBase(BaseModel):
    student_code: str = Field(..., min_length=2, max_length=32, description="Institutional code, e.g. STU-00101")
    name: str = Field(..., min_length=1, max_length=128, description="Full student name")
    age: int = Field(..., ge=5, le=100, description="Age in years")
    gender: str = Field(..., description="Gender (Male, Female, Other)")
    class_level: str = Field(..., description="Class level, e.g. 10th, 12th, Undergraduate")


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=128)
    age: int | None = Field(None, ge=5, le=100)
    gender: str | None = None
    class_level: str | None = None


class AcademicRecordSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    semester: str
    previous_marks: float
    attendance: float
    exam_score: float | None = None


class StudyHabitSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    study_hours: float
    sleep_hours: float
    screen_time: float | None = None
    study_days: int | None = None


class StudentResponse(StudentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    updated_at: datetime


class StudentDetailResponse(StudentResponse):
    academic_records: list[AcademicRecordSimple] = []
    study_habits: list[StudyHabitSimple] = []


class StudentListResponse(BaseModel):
    items: list[StudentResponse]
    total: int
    page: int
    page_size: int
