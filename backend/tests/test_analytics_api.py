"""Automated tests for Analytics API endpoints."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from sqlalchemy.pool import StaticPool

from app.database.base import Base
from app.database.session import get_db
from app.main import app
from app.models import AcademicRecord, Student, StudyHabit


@pytest.fixture
def api_client():
    """Provides TestClient with in-memory SQLite database session populated with sample students."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    with engine.connect() as conn:
        conn.exec_driver_sql("PRAGMA foreign_keys = ON;")

    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Seed sample records for analytics calculations
    session = TestingSessionLocal()
    s1 = Student(student_code="STU-A1", name="Student One", age=16, gender="Male", class_level="10th")
    s2 = Student(student_code="STU-A2", name="Student Two", age=17, gender="Female", class_level="11th")
    session.add_all([s1, s2])
    session.flush()

    rec1 = AcademicRecord(student_id=s1.id, semester="Semester 1", previous_marks=75.0, attendance=85.0)
    rec2 = AcademicRecord(student_id=s2.id, semester="Semester 1", previous_marks=45.0, attendance=60.0)
    h1 = StudyHabit(student_id=s1.id, study_hours=4.0, sleep_hours=7.0)
    h2 = StudyHabit(student_id=s2.id, study_hours=2.0, sleep_hours=6.0)
    session.add_all([rec1, rec2, h1, h2])
    session.commit()
    session.close()

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


def test_analytics_overview(api_client: TestClient):
    """Verify GET /api/v1/analytics/overview returns aggregated statistics."""
    response = api_client.get("/api/v1/analytics/overview")
    assert response.status_code == 200
    data = response.json()

    assert data["total_students"] == 2
    assert data["average_marks"] == 60.0  # (75 + 45) / 2
    assert data["average_attendance"] == 72.5  # (85 + 60) / 2
    assert data["pass_rate"] == 50.0  # 1 out of 2 >= 50
    assert data["average_study_hours"] == 3.0  # (4 + 2) / 2


def test_analytics_trends(api_client: TestClient):
    """Verify GET /api/v1/analytics/trends returns semester and habit distributions."""
    response = api_client.get("/api/v1/analytics/trends")
    assert response.status_code == 200
    data = response.json()

    assert "semester_trends" in data
    assert len(data["semester_trends"]) >= 1
    assert data["semester_trends"][0]["semester"] == "Semester 1"

    assert "attendance_bands" in data
    assert "study_hour_bands" in data
