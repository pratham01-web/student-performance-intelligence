"""Database seeding script for the Student Performance Intelligence System.

Ingests synthetic student records from ml/data/student_performance_dataset.csv
into the relational database using SQLAlchemy 2.0 ORM models.
Supports PostgreSQL (default) and SQLite fallback for local developer agility.
"""
import argparse
import os
import sys
from pathlib import Path
import pandas as pd
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker

# Ensure backend directory is in sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from app.core.config import settings
from app.database.base import Base
from app.models import AcademicRecord, ModelVersion, Prediction, Student, StudyHabit


def seed_database(csv_path: Path, db_url: str | None = None, limit: int | None = None) -> None:
    """Seed relational database from dataset CSV."""
    target_url = db_url or settings.sqlalchemy_database_uri

    print(f"Connecting to database at: {target_url.split('@')[-1] if '@' in target_url else target_url}")

    connect_args = {}
    if target_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False

    engine = create_engine(target_url, connect_args=connect_args)

    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    SessionFactory = sessionmaker(bind=engine, autocommit=False, autoflush=False)
    session: Session = SessionFactory()

    try:
        df = pd.read_csv(csv_path)
        if limit:
            df = df.head(limit)

        print(f"Ingesting {len(df)} records from {csv_path.name}...")

        # Check existing student codes to avoid unique constraint violations
        existing_codes = set(session.scalars(select(Student.student_code)).all())

        new_students = 0
        for _, row in df.iterrows():
            code = str(row["student_code"])
            if code in existing_codes:
                continue

            student = Student(
                student_code=code,
                name=str(row["name"]),
                age=int(row["age"]),
                gender=str(row["gender"]),
                class_level=str(row["class_level"]),
            )
            session.add(student)
            session.flush()  # populate student.id

            academic_rec = AcademicRecord(
                student_id=student.id,
                semester=str(row["semester"]),
                previous_marks=float(row["previous_marks"]),
                attendance=float(row["attendance"]),
                exam_score=float(row["exam_score"]) if pd.notna(row["exam_score"]) else None,
            )
            session.add(academic_rec)

            habit = StudyHabit(
                student_id=student.id,
                study_hours=float(row["study_hours"]),
                sleep_hours=float(row["sleep_hours"]),
                screen_time=float(row["screen_time"]) if pd.notna(row["screen_time"]) else None,
                study_days=int(row["study_days"]) if pd.notna(row["study_days"]) else None,
            )
            session.add(habit)
            new_students += 1

        # Seed initial registered model versions if empty
        existing_models = session.scalars(select(ModelVersion)).all()
        if not existing_models:
            print("Registering baseline ML models in registry...")
            m1 = ModelVersion(
                model_name="marks_linear_regression",
                algorithm="LinearRegression",
                version="v1.0.0",
                dataset_version="v1.0.0",
                metrics={"mae": 4.12, "rmse": 5.28, "r2": 0.884},
                parameters={"fit_intercept": True},
                is_active=True,
                artifact_path="ml/artifacts/marks_regressor.joblib",
            )
            m2 = ModelVersion(
                model_name="pass_fail_logistic_regression",
                algorithm="LogisticRegression",
                version="v1.0.0",
                dataset_version="v1.0.0",
                metrics={"accuracy": 0.915, "precision": 0.931, "recall": 0.952, "f1": 0.941, "roc_auc": 0.962},
                parameters={"C": 1.0, "penalty": "l2", "solver": "lbfgs"},
                is_active=True,
                artifact_path="ml/artifacts/pass_fail_classifier.joblib",
            )
            session.add_all([m1, m2])

        session.commit()
        print(f"Successfully seeded {new_students} new students with associated academic records and study habits.")
        total_students = session.query(Student).count()
        print(f"Total students currently in database: {total_students}")

    except Exception as exc:
        session.rollback()
        print(f"Error seeding database: {exc}")
        raise
    finally:
        session.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed Student Performance database.")
    parser.add_argument(
        "--csv",
        type=Path,
        default=BASE_DIR / "ml" / "data" / "student_performance_dataset.csv",
        help="Path to CSV dataset file",
    )
    parser.add_argument("--db-url", type=str, default=None, help="Database connection URL override")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of records to ingest")
    args = parser.parse_args()

    seed_database(csv_path=args.csv, db_url=args.db_url, limit=args.limit)
