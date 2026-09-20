"""Preprocessing pipeline module for the Student Performance Intelligence System.

Constructs reusable scikit-learn ColumnTransformer and feature pipelines
ensuring 100% parity between training and inference (AGENTS.md Section 8).
"""
from typing import Any
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

# Canonical Feature Lists
NUMERIC_FEATURES = [
    "study_hours",
    "sleep_hours",
    "screen_time",
    "study_days",
    "attendance",
    "previous_marks",
    "age",
]

CATEGORICAL_FEATURES = [
    "gender",
    "class_level",
    "semester",
]

ALL_INPUT_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES


def build_preprocessor() -> ColumnTransformer:
    """Build standardized ColumnTransformer for numerical scaling and categorical encoding."""
    numeric_transformer = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
        ]
    )

    categorical_transformer = Pipeline(
        steps=[
            (
                "encoder",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False),
            ),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, NUMERIC_FEATURES),
            ("cat", categorical_transformer, CATEGORICAL_FEATURES),
        ],
        remainder="drop",
    )
    return preprocessor


def format_single_input(raw_input: dict[str, Any]) -> pd.DataFrame:
    """Format single inference input dictionary into validated pandas DataFrame."""
    # Ensure default or fallback values for optional parameters
    data = {
        "study_hours": [float(raw_input.get("study_hours", 3.5))],
        "sleep_hours": [float(raw_input.get("sleep_hours", 7.0))],
        "screen_time": [float(raw_input.get("screen_time", 3.0))],
        "study_days": [int(raw_input.get("study_days", 5))],
        "attendance": [float(raw_input.get("attendance", 80.0))],
        "previous_marks": [float(raw_input.get("previous_marks", 60.0))],
        "age": [int(raw_input.get("age", 16))],
        "gender": [str(raw_input.get("gender", "Male"))],
        "class_level": [str(raw_input.get("class_level", "10th"))],
        "semester": [str(raw_input.get("semester", "Semester 1"))],
    }
    return pd.DataFrame(data)
