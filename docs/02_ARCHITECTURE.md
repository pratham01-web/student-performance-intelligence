# STUDENT PERFORMANCE INTELLIGENCE SYSTEM

## System Architecture & Flow Specification

**Document:** 02_ARCHITECTURE.md
**Project:** Student Performance Intelligence System
**Status:** Architecture Specification
**Version:** 1.0

---

# 1. ARCHITECTURE OBJECTIVE

The Student Performance Intelligence System is an end-to-end Machine Learning application.

The architecture must connect:

```text
User
  ↓
Frontend
  ↓
Backend API
  ↓
Business Logic
  ↓
ML Inference
  ↓
PostgreSQL Database
```

The system must also support the offline ML lifecycle:

```text
Dataset
  ↓
Data Validation
  ↓
Preprocessing
  ↓
EDA
  ↓
Feature Engineering
  ↓
Model Training
  ↓
Model Evaluation
  ↓
Model Selection
  ↓
Model Serialization
  ↓
Production Inference
```

The architecture must keep the ML training pipeline separate from the production prediction/inference pipeline.

---

# 2. HIGH-LEVEL SYSTEM ARCHITECTURE

```text
                         ┌──────────────────────────────┐
                         │            USER              │
                         │                              │
                         │ Student / Faculty / Admin    │
                         └──────────────┬───────────────┘
                                        │
                                        │ HTTPS
                                        ▼
                         ┌──────────────────────────────┐
                         │          FRONTEND            │
                         │                              │
                         │ Next.js + TypeScript         │
                         │ Tailwind CSS                 │
                         │ Recharts                     │
                         │                              │
                         │ Dashboard                    │
                         │ Student Management           │
                         │ Prediction Interface         │
                         │ Analytics                    │
                         └──────────────┬───────────────┘
                                        │
                                        │ REST API / JSON
                                        ▼
                         ┌──────────────────────────────┐
                         │         FASTAPI              │
                         │          BACKEND             │
                         │                              │
                         │ API Routes                   │
                         │ Request Validation           │
                         │ Authentication/Authorization │
                         │ Business Logic               │
                         │ Error Handling               │
                         └───────┬───────────┬──────────┘
                                 │           │
                    ┌────────────┘           └──────────────┐
                    │                                       │
                    ▼                                       ▼
       ┌─────────────────────────┐             ┌─────────────────────────┐
       │     ML INFERENCE        │             │      DATABASE LAYER      │
       │                         │             │                         │
       │ Preprocessing Pipeline  │             │ SQLAlchemy              │
       │ Trained Model           │             │ PostgreSQL               │
       │ Prediction              │             │                         │
       │ Confidence/Probability  │             │ Students                 │
       │                         │             │ Academic Records         │
       └────────────┬────────────┘             │ Study Habits             │
                    │                          │ Predictions               │
                    │                          │ Model Versions            │
                    │                          └─────────────────────────┘
                    │
                    ▼
       ┌─────────────────────────┐
       │     MODEL ARTIFACTS      │
       │                         │
       │ Preprocessor            │
       │ Regression Model        │
       │ Classification Model    │
       │ Model Metadata          │
       └─────────────────────────┘
```

---

# 3. COMPLETE SYSTEM FLOW

```text
                        START
                          │
                          ▼
                ┌───────────────────┐
                │      USER         │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │   Web Dashboard   │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Enter Student     │
                │ Information       │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Frontend          │
                │ Validation        │
                └─────────┬─────────┘
                          │
                          │ POST /prediction
                          ▼
                ┌───────────────────┐
                │ FastAPI           │
                │ Request Validation│
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Retrieve / Verify │
                │ Student Data     │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ ML Preprocessing  │
                │ Pipeline          │
                └─────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Trained ML Model │
                 └────────┬─────────┘
                          │
                  ┌───────┴────────┐
                  │                │
                  ▼                ▼
          ┌───────────────┐ ┌───────────────┐
          │ Marks         │ │ Pass / Fail   │
          │ Prediction    │ │ Prediction    │
          └───────┬───────┘ └───────┬───────┘
                  │                 │
                  └────────┬────────┘
                           ▼
                 ┌───────────────────┐
                 │ Store Prediction  │
                 │ in PostgreSQL     │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ API Response      │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Display Result    │
                 │ on Dashboard      │
                 └─────────┬─────────┘
                           │
                           ▼
                          END
```

---

# 4. MACHINE LEARNING TRAINING ARCHITECTURE

Training must NOT happen every time a user requests a prediction.

Training is an offline/retraining workflow.

```text
                 ┌──────────────────┐
                 │      DATASET     │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Data Validation  │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Data Cleaning    │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │       EDA        │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Feature          │
                 │ Engineering     │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Train/Test Split │
                 └────────┬─────────┘
                          │
                 ┌────────┴─────────┐
                 │                  │
                 ▼                  ▼
       ┌──────────────────┐ ┌──────────────────┐
       │ Regression       │ │ Classification   │
       │ Pipeline         │ │ Pipeline         │
       └────────┬─────────┘ └────────┬─────────┘
                │                    │
                ▼                    ▼
       ┌──────────────────┐ ┌──────────────────┐
       │ Linear           │ │ Logistic         │
       │ Regression       │ │ Regression       │
       └────────┬─────────┘ └────────┬─────────┘
                │                    │
                ▼                    ▼
       ┌──────────────────┐ ┌──────────────────┐
       │ Additional       │ │ Additional       │
       │ Models           │ │ Models           │
       └────────┬─────────┘ └────────┬─────────┘
                │                    │
                └─────────┬──────────┘
                          ▼
                 ┌──────────────────┐
                 │ Model Evaluation │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Model Comparison │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Model Selection  │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Model Versioning │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Save Artifacts   │
                 └──────────────────┘
```

---

# 5. DATA PIPELINE ARCHITECTURE

```text
Raw Dataset
     │
     ▼
┌──────────────────────┐
│ Schema Validation    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Missing Value Check  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Duplicate Detection  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Invalid Value Check  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Data Cleaning        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Feature Engineering  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Processed Dataset    │
└──────────┬───────────┘
           │
           ├──────────────────┐
           │                  │
           ▼                  ▼
      EDA / Analysis      ML Training
```

---

# 6. DATABASE ARCHITECTURE

The PostgreSQL database is the persistent storage layer.

High-level relationship:

```text
                    ┌──────────────────┐
                    │     STUDENTS     │
                    │──────────────────│
                    │ id               │
                    │ student_code     │
                    │ name             │
                    │ age              │
                    │ gender           │
                    │ class            │
                    └────────┬─────────┘
                             │
                 ┌───────────┼────────────┐
                 │           │            │
                 ▼           ▼            ▼
       ┌────────────────┐ ┌──────────────┐ ┌────────────────┐
       │ ACADEMIC       │ │ STUDY        │ │ PREDICTIONS    │
       │ RECORDS        │ │ HABITS       │ │                │
       │────────────────│ │──────────────│ │────────────────│
       │ id             │ │ id           │ │ id             │
       │ student_id     │ │ student_id   │ │ student_id     │
       │ semester       │ │ study_hours  │ │ model_version  │
       │ previous_marks │ │ sleep_hours  │ │ predicted_marks│
       │ attendance     │ │ screen_time  │ │ pass_probability│
       │ exam_score     │ │ study_days   │ │ created_at     │
       └────────────────┘ └──────────────┘ └───────┬────────┘
                                                    │
                                                    │
                                                    ▼
                                          ┌──────────────────┐
                                          │ MODEL VERSIONS   │
                                          │──────────────────│
                                          │ id               │
                                          │ model_name       │
                                          │ algorithm        │
                                          │ version          │
                                          │ metrics          │
                                          │ dataset_version  │
                                          │ trained_at       │
                                          └──────────────────┘
```

The exact schema is defined separately in:

```text
docs/03_DATABASE.md
```

This architecture document must NOT duplicate the complete database schema.

---

# 7. FRONTEND ARCHITECTURE

```text
                     FRONTEND
                         │
          ┌──────────────┼───────────────┐
          │              │               │
          ▼              ▼               ▼
     Dashboard       Students        Predictions
          │              │               │
          │              │               │
          ▼              ▼               ▼
     Analytics       Student CRUD    Prediction Form
          │                              │
          │                              ▼
          │                         Result View
          │                              │
          └──────────────┬───────────────┘
                         │
                         ▼
                    API Client
                         │
                         ▼
                   FastAPI Backend
```

Frontend must never communicate directly with PostgreSQL.

Correct:

```text
Frontend → FastAPI → Database
```

Incorrect:

```text
Frontend → PostgreSQL
```

---

# 8. BACKEND ARCHITECTURE

```text
                    FASTAPI
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
          API ROUTERS       MIDDLEWARE
              │
              ▼
          SCHEMAS
              │
              ▼
          SERVICES
              │
        ┌─────┴──────┐
        │            │
        ▼            ▼
   ML SERVICE    DATABASE SERVICE
        │            │
        ▼            ▼
   ML MODEL      SQLAlchemy
                     │
                     ▼
                 PostgreSQL
```

Responsibilities:

### API Router

Handles HTTP requests.

### Schema

Validates request and response data.

### Service

Contains business logic.

### ML Service

Handles model inference.

### Database Service

Handles persistence.

Routers should not contain complex ML or database logic.

---

# 9. PREDICTION FLOW

## Marks Prediction

```text
User Input
    │
    ▼
Frontend Validation
    │
    ▼
POST /predictions/marks
    │
    ▼
FastAPI
    │
    ▼
Pydantic Validation
    │
    ▼
ML Service
    │
    ▼
Preprocessing Pipeline
    │
    ▼
Regression Model
    │
    ▼
Predicted Marks
    │
    ▼
Prediction Record
    │
    ▼
PostgreSQL
    │
    ▼
API Response
    │
    ▼
Frontend
```

---

# 10. PASS/FAIL PREDICTION FLOW

```text
Student Features
       │
       ▼
Validation
       │
       ▼
Preprocessing
       │
       ▼
Classification Model
       │
       ├───────────────┐
       │               │
       ▼               ▼
 Predicted Class   Probability
       │               │
       └───────┬───────┘
               ▼
       Prediction Record
               │
               ▼
          PostgreSQL
               │
               ▼
          API Response
               │
               ▼
           Dashboard
```

---

# 11. ANALYTICS FLOW

Analytics must be generated from actual database/application data.

```text
PostgreSQL
    │
    ▼
Analytics Service
    │
    ├───────────────┐
    │               │
    ▼               ▼
Student Metrics   Prediction Metrics
    │               │
    └───────┬───────┘
            ▼
        FastAPI
            │
            ▼
        Frontend
            │
            ▼
      Visualization
```

Examples:

* average marks
* pass percentage
* attendance distribution
* study-hour distribution
* prediction count
* model performance

Do not hardcode these values.

---

# 12. MODEL RETRAINING FLOW

Model training and production inference are separate.

```text
New Dataset
     │
     ▼
Data Validation
     │
     ▼
Training Pipeline
     │
     ▼
Model Evaluation
     │
     ▼
Compare Existing Model
     │
     ▼
Better Model?
   /       \
 YES       NO
 │          │
 ▼          ▼
Version    Keep Existing
Model
 │
 ▼
Save Model Artifact
 │
 ▼
Register Model Version
 │
 ▼
Available for Inference
```

The system must not automatically replace a production model merely because a new model was trained.

Model replacement should be an explicit controlled process.

---

# 13. MODEL ARTIFACT FLOW

```text
Training
   │
   ▼
Preprocessor
   │
   ├──────────────┐
   │              │
   ▼              ▼
Regression     Classification
Model           Model
   │              │
   └──────┬───────┘
          ▼
    Model Metadata
          │
          ▼
     Model Registry
          │
          ▼
     Inference API
```

The inference service must load the appropriate model and preprocessing artifacts.

---

# 14. ERROR HANDLING FLOW

Every user-controlled request must pass validation.

```text
User Request
     │
     ▼
API
     │
     ▼
Schema Validation
     │
     ├───────────────┐
     │               │
   INVALID          VALID
     │               │
     ▼               ▼
  4xx Error       Business Logic
                     │
                     ▼
                ML / Database
                     │
                     ├──────────────┐
                     │              │
                   ERROR          SUCCESS
                     │              │
                     ▼              ▼
                  5xx/4xx        Response
```

Errors must be returned in a consistent API format.

Do not expose internal stack traces to end users.

---

# 15. SECURITY BOUNDARY

```text
                INTERNET / USER
                       │
                       ▼
                  FRONTEND
                       │
                       ▼
                   API LAYER
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
         Validation         Authorization
              │                 │
              └────────┬────────┘
                       ▼
                 APPLICATION
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
          DATABASE              ML
```

Rules:

* Database credentials must never be exposed to frontend.
* Secrets must be stored in environment variables.
* `.env` must not be committed.
* User input must be validated.
* SQL must not be constructed through unsafe string concatenation.
* API errors must not expose secrets or internal stack traces.

---

# 16. COMPLETE END-TO-END ARCHITECTURE

```text
                               USER
                                │
                                ▼
                    ┌─────────────────────┐
                    │      NEXT.JS        │
                    │      FRONTEND       │
                    └──────────┬──────────┘
                               │
                         REST / JSON
                               │
                               ▼
                    ┌─────────────────────┐
                    │       FASTAPI       │
                    │        API          │
                    └──────────┬──────────┘
                               │
               ┌───────────────┼────────────────┐
               │               │                │
               ▼               ▼                ▼
        ┌─────────────┐ ┌─────────────┐ ┌──────────────┐
        │   Student   │ │ Prediction  │ │  Analytics   │
        │   Service   │ │   Service   │ │   Service    │
        └──────┬──────┘ └──────┬──────┘ └──────┬───────┘
               │               │                │
               │               ▼                │
               │       ┌───────────────┐        │
               │       │   ML SERVICE  │        │
               │       └───────┬───────┘        │
               │               │                │
               │               ▼                │
               │       ┌───────────────┐        │
               │       │ MODEL ARTIFACT│        │
               │       └───────┬───────┘        │
               │               │                │
               └───────────────┼────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      SQLALCHEMY     │
                    │    DATABASE LAYER   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      POSTGRESQL     │
                    │                     │
                    │ Students            │
                    │ Academic Records    │
                    │ Study Habits        │
                    │ Predictions         │
                    │ Model Versions      │
                    └─────────────────────┘


        OFFLINE ML PIPELINE
        ────────────────────

 Dataset
    │
    ▼
 Validation
    │
    ▼
 Cleaning
    │
    ▼
 EDA
    │
    ▼
 Feature Engineering
    │
    ▼
 Train/Test Split
    │
    ▼
 Model Training
    │
    ▼
 Evaluation
    │
    ▼
 Model Selection
    │
    ▼
 Versioning
    │
    ▼
 Model Artifact
    │
    └──────────────► ML SERVICE
```

---

# 17. ARCHITECTURAL BOUNDARIES

The following boundaries MUST be maintained.

### Frontend

Responsible for:

* presentation
* user interaction
* client-side validation
* API communication

NOT responsible for:

* database access
* ML training
* model selection

### Backend

Responsible for:

* API
* validation
* business logic
* authentication/authorization where implemented
* database interaction
* ML inference orchestration

NOT responsible for:

* frontend rendering
* exploratory notebook analysis

### ML Layer

Responsible for:

* preprocessing
* training
* evaluation
* model serialization
* inference

NOT responsible for:

* HTTP request handling
* UI rendering
* direct user interaction

### Database

Responsible for:

* persistent application data
* student records
* academic records
* study habits
* predictions
* model metadata

---

# 18. SOURCE OF TRUTH

The architecture follows this hierarchy:

```text
                 USER INTERFACE
                       │
                       ▼
                 FASTAPI API
                       │
                       ▼
               APPLICATION LOGIC
                       │
              ┌────────┴────────┐
              ▼                 ▼
          ML SERVICE        DATABASE
              │                 │
              ▼                 ▼
         MODEL ARTIFACTS    PERSISTENT DATA
```

The frontend is NOT the source of truth.

The ML model is NOT the source of application records.

PostgreSQL is the source of truth for persistent application data.

---

# 19. PHASE DEPENDENCIES

```text
PHASE 01
Project Setup
     │
     ▼
PHASE 02
Database
     │
     ▼
PHASE 03
Dataset + Data Pipeline
     │
     ▼
PHASE 04
EDA
     │
     ▼
PHASE 05
ML
     │
     ▼
PHASE 06
Backend
     │
     ▼
PHASE 07
Frontend
     │
     ▼
PHASE 08
Integration
     │
     ▼
PHASE 09
Testing
     │
     ▼
PHASE 10
Production + Documentation
```

Do not bypass dependency order unless explicitly approved.

---

# 20. ARCHITECTURE CHANGE POLICY

Any change affecting the following requires architectural review:

* database schema
* API contract
* ML pipeline
* technology stack
* frontend/backend communication
* model artifact strategy
* authentication architecture
* deployment architecture

Small implementation changes do not require architectural review.

If an implementation discovers that the architecture is insufficient, STOP before making a major structural change and report:

1. Current architecture
2. Problem discovered
3. Proposed change
4. Files affected
5. Impact on future phases

---

# 21. ANTIGRAVITY READING POLICY

When working on a phase, Antigravity should NOT read every architecture document.

Use:

```text
AGENTS.md
+
CURRENT PHASE FILE
+
ONLY DIRECTLY RELEVANT SOURCE FILES
```

Architecture documents should be consulted selectively.

For example:

### Database phase

Read:

```text
AGENTS.md
docs/02_ARCHITECTURE.md
docs/03_DATABASE.md
phases/PHASE_02_DATABASE.md
```

Do NOT automatically read:

```text
docs/05_ML_SPEC.md
phases/PHASE_07_FRONTEND.md
phases/PHASE_08_INTEGRATION.md
```

### ML phase

Read:

```text
AGENTS.md
docs/02_ARCHITECTURE.md
docs/04_DATASET.md
docs/05_ML_SPEC.md
phases/PHASE_05_ML.md
```

Do not scan unrelated frontend files.

---

# 22. ARCHITECTURE SUCCESS CRITERIA

The architecture is considered successful when:

* frontend is separated from backend
* backend is separated from ML
* ML training is separated from inference
* database is separated from application logic
* data pipeline is reproducible
* predictions are persisted
* model versions are traceable
* APIs are clearly defined
* future phases can be implemented independently
* the project can be tested and reproduced

---

END OF ARCHITECTURE SPECIFICATION
