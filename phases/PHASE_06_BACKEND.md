# PHASE 06 — FASTAPI BACKEND & INFERENCE API

**Document:** PHASE_06_BACKEND.md  
**Project:** Student Performance Intelligence System  
**Phase:** 06  
**Status:** Completed  

---

## 1. PHASE OBJECTIVE

The objective of Phase 6 is to implement the production FastAPI REST backend, connecting the PostgreSQL database layer (Phase 2) with the trained Machine Learning inference engine (Phase 5), fulfilling all API requirements specified in Section 12 of [`AGENTS.md`](file:///c:/ML%20projects/student-performance-intelligence/AGENTS.md) and [`docs/02_ARCHITECTURE.md`](file:///c:/ML%20projects/student-performance-intelligence/docs/02_ARCHITECTURE.md).

Phase 6 establishes:
- Pydantic v2 validation schemas for Students, Academic Records, Study Habits, Predictions, Analytics, and Model Versions (`backend/app/schemas/`).
- Domain service layer separating business logic and database transactions (`backend/app/services/student_service.py`, `analytics_service.py`).
- Inference orchestration engine (`backend/app/services/ml_service.py`) loading scikit-learn artifacts, executing real-time predictions, and persisting auditable prediction events in PostgreSQL.
- Modular REST API routers (`/api/v1/students`, `/api/v1/predictions`, `/api/v1/analytics`, `/api/v1/models`).
- Application integration in `backend/app/main.py`.

---

## 2. SCOPE OF PHASE 06

### In Scope
- CRUD endpoints for student profiles, academic histories, and study habits.
- Real-time dual prediction endpoint (`POST /api/v1/predictions/predict`) executing marks regression and pass/fail classification while persisting inputs to the audit table.
- High-speed inference endpoints (`/predictions/marks` and `/predictions/pass-fail`).
- Historical prediction audit log retrieval (`GET /api/v1/predictions/history`) with pagination.
- Aggregated analytics endpoints (`/analytics/overview` and `/analytics/trends`) computing cohort KPIs directly from database tables.
- Model registry inspection endpoint (`GET /api/v1/models` and `/api/v1/models/comparison`).

### Out of Scope (Reserved for Future Phases)
- Next.js 15 UI dashboard components and charts (Phase 07).
- Frontend-backend live integration (Phase 08).
- End-to-end load testing and security review (Phase 09).

---

## 3. API ENDPOINTS SUMMARY

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/students` | Register a new student profile |
| `GET` | `/api/v1/students` | List students with search, filters, and pagination |
| `GET` | `/api/v1/students/{id}` | Retrieve complete student profile with academic records and habits |
| `PUT` | `/api/v1/students/{id}` | Update student profile attributes |
| `DELETE`| `/api/v1/students/{id}` | Delete a student profile (cascades to child records) |
| `POST` | `/api/v1/students/{id}/academic-records` | Append semester academic history |
| `POST` | `/api/v1/students/{id}/study-habits` | Append study habit record |
| `POST` | `/api/v1/predictions/predict` | Run dual marks & pass/fail inference + log audit to DB |
| `POST` | `/api/v1/predictions/marks` | Fast marks score inference |
| `POST` | `/api/v1/predictions/pass-fail` | Fast pass probability inference |
| `GET` | `/api/v1/predictions/history` | Paginated historical inference log |
| `GET` | `/api/v1/analytics/overview` | Overall cohort statistics & KPIs |
| `GET` | `/api/v1/analytics/trends` | Semester and habit correlation trends |
| `GET` | `/api/v1/models` | List registered model versions |
| `GET` | `/api/v1/models/comparison` | Model registry benchmark comparison |
| `GET` | `/health` | Application operational health check |

---

## 4. DELIVERABLES

1. `backend/app/schemas/` — 6 Pydantic schema modules (`student.py`, `academic_record.py`, `study_habit.py`, `prediction.py`, `analytics.py`, `model_version.py`, `__init__.py`).
2. `backend/app/services/` — 3 domain service modules (`student_service.py`, `ml_service.py`, `analytics_service.py`).
3. `backend/app/api/v1/` — 4 domain routers (`students.py`, `predictions.py`, `analytics.py`, `models.py`) and aggregator `router.py`.
4. `backend/app/main.py` — Updated FastAPI entrypoint wiring the v1 API.
5. `phases/PHASE_06_BACKEND.md` — Phase 6 specification and summary.

---

## 5. VERIFICATION CRITERIA

- FastAPI server boots cleanly and exposes all `/api/v1` routes in OpenAPI schema.
- Inference service accurately formats inputs and generates predictions within [0, 100] for marks and [0, 1] for pass probabilities.
- All database operations utilize SQLAlchemy 2.0 sessions and handle transactions safely.
