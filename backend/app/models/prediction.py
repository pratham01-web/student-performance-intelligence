"""Prediction ORM Model."""
from datetime import datetime
from typing import TYPE_CHECKING, Any
from sqlalchemy import CheckConstraint, DateTime, Float, ForeignKey, Integer, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.student import Student
    from app.models.model_version import ModelVersion


class Prediction(Base):
    """Auditable log of inference runs, predicted marks, and pass/fail probabilities."""

    __tablename__ = "predictions"
    __table_args__ = (
        CheckConstraint(
            "predicted_marks IS NULL OR (predicted_marks >= 0.0 AND predicted_marks <= 100.0)",
            name="ck_predictions_predicted_marks",
        ),
        CheckConstraint(
            "pass_probability IS NULL OR (pass_probability >= 0.0 AND pass_probability <= 1.0)",
            name="ck_predictions_pass_probability",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("students.id", ondelete="SET NULL"), nullable=True, index=True
    )
    model_version_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("model_versions.id", ondelete="RESTRICT"), nullable=True, index=True
    )
    model_version: Mapped[str] = mapped_column(String(50), nullable=False)
    prediction_type: Mapped[str] = mapped_column(String(32), nullable=False)
    predicted_marks: Mapped[float | None] = mapped_column(Float, nullable=True)
    pass_probability: Mapped[float | None] = mapped_column(Float, nullable=True)
    input_features: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )

    # Relationships
    student: Mapped["Student | None"] = relationship("Student", back_populates="predictions")
    model_ref: Mapped["ModelVersion | None"] = relationship(
        "ModelVersion", back_populates="predictions"
    )

    def __repr__(self) -> str:
        return (
            f"<Prediction id={self.id} student_id={self.student_id} "
            f"type='{self.prediction_type}' marks={self.predicted_marks} pass_prob={self.pass_probability}>"
        )
