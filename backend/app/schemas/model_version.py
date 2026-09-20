"""Pydantic schemas for ModelVersion entity and Registry metadata."""
from datetime import datetime
from typing import Any
from pydantic import BaseModel, ConfigDict


class ModelVersionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    model_name: str
    algorithm: str
    version: str
    dataset_version: str
    metrics: dict[str, Any]
    parameters: dict[str, Any] | None = None
    is_active: bool
    artifact_path: str | None = None
    trained_at: datetime
    created_at: datetime


class ModelComparisonResponse(BaseModel):
    models: list[ModelVersionResponse]
    active_regression: str
    active_classification: str
