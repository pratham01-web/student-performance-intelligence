"""Student ORM Model."""
from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import CheckConstraint, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.academic_record import AcademicRecord
    from app.models.study_habit import StudyHabit
    from app.models.prediction import Prediction


class Student(Base):
    """Represents a student enrolled in the institution."""

    __tablename__ = "students"
    __table_args__ = (
        CheckConstraint("age >= 5 AND age <= 100", name="ck_students_age_range"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_code: Mapped[str] = mapped_column(
        String(32), unique=True, index=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    gender: Mapped[str] = mapped_column(String(16), nullable=False)
    class_level: Mapped[str] = mapped_column(String(32), nullable=False)
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
    academic_records: Mapped[list["AcademicRecord"]] = relationship(
        "AcademicRecord", back_populates="student", cascade="all, delete-orphan"
    )
    study_habits: Mapped[list["StudyHabit"]] = relationship(
        "StudyHabit", back_populates="student", cascade="all, delete-orphan"
    )
    predictions: Mapped[list["Prediction"]] = relationship(
        "Prediction", back_populates="student"
    )

    def __repr__(self) -> str:
        return f"<Student id={self.id} code='{self.student_code}' name='{self.name}'>"
