"""Analytics and cohort reporting service.

Computes aggregations, distributions, and performance correlations
directly from PostgreSQL application data (AGENTS.md Section 11 & Rule 170).
"""
from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from app.models import AcademicRecord, Prediction, Student, StudyHabit
from app.schemas.analytics import (
    AnalyticsOverviewResponse,
    AnalyticsTrendsResponse,
    AttendanceBandItem,
    SemesterTrendItem,
    StudyHabitCorrelationItem,
)


def get_overview_analytics(db: Session) -> AnalyticsOverviewResponse:
    """Compute top-level KPI metrics across the institution cohort."""
    total_students = db.scalar(select(func.count(Student.id))) or 0
    total_predictions = db.scalar(select(func.count(Prediction.id))) or 0

    # Academic metrics
    academic_stats = db.execute(
        select(
            func.avg(AcademicRecord.previous_marks),
            func.avg(AcademicRecord.attendance),
            func.avg(
                case(
                    (AcademicRecord.previous_marks >= 50.0, 1.0),
                    else_=0.0,
                )
            ),
        )
    ).first()

    avg_marks = float(round(academic_stats[0] or 0.0, 2)) if academic_stats else 0.0
    avg_att = float(round(academic_stats[1] or 0.0, 2)) if academic_stats else 0.0
    pass_rate = float(round((academic_stats[2] or 0.0) * 100, 2)) if academic_stats else 0.0

    # Study habits metrics
    avg_study = db.scalar(select(func.avg(StudyHabit.study_hours))) or 0.0
    avg_study_hours = float(round(avg_study, 2))

    return AnalyticsOverviewResponse(
        total_students=total_students,
        average_marks=avg_marks,
        pass_rate=pass_rate,
        average_attendance=avg_att,
        average_study_hours=avg_study_hours,
        total_predictions=total_predictions,
    )


def get_trends_analytics(db: Session) -> AnalyticsTrendsResponse:
    """Compute detailed longitudinal semester trends and behavioral distributions."""
    # 1. Semester Trends
    semester_query = (
        select(
            AcademicRecord.semester,
            func.avg(AcademicRecord.previous_marks).label("avg_marks"),
            func.avg(AcademicRecord.attendance).label("avg_att"),
            func.count(AcademicRecord.id).label("student_count"),
        )
        .group_by(AcademicRecord.semester)
        .order_by(AcademicRecord.semester)
    )
    sem_rows = db.execute(semester_query).all()
    semester_trends = [
        SemesterTrendItem(
            semester=r[0],
            average_marks=float(round(r[1] or 0.0, 2)),
            average_attendance=float(round(r[2] or 0.0, 2)),
            student_count=int(r[3]),
        )
        for r in sem_rows
    ]

    # 2. Attendance Bands
    att_band_expr = case(
        (AcademicRecord.attendance < 60.0, "<60%"),
        (AcademicRecord.attendance < 75.0, "60-74%"),
        (AcademicRecord.attendance < 90.0, "75-89%"),
        else_="90-100%",
    )
    att_query = (
        select(
            att_band_expr.label("band"),
            func.count(AcademicRecord.id),
            func.avg(case((AcademicRecord.previous_marks >= 50.0, 1.0), else_=0.0)),
            func.avg(AcademicRecord.previous_marks),
        )
        .group_by(att_band_expr)
    )
    att_rows = db.execute(att_query).all()
    attendance_bands = [
        AttendanceBandItem(
            band=r[0],
            student_count=int(r[1]),
            pass_rate=float(round((r[2] or 0.0) * 100, 2)),
            average_marks=float(round(r[3] or 0.0, 2)),
        )
        for r in att_rows
    ]

    # 3. Study Hour Bands
    habit_band_expr = case(
        (StudyHabit.study_hours < 2.0, "<2 Hours"),
        (StudyHabit.study_hours < 4.0, "2-4 Hours"),
        (StudyHabit.study_hours < 6.0, "4-6 Hours"),
        else_=">6 Hours",
    )
    habit_query = (
        select(
            habit_band_expr.label("habit_range"),
            func.count(StudyHabit.id),
            func.avg(AcademicRecord.previous_marks),
        )
        .join(Student, Student.id == StudyHabit.student_id)
        .join(AcademicRecord, AcademicRecord.student_id == Student.id)
        .group_by(habit_band_expr)
    )
    habit_rows = db.execute(habit_query).all()
    study_hour_bands = [
        StudyHabitCorrelationItem(
            habit_range=r[0],
            student_count=int(r[1]),
            average_marks=float(round(r[2] or 0.0, 2)),
        )
        for r in habit_rows
    ]

    return AnalyticsTrendsResponse(
        semester_trends=semester_trends,
        attendance_bands=attendance_bands,
        study_hour_bands=study_hour_bands,
    )
