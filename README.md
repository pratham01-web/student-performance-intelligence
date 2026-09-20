# Student Performance Intelligence System

## Project
Student Performance Intelligence System

## Purpose
An end-to-end machine learning application for student performance analysis and prediction. The system is designed to provide actionable academic insights by analyzing study habits, attendance, and academic history to predict marks and pass/fail probabilities.

## Current Phase
**Phase 2 — Database Architecture & PostgreSQL Implementation (Completed)**

## Technology Stack
- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python, Pydantic, SQLAlchemy 2.0, Alembic
- **Database:** PostgreSQL (production), SQLite (in-memory test harness)
- **Machine Learning:** Scikit-learn, Pandas, NumPy (future phases)
- **DevOps & Containerization:** Docker, Docker Compose

## Architecture & Specifications
For comprehensive specifications, reference:
- [`docs/02_ARCHITECTURE.md`](file:///c:/ML%20projects/student-performance-intelligence/docs/02_ARCHITECTURE.md) — System architecture & data flow
- [`docs/03_DATABASE.md`](file:///c:/ML%20projects/student-performance-intelligence/docs/03_DATABASE.md) — Database architecture & data dictionary
- [`phases/PHASE_01_SETUP.md`](file:///c:/ML%20projects/student-performance-intelligence/phases/PHASE_01_SETUP.md) — Phase 1 specification
- [`phases/PHASE_02_DATABASE.md`](file:///c:/ML%20projects/student-performance-intelligence/phases/PHASE_02_DATABASE.md) — Phase 2 specification
- [`AGENTS.md`](file:///c:/ML%20projects/student-performance-intelligence/AGENTS.md) — Master instructions and developer rules

## Current Status
### Implemented Foundation (Phases 1 & 2)
- **Repository & Foundation:** Directory structure, Python virtual environment, Git baseline, `.env.example`.
- **Backend API Shell:** FastAPI application with operational `GET /health` endpoint.
- **Frontend Shell:** Next.js application shell with TypeScript and Tailwind CSS.
- **Database Architecture & ORM:**
  - Complete data dictionary and ER diagram in `docs/03_DATABASE.md`.
  - SQLAlchemy 2.0 ORM models: `Student`, `AcademicRecord`, `StudyHabit`, `ModelVersion`, and `Prediction`.
  - Referential integrity: cascading deletes, foreign keys, and check constraints (grades, attendance, study hours, probabilities).
  - Database engine connection pooling and `get_db` session dependency.
- **Migrations:** Alembic configured with initial migration `001_initial_schema.py`.
- **Automated Testing:** 100% passing test suite for health endpoint, database models, CRUD, cascades, and constraints.

### Future Functionality (Intentionally Not Implemented Yet)
- **Phase 03:** Dataset acquisition, data pipeline, and ingestion.
- **Phase 04:** Exploratory Data Analysis (EDA) and data quality auditing.
- **Phase 05:** Machine learning preprocessing, training, model evaluation, and artifact serialization.
- **Phase 06:** Backend business logic, student management CRUD, prediction API, and analytics endpoints.
- **Phase 07:** Interactive frontend UI, prediction forms, student management views, and analytics dashboards.
- **Phase 08:** End-to-end integration between frontend, backend API, ML models, and PostgreSQL.
- **Phase 09:** Testing expansion (integration, regression, security).
- **Phase 10:** Production deployment hardening and documentation finalization.


## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run database migrations (with PostgreSQL running):
   ```bash
   alembic -c alembic.ini upgrade head
   ```
   *To inspect the generated SQL offline without connecting to PostgreSQL:*
   ```bash
   alembic -c alembic.ini upgrade head --sql
   ```

5. Run test suite:
   ```bash
   pytest tests -v
   ```

6. Start the development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
7. Verify health:
   ```bash
   curl http://localhost:8000/health
   ```


### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access the web interface at `http://localhost:3000`.
