"""Pydantic schemas for Cohort Analytics and Reporting."""
from typing import Any
from pydantic import BaseModel


class AnalyticsOverviewResponse(BaseModel):
    total_students: int
    average_marks: float
    pass_rate: float
    average_attendance: float
    average_study_hours: float
    total_predictions: int


class SemesterTrendItem(BaseModel):
    semester: str
    average_marks: float
    average_attendance: float
    student_count: int


class AttendanceBandItem(BaseModel):
    band: str
    student_count: int
    pass_rate: float
    average_marks: float


class StudyHabitCorrelationItem(BaseModel):
    habit_range: str
    average_marks: float
    student_count: int


class AnalyticsTrendsResponse(BaseModel):
    semester_trends: list[SemesterTrendItem]
    attendance_bands: list[AttendanceBandItem]
    study_hour_bands: list[StudyHabitCorrelationItem]
