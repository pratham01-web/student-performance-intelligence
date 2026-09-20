# Student Performance Intelligence System

## Project
Student Performance Intelligence System

## Purpose
An end-to-end machine learning application for student performance analysis and prediction. The system is designed to provide actionable academic insights by analyzing study habits, attendance, and academic history to predict marks and pass/fail probabilities.

## Current Status
**All Phases Completed (Phase 01 through Phase 10) — Production-Ready System**

## Technology Stack
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Recharts, Lucide Icons
- **Backend:** FastAPI, Python 3.10, Pydantic v2, SQLAlchemy 2.0, Alembic
- **Database:** PostgreSQL (production), SQLite (test/offline harness)
- **Machine Learning:** Scikit-learn, Pandas, NumPy, Matplotlib, Seaborn, Joblib
- **DevOps & Containerization:** Docker, Docker Compose

## Architecture & Specifications
For comprehensive specifications, reference:
- [`docs/02_ARCHITECTURE.md`](file:///c:/ML%20projects/student-performance-intelligence/docs/02_ARCHITECTURE.md) — System architecture & data flow
- [`docs/03_DATABASE.md`](file:///c:/ML%20projects/student-performance-intelligence/docs/03_DATABASE.md) — Database architecture & data dictionary
- [`docs/04_EDA.md`](file:///c:/ML%20projects/student-performance-intelligence/docs/04_EDA.md) — Exploratory Data Analysis & quality audit
- [`docs/05_ML_METHODOLOGY.md`](file:///c:/ML%20projects/student-performance-intelligence/docs/05_ML_METHODOLOGY.md) — ML benchmarks and model evaluation
- [`docs/06_API.md`](file:///c:/ML%20projects/student-performance-intelligence/docs/06_API.md) — REST API reference documentation
- [`AGENTS.md`](file:///c:/ML%20projects/student-performance-intelligence/AGENTS.md) — Master instructions and developer guidelines
- Phase Specifications: [`phases/PHASE_01_SETUP.md`](file:///c:/ML%20projects/student-performance-intelligence/phases/PHASE_01_SETUP.md) through [`phases/PHASE_10_FINAL.md`](file:///c:/ML%20projects/student-performance-intelligence/phases/PHASE_10_FINAL.md)

## Completed Implementation Highlights
- **Phase 01 — Foundation:** Clean repository architecture, virtual environment, Next.js shell, FastAPI shell.
- **Phase 02 — Database:** PostgreSQL schema, SQLAlchemy 2.0 ORM (`Student`, `AcademicRecord`, `StudyHabit`, `ModelVersion`, `Prediction`), check constraints, cascading deletes, Alembic migrations.
- **Phase 03 — Dataset:** Statistically grounded 2,000-student reproducible synthetic dataset generator (`ml/data/generate_dataset.py`) and seeding script (`scripts/seed_database.py`).
- **Phase 04 — EDA:** Comprehensive statistical audit and 5 generated publication figures in `docs/eda_figures/`.
- **Phase 05 — Machine Learning:**
  - `ColumnTransformer` preprocessing (StandardScaler + OneHotEncoder).
  - Regression: Linear Regression (Active baseline, R² = 0.7662) vs Random Forest (R² = 0.7457).
  - Classification: Logistic Regression (Active baseline, F1 = 0.9228, Acc = 88.50%) vs Random Forest (F1 = 0.9016).
  - Serialized joblib pipelines in `ml/artifacts/` with JSON metadata.
- **Phase 06 — Backend API:** Full REST services with Pydantic v2 validation for student CRUD, real-time prediction, prediction history, cohort analytics, and model governance.
- **Phase 07 — Frontend Dashboard:** Next.js 15 App Router interface with responsive Overview Dashboard (Recharts), Student Directory, Student Profiles, interactive Prediction Studio, Audit Logs, and Model Governance.
- **Phase 08 — Integration:** Seamless typed end-to-end integration between frontend, FastAPI backend, and ML models.
- **Phase 09 — Testing & Security:** 20 automated unit/integration tests with 100% pass rate (`pytest backend/tests -v`), SQL injection mitigation, and boundary checking.
- **Phase 10 — Production Hardening:** Docker Compose multi-service architecture, complete API and phase documentation.


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
