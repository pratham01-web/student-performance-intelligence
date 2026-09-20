"""Automated tests for database layer, models, relationships, and constraints."""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, sessionmaker

from app.database.base import Base
from app.database.session import get_db
from app.models import (
    AcademicRecord,
    ModelVersion,
    Prediction,
    Student,
    StudyHabit,
)


@pytest.fixture
def db_session():
    """Provides an isolated in-memory SQLite database session for unit testing."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
    )
    # Enable foreign keys and check constraints in SQLite
    with engine.connect() as conn:
        conn.exec_driver_sql("PRAGMA foreign_keys = ON;")

    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(engine)


def test_metadata_contains_all_models():
    """Verify that all five core tables are registered in SQLAlchemy metadata."""
    tables = Base.metadata.tables.keys()
    expected_tables = {
        "students",
        "academic_records",
        "study_habits",
        "model_versions",
        "predictions",
    }
    assert expected_tables.issubset(tables), f"Missing tables: {expected_tables - set(tables)}"


def test_student_crud(db_session: Session):
    """Verify basic CRUD operations on Student model."""
    # Create
    student = Student(
        student_code="STU-00101",
        name="Aarav Sharma",
        age=16,
        gender="Male",
        class_level="10th",
    )
    db_session.add(student)
    db_session.commit()
    db_session.refresh(student)

    assert student.id is not None
    assert student.student_code == "STU-00101"

    # Read
    retrieved = db_session.query(Student).filter_by(student_code="STU-00101").first()
    assert retrieved is not None
    assert retrieved.name == "Aarav Sharma"

    # Update
    retrieved.name = "Aarav K. Sharma"
    db_session.commit()
    updated = db_session.query(Student).filter_by(student_code="STU-00101").first()
    assert updated.name == "Aarav K. Sharma"

    # Delete
    db_session.delete(updated)
    db_session.commit()
    deleted = db_session.query(Student).filter_by(student_code="STU-00101").first()
    assert deleted is None


def test_student_relationships_and_cascades(db_session: Session):
    """Verify that deleting a student cascades to academic records and study habits."""
    student = Student(
        student_code="STU-00202",
        name="Diya Patel",
        age=17,
        gender="Female",
        class_level="11th",
    )
    db_session.add(student)
    db_session.commit()

    academic_rec = AcademicRecord(
        student_id=student.id,
        semester="Semester 1",
        previous_marks=85.5,
        attendance=92.0,
        exam_score=88.0,
    )
    habit = StudyHabit(
        student_id=student.id,
        study_hours=4.5,
        sleep_hours=7.5,
        screen_time=2.0,
        study_days=5,
    )
    db_session.add_all([academic_rec, habit])
    db_session.commit()

    # Verify relationships populated
    assert len(student.academic_records) == 1
    assert len(student.study_habits) == 1
    assert student.academic_records[0].attendance == 92.0

    # Delete student and verify cascade
    db_session.delete(student)
    db_session.commit()

    assert db_session.query(AcademicRecord).filter_by(student_id=student.id).count() == 0
    assert db_session.query(StudyHabit).filter_by(student_id=student.id).count() == 0


def test_model_version_and_prediction_audit(db_session: Session):
    """Verify ModelVersion registration and auditable Prediction logging with JSON features."""
    model = ModelVersion(
        model_name="marks_linear_regression",
        algorithm="LinearRegression",
        version="v1.0.0",
        dataset_version="v1.0",
        metrics={"mae": 3.42, "rmse": 4.15, "r2": 0.865},
        parameters={"fit_intercept": True, "normalize": False},
        is_active=True,
    )
    db_session.add(model)
    db_session.commit()

    student = Student(
        student_code="STU-00303",
        name="Rohan Verma",
        age=15,
        gender="Male",
        class_level="9th",
    )
    db_session.add(student)
    db_session.commit()

    input_payload = {
        "study_hours": 3.5,
        "attendance": 88.0,
        "previous_marks": 78.5,
        "sleep_hours": 7.0,
    }

    prediction = Prediction(
        student_id=student.id,
        model_version_id=model.id,
        model_version=model.version,
        prediction_type="marks",
        predicted_marks=81.2,
        pass_probability=0.94,
        input_features=input_payload,
    )
    db_session.add(prediction)
    db_session.commit()

    # Verify retrieval and relations
    pred_record = db_session.query(Prediction).filter_by(id=prediction.id).first()
    assert pred_record is not None
    assert pred_record.predicted_marks == 81.2
    assert pred_record.input_features["study_hours"] == 3.5
    assert pred_record.model_ref.algorithm == "LinearRegression"
    assert pred_record.student.student_code == "STU-00303"


def test_model_version_unique_constraint(db_session: Session):
    """Verify unique constraint on (model_name, version)."""
    m1 = ModelVersion(
        model_name="pass_fail_classifier",
        algorithm="LogisticRegression",
        version="v1.0.0",
        dataset_version="v1.0",
        metrics={"accuracy": 0.91, "f1": 0.89},
    )
    db_session.add(m1)
    db_session.commit()

    m2 = ModelVersion(
        model_name="pass_fail_classifier",
        algorithm="LogisticRegression",
        version="v1.0.0",
        dataset_version="v1.0",
        metrics={"accuracy": 0.92, "f1": 0.90},
    )
    db_session.add(m2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_check_constraints(db_session: Session):
    """Verify that domain check constraints enforce data integrity."""
    # 1. Invalid student age
    invalid_student = Student(
        student_code="STU-INVALID",
        name="Invalid Age",
        age=2,  # Below 5
        gender="Other",
        class_level="1st",
    )
    db_session.add(invalid_student)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

    # Valid student for foreign key checks
    valid_student = Student(
        student_code="STU-VALID",
        name="Valid Student",
        age=16,
        gender="Female",
        class_level="10th",
    )
    db_session.add(valid_student)
    db_session.commit()

    # 2. Invalid attendance > 100
    invalid_record = AcademicRecord(
        student_id=valid_student.id,
        semester="Sem 1",
        previous_marks=70.0,
        attendance=105.0,  # Invalid
    )
    db_session.add(invalid_record)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

    # 3. Invalid study hours > 24
    invalid_habit = StudyHabit(
        student_id=valid_student.id,
        study_hours=26.0,  # Invalid
        sleep_hours=6.0,
    )
    db_session.add(invalid_habit)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_get_db_dependency():
    """Verify that get_db generator yields a session and closes cleanly."""
    generator = get_db()
    session = next(generator)
    assert isinstance(session, Session)
    # Complete generator lifecycle
    with pytest.raises(StopIteration):
        next(generator)
