"""StudyHabit ORM Model."""
from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import CheckConstraint, DateTime, Float, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.student import Student


class StudyHabit(Base):
    """Tracks behavioral study habits, screen usage, and sleep routines."""

    __tablename__ = "study_habits"
    __table_args__ = (
        CheckConstraint(
            "study_hours >= 0.0 AND study_hours <= 24.0",
            name="ck_study_habits_study_hours",
        ),
        CheckConstraint(
            "sleep_hours >= 0.0 AND sleep_hours <= 24.0",
            name="ck_study_habits_sleep_hours",
        ),
        CheckConstraint(
            "screen_time IS NULL OR (screen_time >= 0.0 AND screen_time <= 24.0)",
            name="ck_study_habits_screen_time",
        ),
        CheckConstraint(
            "study_days IS NULL OR (study_days >= 0 AND study_days <= 7)",
            name="ck_study_habits_study_days",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True
    )
    study_hours: Mapped[float] = mapped_column(Float, nullable=False)
    sleep_hours: Mapped[float] = mapped_column(Float, nullable=False)
    screen_time: Mapped[float | None] = mapped_column(Float, nullable=True)
    study_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    student: Mapped["Student"] = relationship("Student", back_populates="study_habits")

    def __repr__(self) -> str:
        return (
            f"<StudyHabit id={self.id} student_id={self.student_id} "
            f"study_h={self.study_hours} sleep_h={self.sleep_hours}>"
        )
