# PHASE 05 — ML PREPROCESSING, TRAINING & MODEL EVALUATION

**Document:** PHASE_05_ML.md  
**Project:** Student Performance Intelligence System  
**Phase:** 05  
**Status:** Completed  

---

## 1. PHASE OBJECTIVE

The objective of Phase 5 is to build, train, benchmark, evaluate, and serialize the machine learning models required by the Student Performance Intelligence System, fulfilling all requirements in Sections 8, 9, 10, and 11 of [`AGENTS.md`](file:///c:/ML%20projects/student-performance-intelligence/AGENTS.md).

Phase 5 establishes:
- Standardized, reproducible scikit-learn `ColumnTransformer` (`ml/preprocessing/pipeline.py`).
- Linear Regression marks prediction baseline and Random Forest comparison.
- Logistic Regression pass/fail classification baseline and Random Forest comparison.
- Evaluation metrics suite (MAE, RMSE, R² for regression; Accuracy, Precision, Recall, F1, ROC-AUC, Confusion Matrix for classification).
- Serialized pipeline artifacts in `ml/artifacts/` with structured version metadata in `ml/artifacts/model_metadata.json`.
- Comprehensive methodology report in `docs/05_ML_METHODOLOGY.md`.

---

## 2. SCOPE OF PHASE 05

### In Scope
- Sklearn preprocessing pipeline integrating `StandardScaler` and `OneHotEncoder`.
- Stratified 80/20 train/test splitting with seed `42`.
- Training execution and evaluation across 4 candidate models:
  1. `LinearRegression` (Active marks predictor, R² = 0.7662)
  2. `RandomForestRegressor` (Benchmark, R² = 0.7457)
  3. `LogisticRegression` (Active pass/fail classifier, F1 = 0.9228, Acc = 88.50%)
  4. `RandomForestClassifier` (Benchmark, F1 = 0.9016, Acc = 85.00%)
- Serialization to `ml/artifacts/`.
- Documentation of methodology and results.

### Out of Scope (Reserved for Future Phases)
- FastAPI REST backend routing, dependency injection, and inference endpoints (Phase 06).
- Frontend prediction studio and analytics dashboards (Phase 07).
- End-to-end integration and load validation (Phases 08 & 09).

---

## 3. DELIVERABLES

1. `ml/preprocessing/pipeline.py` — Preprocessing ColumnTransformer architecture and input formatting helper.
2. `ml/training/train_models.py` — Model training, benchmarking, and artifact serialization script.
3. `ml/evaluation/evaluate.py` — Standalone model evaluation utility.
4. `ml/artifacts/` — Directory containing serialized joblib artifacts and `model_metadata.json`.
5. `docs/05_ML_METHODOLOGY.md` — Authoritative methodology and evaluation report.
6. `phases/PHASE_05_ML.md` — Phase 5 specification and sign-off document.

---

## 4. VERIFICATION CRITERIA

- Training pipeline runs to completion reproducibly and outputs valid `.joblib` files.
- Evaluation metrics are genuine, reproducible, and documented with split parameters.
- Both Linear Regression and Logistic Regression baselines are fully evaluated and deployed as active models.
- Active models achieve required predictive capability (Regression R² > 0.75, Classification Accuracy > 85%).
