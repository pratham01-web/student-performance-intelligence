# PHASE 03 — DATASET ACQUISITION, GENERATION & DATA INGESTION

**Document:** PHASE_03_DATASET.md  
**Project:** Student Performance Intelligence System  
**Phase:** 03  
**Status:** Completed  

---

## 1. PHASE OBJECTIVE

The objective of Phase 3 is to establish a rigorous, reproducible, and clearly documented dataset for the **Student Performance Intelligence System** in accordance with Section 6 (Data Policy) of [`AGENTS.md`](file:///c:/ML%20projects/student-performance-intelligence/AGENTS.md), and to provide an automated ingestion pipeline that populates the PostgreSQL/SQLite database models created in Phase 2.

Phase 3 establishes:
- Synthetic dataset generation script (`ml/data/generate_dataset.py`) using fixed random seed (`seed=42`) and multivariate distributions (Gamma, Beta, Normal).
- Comprehensive dataset metadata and data dictionary (`ml/data/dataset_metadata.json`).
- Persistent dataset artifact (`ml/data/student_performance_dataset.csv`) comprising 2,000 distinct student records.
- Database seeding pipeline (`scripts/seed_database.py`) mapping records directly to SQLAlchemy 2.0 ORM models (`Student`, `AcademicRecord`, `StudyHabit`, `ModelVersion`).

---

## 2. SCOPE OF PHASE 03

### In Scope
- Dataset generation program with empirical correlations between study habits, attendance, past marks, and examination performance.
- Clear disclosure and documentation of synthetic data generation methodology and assumptions.
- Persistence of raw dataset CSV and structured JSON metadata.
- Database seeding utility capable of populating PostgreSQL or local SQLite instances.
- Validation of data types, ranges, nullability, and primary/foreign key consistency.

### Out of Scope (Reserved for Future Phases)
- Exploratory Data Analysis, visual plots, and statistical auditing (Phase 04).
- Feature transformations, ColumnTransformer, and ML model training (Phase 05).
- FastAPI backend inference endpoints (Phase 06).
- Frontend visual dashboard and management UI (Phase 07).

---

## 3. DATASET CHARACTERISTICS

| Feature | Type | Distribution / Range | Target Relationship / Meaning |
|---|---|---|---|
| `student_code` | String (Unique) | `STU-00001` to `STU-02000` | Institutional student surrogate identifier |
| `name` | String | Diverse first & last names | Full student identity |
| `age` | Integer | 14 to 22 years | Correlated with enrolled class level |
| `gender` | String | Male (49%), Female (49%), Other (2%) | Demographic representation |
| `class_level` | String | 9th, 10th, 11th, 12th, Undergraduate | Current academic cohort |
| `semester` | String | Semester 1, 2, 3, 4 | Current evaluation term |
| `study_hours` | Float | Gamma(3.0, 1.2), range [0.5, 12.0] | Daily dedicated study hours |
| `sleep_hours` | Float | Normal(7.0, 1.1), range [4.0, 10.0] | Daily sleep hours (optimal: 7.5 hrs) |
| `screen_time` | Float | Gamma(2.5, 1.4), range [0.5, 11.0] | Daily non-academic screen exposure |
| `study_days` | Integer | [1, 7] days | Weekly active study days |
| `attendance` | Float | Beta(7, 2) * 100, range [40.0, 100.0] | Class attendance percentage |
| `previous_marks` | Float | Continuous, range [30.0, 99.0] | Historical baseline marks percentage |
| **`exam_score`** | Float (Target) | Continuous, range [15.0, 100.0] | Regression target: Final exam percentage |
| **`passed`** | Integer (Target) | Binary (0 / 1) | Classification target (`exam_score >= 50.0`) |

---

## 4. DELIVERABLES

1. `ml/data/generate_dataset.py` — Generative script producing 2,000 synthetic student records.
2. `ml/data/student_performance_dataset.csv` — Full synthetic student dataset.
3. `ml/data/dataset_metadata.json` — Formal machine-readable data dictionary and distribution metadata.
4. `scripts/seed_database.py` — Database ingestion pipeline for PostgreSQL and SQLite.
5. `phases/PHASE_03_DATASET.md` — Phase 3 specification and documentation.

---

## 5. VERIFICATION CRITERIA

- Script `ml/data/generate_dataset.py` runs without error and produces exactly 2,000 rows.
- No nulls exist in required fields; numerical fields respect domain constraints.
- Pass rate (~73.8%) and exam score mean (~58.3) reflect a natural academic distribution.
- Seeding script validates successfully on test database instances without constraint errors.
