# PHASE 02 — DATABASE ARCHITECTURE & POSTGRESQL IMPLEMENTATION

**Document:** PHASE_02_DATABASE.md  
**Project:** Student Performance Intelligence System  
**Phase:** 02  
**Status:** Completed  

---

## 1. PHASE OBJECTIVE

The objective of Phase 2 is to design and implement the complete, production-grade relational database architecture using PostgreSQL and SQLAlchemy 2.0 for the **Student Performance Intelligence System**.

Phase 2 establishes:
- Formal database schema specification and data dictionary in [`docs/03_DATABASE.md`](file:///c:/ML%20projects/student-performance-intelligence/docs/03_DATABASE.md).
- Normalized database models representing students, academic records, study habits, predictions, and model versions.
- Clean database session and connection pooling infrastructure (`backend/app/database/session.py`).
- SQLAlchemy 2.0 declarative base architecture (`backend/app/database/base.py`).
- Database migrations pipeline configured using Alembic (`backend/alembic/`).
- Referential integrity with foreign keys, cascading deletion rules, uniqueness constraints, and field value range check constraints.
- Automated unit test suite verifying schema integrity, CRUD persistence, relationship cascades, and validation constraints.

---

## 2. SCOPE OF PHASE 02

### In Scope
- Database architecture specification document: [`docs/03_DATABASE.md`](file:///c:/ML%20projects/student-performance-intelligence/docs/03_DATABASE.md).
- Updated backend dependencies in `backend/requirements.txt` (`psycopg2-binary`, `alembic`).
- Database configuration management in `backend/app/core/config.py`.
- SQLAlchemy 2.0 declarative base and session management in `backend/app/database/`.
- 5 Core SQLAlchemy ORM models in `backend/app/models/`:
  1. `Student` (`students`)
  2. `AcademicRecord` (`academic_records`)
  3. `StudyHabit` (`study_habits`)
  4. `ModelVersion` (`model_versions`)
  5. `Prediction` (`predictions`)
- Alembic database migration environment and initial schema migration (`001_initial_schema.py`).
- Automated tests covering schema definitions, constraints, relationships, and persistence in `backend/tests/test_database.py`.

### Out of Scope (Reserved for Future Phases)
- Dataset acquisition, ingestion, and validation (Phase 03)
- Exploratory Data Analysis (EDA) and data quality auditing (Phase 04)
- ML preprocessing pipelines, feature engineering, and model training (Phase 05)
- Backend business logic, student CRUD API routes, prediction endpoints, analytics endpoints (Phase 06)
- Complete frontend UI, forms, and charts (Phase 07)
- End-to-end integration (Phase 08)
- Security audit and hardening (Phase 09)
- Production container orchestration finalization (Phase 10)

---

## 3. ENTITY RELATIONSHIP OVERVIEW

```text
                     ┌──────────────────┐
                     │     STUDENTS     │
                     │──────────────────│
                     │ id (PK)          │
                     │ student_code (UQ)│
                     │ name             │
                     │ age              │
                     │ gender           │
                     │ class_level      │
                     │ created_at       │
                     │ updated_at       │
                     └────────┬─────────┘
                              │
                  ┌───────────┼────────────┐
                  │ 1         │ 1          │ 1
                  ▼ *         ▼ *          ▼ *
        ┌────────────────┐ ┌──────────────┐ ┌────────────────┐
        │ ACADEMIC       │ │ STUDY        │ │ PREDICTIONS    │
        │ RECORDS        │ │ HABITS       │ │                │
        │────────────────│ │──────────────│ │────────────────│
        │ id (PK)        │ │ id (PK)      │ │ id (PK)        │
        │ student_id(FK) │ │ student_id(FK│ │ student_id(FK) │
        │ semester       │ │ study_hours  │ │ model_version_id│
        │ previous_marks │ │ sleep_hours  │ │ model_version  │
        │ attendance     │ │ screen_time  │ │ prediction_type│
        │ exam_score     │ │ study_days   │ │ predicted_marks│
        │ created_at     │ │ created_at   │ │ pass_prob      │
        │ updated_at     │ │ updated_at   │ │ input_features │
        └────────────────┘ └──────────────┘ │ created_at     │
                                            └───────┬────────┘
                                                    │ *
                                                    │
                                                    ▼ 1
                                          ┌──────────────────┐
                                          │ MODEL VERSIONS   │
                                          │──────────────────│
                                          │ id (PK)          │
                                          │ model_name       │
                                          │ algorithm        │
                                          │ version          │
                                          │ dataset_version  │
                                          │ metrics (JSON)   │
                                          │ parameters(JSON) │
                                          │ is_active        │
                                          │ trained_at       │
                                          │ created_at       │
                                          └──────────────────┘
```

---

## 4. DELIVERABLES

1. `phases/PHASE_02_DATABASE.md` — Phase 2 specification and scope document.
2. `docs/03_DATABASE.md` — Complete database architecture documentation, data dictionary, and ERD.
3. `backend/requirements.txt` — Updated with `psycopg2-binary` and `alembic`.
4. `backend/app/core/config.py` — Database environment settings with SQLAlchemy URI computation.
5. `backend/app/database/base.py` — DeclarativeBase setup and model registration.
6. `backend/app/database/session.py` — Engine setup, session factory, and `get_db()` dependency.
7. `backend/app/models/` — Model definitions (`student.py`, `academic_record.py`, `study_habit.py`, `model_version.py`, `prediction.py`, `__init__.py`).
8. `backend/alembic.ini` & `backend/alembic/` — Migration configuration and `001_initial_schema.py`.
9. `backend/tests/test_database.py` — Automated verification tests for schema, relationships, cascades, and constraints.
10. `README.md` — Updated with Phase 2 status and database setup documentation.

---

## 5. VERIFICATION CRITERIA

- All 5 ORM models map to corresponding database tables with explicit types, nullability, constraints, and relationships.
- Deletion of a `Student` cascades to `academic_records` and `study_habits`.
- Check constraints prevent invalid values (e.g. negative study hours, attendance outside [0, 100], pass probability outside [0, 1]).
- Uniqueness constraint on `(model_name, version)` prevents duplicate model registrations.
- Alembic migration environment is initialized and generates the full schema cleanly.
- Automated tests pass completely with `pytest backend/tests/test_database.py`.
