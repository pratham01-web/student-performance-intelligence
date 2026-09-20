"""Automated tests for Students API endpoints."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

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


def test_create_student_success(api_client: TestClient):
    """Verify successful student creation via API."""
    payload = {
        "student_code": "STU-TEST01",
        "name": "Arjun Sharma",
        "age": 16,
        "gender": "Male",
        "class_level": "10th",
    }
    response = api_client.post("/api/v1/students", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["student_code"] == "STU-TEST01"
    assert data["name"] == "Arjun Sharma"
    assert "id" in data


def test_create_duplicate_student_code_fails(api_client: TestClient):
    """Verify duplicate student code returns HTTP 400."""
    payload = {
        "student_code": "STU-DUP01",
        "name": "Diya Patel",
        "age": 17,
        "gender": "Female",
        "class_level": "11th",
    }
    r1 = api_client.post("/api/v1/students", json=payload)
    assert r1.status_code == 201

    r2 = api_client.post("/api/v1/students", json=payload)
    assert r2.status_code == 400
    assert "already exists" in r2.json()["detail"]


def test_student_lifecycle_crud(api_client: TestClient):
    """Verify complete CRUD lifecycle: create, get, update, delete."""
    # 1. Create
    create_res = api_client.post(
        "/api/v1/students",
        json={"student_code": "STU-CRUD", "name": "Kavya Singh", "age": 15, "gender": "Female", "class_level": "9th"},
    )
    student_id = create_res.json()["id"]

    # 2. Get Detail
    get_res = api_client.get(f"/api/v1/students/{student_id}")
    assert get_res.status_code == 200
    assert get_res.json()["name"] == "Kavya Singh"

    # 3. Update
    up_res = api_client.put(f"/api/v1/students/{student_id}", json={"name": "Kavya S. Singh", "age": 16})
    assert up_res.status_code == 200
    assert up_res.json()["name"] == "Kavya S. Singh"
    assert up_res.json()["age"] == 16

    # 4. Add Academic Record
    rec_res = api_client.post(
        f"/api/v1/students/{student_id}/academic-records",
        json={"semester": "Semester 1", "previous_marks": 82.5, "attendance": 90.0, "exam_score": 85.0},
    )
    assert rec_res.status_code == 201

    # 5. Add Study Habit
    habit_res = api_client.post(
        f"/api/v1/students/{student_id}/study-habits",
        json={"study_hours": 4.5, "sleep_hours": 7.5, "screen_time": 2.0, "study_days": 5},
    )
    assert habit_res.status_code == 201

    # 6. Delete
    del_res = api_client.delete(f"/api/v1/students/{student_id}")
    assert del_res.status_code == 204

    # Verify not found after delete
    get_after = api_client.get(f"/api/v1/students/{student_id}")
    assert get_after.status_code == 404
