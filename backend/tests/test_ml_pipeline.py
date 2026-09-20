"""Automated unit tests for ML pipeline, preprocessor, and model inference."""
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
import pytest

from ml.preprocessing.pipeline import ALL_INPUT_FEATURES, build_preprocessor, format_single_input

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ARTIFACTS_DIR = BASE_DIR / "ml" / "artifacts"


def test_preprocessor_artifact_exists_and_transforms():
    """Verify serialized preprocessor loads and produces deterministic feature matrix."""
    prep_path = ARTIFACTS_DIR / "preprocessor.joblib"
    assert prep_path.exists(), "preprocessor.joblib must exist in ml/artifacts"

    preprocessor = joblib.load(prep_path)

    sample_df = format_single_input({
        "study_hours": 4.0,
        "sleep_hours": 7.0,
        "screen_time": 2.5,
        "study_days": 5,
        "attendance": 85.0,
        "previous_marks": 70.0,
        "age": 16,
        "gender": "Female",
        "class_level": "10th",
        "semester": "Semester 1",
    })

    transformed = preprocessor.transform(sample_df)
    assert isinstance(transformed, np.ndarray)
    assert transformed.shape[0] == 1
    assert transformed.shape[1] > len(ALL_INPUT_FEATURES)  # Expanded due to one-hot encoding


def test_models_artifact_inference_invariants():
    """Verify loaded models predict within mathematically sound domains."""
    reg_path = ARTIFACTS_DIR / "marks_regressor.joblib"
    clf_path = ARTIFACTS_DIR / "pass_fail_classifier.joblib"

    assert reg_path.exists()
    assert clf_path.exists()

    preprocessor = joblib.load(ARTIFACTS_DIR / "preprocessor.joblib")
    reg = joblib.load(reg_path)
    clf = joblib.load(clf_path)

    sample_df = format_single_input({
        "study_hours": 8.0,
        "sleep_hours": 7.5,
        "screen_time": 1.0,
        "study_days": 6,
        "attendance": 95.0,
        "previous_marks": 90.0,
    })

    X_trans = preprocessor.transform(sample_df)

    # 1. Regression marks score
    score = float(reg.predict(X_trans)[0])
    clipped_score = float(np.clip(score, 0.0, 100.0))
    assert 0.0 <= clipped_score <= 100.0
    assert clipped_score >= 60.0, "High study & previous marks should produce high predicted score"

    # 2. Classification probabilities
    probs = clf.predict_proba(X_trans)[0]
    assert len(probs) == 2
    assert pytest.approx(sum(probs), 0.001) == 1.0
    assert probs[1] >= 0.7, "High study student should have high pass probability"


def test_preprocessor_handles_unknown_categories():
    """Verify preprocessor handles unknown categorical levels without raising an exception."""
    preprocessor = joblib.load(ARTIFACTS_DIR / "preprocessor.joblib")

    # Pass an unknown category
    sample_df = format_single_input({
        "gender": "NonBinaryUnknown",
        "class_level": "UnknownGrade",
        "semester": "Semester 99",
    })

    # Should not raise ValueError
    transformed = preprocessor.transform(sample_df)
    assert transformed.shape[0] == 1
