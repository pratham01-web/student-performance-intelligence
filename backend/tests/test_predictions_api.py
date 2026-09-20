"""Automated tests for Prediction API endpoints and ML inference."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from sqlalchemy.pool import StaticPool

from app.database.base import Base
from app.database.session import get_db
from app.main import app


@pytest.fixture
def api_client():
    """Provides TestClient with in-memory SQLite database session."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    with engine.connect() as conn:
        conn.exec_driver_sql("PRAGMA foreign_keys = ON;")

    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)
    try:
        yield client
    finally:
        app.dependency_overrides.clear()
        Base.metadata.drop_all(engine)


def test_predict_endpoint_valid_input(api_client: TestClient):
    """Verify POST /api/v1/predictions/predict returns score, probability, and logs to DB."""
    payload = {
        "study_hours": 4.5,
        "sleep_hours": 7.5,
        "screen_time": 2.0,
        "study_days": 5,
        "attendance": 88.0,
        "previous_marks": 78.5,
        "age": 16,
        "gender": "Female",
        "class_level": "10th",
        "semester": "Semester 1",
    }
    response = api_client.post("/api/v1/predictions/predict", json=payload)
    assert response.status_code == 201
    data = response.json()

    assert "prediction_id" in data
    assert 0.0 <= data["predicted_marks"] <= 100.0
    assert 0.0 <= data["pass_probability"] <= 1.0
    assert data["passed"] in (0, 1)
    assert "input_features" in data
    assert data["input_features"]["study_hours"] == 4.5

    # Check history contains this prediction
    hist_res = api_client.get("/api/v1/predictions/history")
    assert hist_res.status_code == 200
    hist_data = hist_res.json()
    assert hist_data["total"] >= 1
    assert hist_data["items"][0]["id"] == data["prediction_id"]


def test_predict_marks_fast_endpoint(api_client: TestClient):
    """Verify POST /api/v1/predictions/marks executes fast regression."""
    payload = {
        "study_hours": 3.0,
        "sleep_hours": 7.0,
        "screen_time": 4.0,
        "study_days": 4,
        "attendance": 75.0,
        "previous_marks": 65.0,
    }
    response = api_client.post("/api/v1/predictions/marks", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_marks" in data
    assert 0.0 <= data["predicted_marks"] <= 100.0


def test_predict_pass_fail_fast_endpoint(api_client: TestClient):
    """Verify POST /api/v1/predictions/pass-fail executes fast classification."""
    payload = {
        "study_hours": 5.0,
        "sleep_hours": 8.0,
        "screen_time": 1.5,
        "study_days": 6,
        "attendance": 92.0,
        "previous_marks": 85.0,
    }
    response = api_client.post("/api/v1/predictions/pass-fail", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "passed" in data
    assert "pass_probability" in data
    assert data["passed"] == 1
    assert data["pass_probability"] >= 0.5


def test_predict_validation_errors(api_client: TestClient):
    """Verify input validation handles invalid boundary data."""
    # Invalid study hours > 24
    res1 = api_client.post("/api/v1/predictions/predict", json={"study_hours": 26.0, "sleep_hours": 7.0, "attendance": 80.0, "previous_marks": 70.0})
    assert res1.status_code == 422

    # Invalid attendance > 100
    res2 = api_client.post("/api/v1/predictions/predict", json={"study_hours": 4.0, "sleep_hours": 7.0, "attendance": 105.0, "previous_marks": 70.0})
    assert res2.status_code == 422
