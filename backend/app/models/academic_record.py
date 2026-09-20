"""AcademicRecord ORM Model."""
from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import CheckConstraint, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.student import Student


class AcademicRecord(Base):
    """Stores academic semester history, past performance, and attendance."""

    __tablename__ = "academic_records"
    __table_args__ = (
        CheckConstraint(
            "previous_marks >= 0.0 AND previous_marks <= 100.0",
            name="ck_academic_records_previous_marks",
        ),
        CheckConstraint(
            "attendance >= 0.0 AND attendance <= 100.0",
            name="ck_academic_records_attendance",
        ),
        CheckConstraint(
            "exam_score IS NULL OR (exam_score >= 0.0 AND exam_score <= 100.0)",
            name="ck_academic_records_exam_score",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True
    )
    semester: Mapped[str] = mapped_column(String(32), nullable=False)
    previous_marks: Mapped[float] = mapped_column(Float, nullable=False)
    attendance: Mapped[float] = mapped_column(Float, nullable=False)
    exam_score: Mapped[float | None] = mapped_column(Float, nullable=True)
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
    student: Mapped["Student"] = relationship("Student", back_populates="academic_records")

    def __repr__(self) -> str:
        return (
            f"<AcademicRecord id={self.id} student_id={self.student_id} "
            f"semester='{self.semester}' marks={self.previous_marks} att={self.attendance}>"
        )
