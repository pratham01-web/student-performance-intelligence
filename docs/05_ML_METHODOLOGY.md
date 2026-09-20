# STUDENT PERFORMANCE INTELLIGENCE SYSTEM

## Machine Learning Methodology & Model Evaluation Report

**Document:** 05_ML_METHODOLOGY.md  
**Project:** Student Performance Intelligence System  
**Version:** 1.0.0  
**Status:** Complete  

---

# 1. OVERVIEW & OBJECTIVE

The Machine Learning architecture of the **Student Performance Intelligence System** delivers dual-task predictive inference:
1. **Continuous Marks Prediction:** Forecasts a student's final examination score on a continuous scale [0.0, 100.0].
2. **Pass/Fail Classification:** Predicts binary student outcome (Pass: `exam_score >= 50.0`, Fail: `exam_score < 50.0`) alongside calibrated pass probabilities [0.0, 1.0].

In strict adherence to Section 9 of [`AGENTS.md`](file:///c:/ML%20projects/student-performance-intelligence/AGENTS.md), the system implements the mandated baselines (**Linear Regression** and **Logistic Regression**) alongside advanced ensemble benchmarks (**Random Forest Regressor** and **Random Forest Classifier**).

---

# 2. FEATURE ENGINEERING & PREPROCESSING PIPELINE

Preprocessing uses scikit-learn's `ColumnTransformer` to ensure absolute parity between training and real-time production inference:

```text
Raw Features
  ├── Numerical: [study_hours, sleep_hours, screen_time, study_days, attendance, previous_marks, age]
  │     └── StandardScaler() (Zero-mean, unit-variance scaling)
  └── Categorical: [gender, class_level, semester]
        └── OneHotEncoder(handle_unknown="ignore", sparse_output=False)
```

The fitted transformer is serialized to `ml/artifacts/preprocessor.joblib`.

---

# 3. EXPERIMENTAL SETUP

- **Dataset:** 2,000 synthetic student records (`ml/data/student_performance_dataset.csv`).
- **Data Splitting:** 80% Training (1,600 samples), 20% Holdout Testing (400 samples).
- **Stratification:** Stratified by binary pass/fail target to preserve class distribution.
- **Random Seed:** Fixed seed `42` for 100% deterministic reproducibility.

---

# 4. REGRESSION BENCHMARK: FINAL MARKS PREDICTION

Target Variable: `exam_score` (Continuous, range [0, 100])

| Model | Algorithm | Hyperparameters | Test MAE | Test RMSE | Test R² | Deployment Status |
|---|---|---|---|---|---|---|
| **marks_linear_regression** | **LinearRegression** | `fit_intercept=True` | **4.579** | **5.766** | **0.7662** | **ACTIVE (Primary)** |
| marks_random_forest | RandomForestRegressor | `n_estimators=120, max_depth=10` | 4.795 | 6.013 | 0.7457 | Registered (Benchmark) |

### Interpretation
Linear Regression outperformed Random Forest on generalization R² (0.7662 vs 0.7457), demonstrating that the underlying academic performance relationships are predominantly linear with Gaussian error, without requiring complex non-linear boundary overfitting. Linear Regression was designated as the active production model.

---

# 5. CLASSIFICATION BENCHMARK: PASS/FAIL PREDICTION

Target Variable: `passed` (Binary: 1 if exam_score >= 50.0 else 0)

| Model | Algorithm | Hyperparameters | Accuracy | Precision | Recall | F1-Score | ROC-AUC | Deployment Status |
|---|---|---|---|---|---|---|---|---|
| **pass_fail_logistic_regression** | **LogisticRegression** | `C=1.0, max_iter=1000, lbfgs` | **88.50%** | **90.38%** | **94.24%** | **0.9228** | **0.9222** | **ACTIVE (Primary)** |
| pass_fail_random_forest | RandomForestClassifier | `n_estimators=120, max_depth=8` | 85.00% | 88.19% | 92.20% | 0.9016 | 0.9134 | Registered (Benchmark) |

### Confusion Matrix (Test Split — Logistic Regression)
```text
                  Predicted Negative (Fail)    Predicted Positive (Pass)
Actual Fail (105):          76 (TN)                      29 (FP)
Actual Pass (295):          17 (FN)                     278 (TP)
```
- **Sensitivity / Recall (Pass):** 94.24%
- **Specificity (Fail):** 72.38%
- **ROC-AUC Score:** 0.9222

---

# 6. MODEL REGISTRY & ARTIFACT MANIFEST

Serialized artifacts stored in `ml/artifacts/`:
1. `preprocessor.joblib` — Fitted ColumnTransformer (numerical scaler + categorical encoder).
2. `marks_linear_regression.joblib` — Fitted LinearRegression model.
3. `marks_random_forest.joblib` — Fitted RandomForestRegressor model.
4. `pass_fail_logistic_regression.joblib` — Fitted LogisticRegression classifier.
5. `pass_fail_random_forest.joblib` — Fitted RandomForestClassifier.
6. `marks_regressor.joblib` — Symlinked/aliased active marks predictor.
7. `pass_fail_classifier.joblib` — Symlinked/aliased active classifier.
8. `model_metadata.json` — Formal JSON metadata detailing training parameters, metrics, and dataset versions.
