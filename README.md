# Student Performance Intelligence System

## Project
Student Performance Intelligence System

## Purpose
An end-to-end machine learning application for student performance analysis and prediction. The system is designed to provide actionable academic insights by analyzing study habits, attendance, and academic history to predict marks and pass/fail probabilities.

## Current Phase
**Phase 1 — Project Foundation**

## Technology Stack
- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python, Pydantic, SQLAlchemy
- **Database:** PostgreSQL (architectural foundation)
- **Machine Learning:** Scikit-learn, Pandas, NumPy (future phases)
- **DevOps & Containerization:** Docker, Docker Compose

## Architecture
For a comprehensive architectural breakdown and data flow specification, reference:
- [`docs/02_ARCHITECTURE.md`](file:///c:/ML%20projects/student-performance-intelligence/docs/02_ARCHITECTURE.md)
- [`AGENTS.md`](file:///c:/ML%20projects/student-performance-intelligence/AGENTS.md)
- [`phases/PHASE_01_SETUP.md`](file:///c:/ML%20projects/student-performance-intelligence/phases/PHASE_01_SETUP.md)

## Current Status
### Implemented Foundation (Phase 1)
- Repository organization and directory hierarchy.
- Reproducible Python environment and backend structure (`backend/app`).
- Minimal FastAPI application with operational `GET /health` endpoint.
- Minimal Next.js frontend shell with TypeScript and Tailwind CSS.
- Initial Docker Compose configuration defining service architecture.
- Baseline configuration templates (`.env.example`) and Git ignore rules (`.gitignore`).

### Future Functionality (Intentionally Not Implemented in Phase 1)
- **Phase 02:** PostgreSQL database schema, models, and migrations.
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
4. Start the development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
5. Verify health:
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
