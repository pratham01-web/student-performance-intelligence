"""Pydantic schemas for StudyHabit entity."""
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class StudyHabitBase(BaseModel):
    study_hours: float = Field(..., ge=0.0, le=24.0, description="Daily study hours")
    sleep_hours: float = Field(..., ge=0.0, le=24.0, description="Daily sleep hours")
    screen_time: float | None = Field(None, ge=0.0, le=24.0, description="Daily recreational screen time")
    study_days: int | None = Field(None, ge=0, le=7, description="Weekly study days")


class StudyHabitCreate(StudyHabitBase):
    pass


class StudyHabitResponse(StudyHabitBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    student_id: int
    created_at: datetime
    updated_at: datetime
