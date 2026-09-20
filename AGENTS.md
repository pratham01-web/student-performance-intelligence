# STUDENT PERFORMANCE INTELLIGENCE SYSTEM

## Antigravity Master Project Instructions

---

## 1. PROJECT IDENTITY

Project Name:
Student Performance Intelligence System

Project Type:
Production-oriented Machine Learning application

Internship:
IBM Machine Learning Internship — Shiksha Vertex

Primary Objective:
Build a professional end-to-end ML system that predicts student academic performance and pass/fail probability based on academic, attendance, study-habit, and related features.

The project must demonstrate BOTH:

1. Machine Learning knowledge
2. Software engineering ability

This must NOT look like a basic Kaggle notebook, college assignment, or automatically generated "vibe-coded" application.

---

# 2. CORE REQUIREMENT

The internship project requirements include:

* Data preprocessing
* Exploratory Data Analysis
* Linear Regression
* Logistic Regression
* Feature scaling
* Train/test split
* Model evaluation
* Predicted result
* Model accuracy

The system should implement these requirements while extending them into a complete ML application.

---

# 3. FINAL PRODUCT

The final system should provide:

### Student Management

* Create student records
* View student records
* Update student information
* Store academic information
* Store attendance information
* Store study-habit information

### Machine Learning

* Predict student marks
* Predict pass/fail outcome
* Calculate pass probability
* Compare multiple models
* Store model metrics
* Store model versions
* Store prediction history

### Analytics

* Student performance trends
* Pass/fail distribution
* Attendance analysis
* Study-hours analysis
* Prediction statistics
* Model performance comparison

### Application

* Professional web dashboard
* Backend API
* PostgreSQL database
* ML inference pipeline
* Input validation
* Error handling
* Testing
* Documentation

---

# 4. TECHNOLOGY STACK

Use the following stack unless a documented technical reason requires a change.

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Recharts

### Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy

### Database

* PostgreSQL

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* Matplotlib
* Seaborn

### Development

* Git
* GitHub
* Docker

Optional:

* MLflow for experiment/model tracking

Do NOT introduce unnecessary technologies simply to make the project appear complex.

---

# 5. ENGINEERING PRINCIPLES

The project must follow these principles:

### Separation of concerns

Do NOT place everything inside one Python file.

Separate:

* API
* database
* business logic
* ML preprocessing
* ML training
* ML inference
* configuration
* schemas
* tests

### Reproducibility

ML training must be reproducible.

Use:

* fixed random seeds
* configuration files
* deterministic preprocessing where possible
* versioned model artifacts

### No hardcoded application data

Do NOT hardcode:

* prediction results
* dashboard statistics
* student records
* model metrics

Application data must come from the API/database.

### No fake ML

Do NOT create UI elements that pretend to perform ML.

Every prediction displayed by the frontend must come from the actual trained model through the backend API.

### No unnecessary complexity

Do not add Kubernetes, microservices, Redis, Kafka, cloud infrastructure, etc. unless explicitly requested.

The goal is professional engineering, not technology quantity.

---

# 6. DATA POLICY

The internship did not provide a dataset.

Therefore:

1. Identify a suitable public dataset OR
2. Create a clearly documented synthetic dataset.

Never represent synthetic data as real-world data.

If a public dataset is used:

* record the source
* record the license if available
* document the original features
* document transformations

If synthetic data is used:

* document the generation methodology
* document feature distributions
* document assumptions
* clearly label it as synthetic

The dataset must be reproducible.

---

# 7. DATABASE POLICY

PostgreSQL is the source of truth for application data.

Expected entities include:

* students
* academic_records
* study_habits
* predictions
* model_versions

The exact schema must be finalized during the database phase.

Use:

* primary keys
* foreign keys
* appropriate constraints
* timestamps
* indexes where justified

Avoid unnecessary denormalization.

---

# 8. ML POLICY

The ML system must contain separate stages:

```text
Raw Data
   ↓
Validation
   ↓
Cleaning
   ↓
Preprocessing
   ↓
Feature Engineering
   ↓
Train/Test Split
   ↓
Model Training
   ↓
Evaluation
   ↓
Model Selection
   ↓
Model Serialization
   ↓
Inference
```

The preprocessing used during training MUST also be applied during inference.

Do not duplicate preprocessing logic manually.

Prefer sklearn Pipeline and ColumnTransformer where appropriate.

---

# 9. REQUIRED MODELS

At minimum:

### Marks Prediction

Linear Regression

Additional comparison models may include:

* Random Forest Regressor
* Gradient Boosting Regressor

### Pass/Fail Prediction

Logistic Regression

Additional comparison models may include:

* Random Forest Classifier
* Gradient Boosting Classifier

Do not add models without a reason.

---

# 10. MODEL EVALUATION

For regression:

* MAE
* RMSE
* R²

For classification:

* Accuracy
* Precision
* Recall
* F1-score
* Confusion Matrix

Do not report metrics without identifying:

* dataset split
* evaluation dataset
* model version
* relevant preprocessing

Never fabricate metrics.

---

# 11. MODEL VERSIONING

Every trained production model should have identifiable metadata.

Example:

```text
model_name
model_type
version
training_date
dataset_version
features
metrics
```

Prediction records should identify which model version generated the prediction.

---

# 12. API REQUIREMENTS

The backend should expose clear REST endpoints.

Expected categories:

### Students

* Create student
* Get student
* List students
* Update student

### Predictions

* Predict marks
* Predict pass/fail
* Get prediction history

### Analytics

* Student statistics
* Performance statistics
* Model statistics

### Models

* List model versions
* Get model metrics

Exact API contracts must be defined before implementation.

---

# 13. FRONTEND REQUIREMENTS

The frontend must NOT be designed before the backend/API contract is reasonably stable.

Required UI areas:

* Dashboard
* Student management
* Student details
* Prediction form
* Prediction result
* Prediction history
* Model analytics

Design goals:

* professional
* clean
* consistent
* responsive
* accessible
* data-driven

Avoid excessive animations, unnecessary gradients, fake charts, and generic AI-dashboard aesthetics.

---

# 14. TESTING

The final project must include tests for:

### Data

* missing values
* invalid values
* unexpected categories

### ML

* preprocessing
* prediction shape
* model loading
* inference

### API

* valid request
* invalid request
* missing fields
* error responses

### Database

* record creation
* relationships
* prediction persistence

Tests should verify actual behavior.

---

# 15. DOCUMENTATION

The final project must contain:

* README
* Architecture documentation
* Database documentation
* Dataset documentation
* ML methodology
* API documentation
* Setup instructions
* Testing instructions
* Limitations
* Future improvements

Documentation must describe the actual implementation.

Do not generate documentation containing features that do not exist.

---

# 16. DEVELOPMENT PHASES

The project must be developed in the following order.

### PHASE 01

Project setup and repository structure

### PHASE 02

Database architecture and PostgreSQL implementation

### PHASE 03

Dataset acquisition/generation and data ingestion

### PHASE 04

EDA and data quality analysis

### PHASE 05

ML preprocessing, training and evaluation

### PHASE 06

FastAPI backend and inference API

### PHASE 07

Frontend dashboard

### PHASE 08

Backend/frontend/database integration

### PHASE 09

Testing, validation and security review

### PHASE 10

Dockerization, documentation and final production preparation

Do not skip phases.

Do not implement future phases early unless explicitly instructed.

---

# 17. PHASE EXECUTION RULE

IMPORTANT:

Antigravity must work ONLY on the phase explicitly requested by the user.

When starting a phase:

1. Read this AGENTS.md.
2. Read ONLY the requested phase file.
3. Read only the existing source files required to complete that phase.
4. Inspect dependencies/interfaces that are directly relevant.
5. Implement the phase.
6. Run appropriate validation/tests.
7. Report what was completed.
8. Report any blockers.
9. STOP.

Do NOT automatically continue to the next phase.

---

# 18. CONTEXT / CREDIT OPTIMIZATION

Do NOT recursively read the entire repository.

Do NOT read every documentation file.

Do NOT inspect unrelated source files.

Do NOT regenerate existing working code.

Before modifying a file:

1. Determine whether the file is relevant.
2. Read only the necessary section.
3. Make the smallest clean change required.

Prefer targeted inspection over repository-wide inspection.

---

# 19. CODE QUALITY

Code must be:

* readable
* modular
* typed where appropriate
* documented where necessary
* testable
* maintainable

Avoid:

* giant files
* duplicate logic
* unexplained magic numbers
* unused dependencies
* dead code
* unnecessary abstraction
* placeholder implementations presented as finished features

---

# 20. DECISION POLICY

When requirements are ambiguous:

1. Prefer the simplest professional solution.
2. Follow existing architecture.
3. Do not introduce a new technology without justification.
4. Do not silently make major architectural decisions.
5. If a decision materially affects future phases, stop and ask the user.

Minor implementation decisions can be made autonomously.

Major architecture changes require confirmation.

---

# 21. DEFINITION OF DONE

A phase is NOT complete merely because code was generated.

A phase is complete only when:

* implementation exists
* relevant tests/checks pass
* no obvious errors remain
* implementation matches the phase specification
* documentation is updated where required
* existing functionality has not unnecessarily been broken

---

# 22. FINAL QUALITY STANDARD

The finished project should be understandable to a technical reviewer.

A reviewer should be able to answer:

1. What problem does this solve?
2. Where did the data come from?
3. How was the data processed?
4. Why were these models selected?
5. How were the models evaluated?
6. How does prediction work?
7. Where is the prediction stored?
8. How does the frontend communicate with the backend?
9. Can the project be reproduced?
10. Can another developer run it?

If these questions cannot be answered from the repository, the project is incomplete.

---

# 23. CURRENT EXECUTION STATUS

Current phase:

PHASE 02 (Completed)

Do not implement Phase 03 or later until explicitly instructed.


---

END OF MASTER INSTRUCTIONS
