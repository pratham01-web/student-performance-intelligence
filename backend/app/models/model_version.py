"""ModelVersion ORM Model."""
from datetime import datetime
from typing import TYPE_CHECKING, Any
from sqlalchemy import Boolean, DateTime, Integer, JSON, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.prediction import Prediction


class ModelVersion(Base):
    """Registry tracking machine learning models, algorithms, metrics, and versions."""

    __tablename__ = "model_versions"
    __table_args__ = (
        UniqueConstraint("model_name", "version", name="uq_model_versions_name_version"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    algorithm: Mapped[str] = mapped_column(String(100), nullable=False)
    version: Mapped[str] = mapped_column(String(50), nullable=False)
    dataset_version: Mapped[str] = mapped_column(String(50), nullable=False)
    metrics: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    parameters: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, index=True, nullable=False)
    artifact_path: Mapped[str | None] = mapped_column(String(255), nullable=True)
    trained_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    predictions: Mapped[list["Prediction"]] = relationship(
        "Prediction", back_populates="model_ref"
    )

    def __repr__(self) -> str:
        return (
            f"<ModelVersion id={self.id} name='{self.model_name}' "
            f"algo='{self.algorithm}' ver='{self.version}' active={self.is_active}>"
        )
