"""Model training and evaluation module for Student Performance Intelligence System.

Trains baseline models (Linear Regression, Logistic Regression) and comparison models
(Random Forest Regressor, Random Forest Classifier), computes rigorous evaluation metrics,
and serializes fitted artifacts to ml/artifacts/.
"""
import datetime
import json
import os
import sys
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    precision_score,
    r2_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split

BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(BASE_DIR))

from ml.preprocessing.pipeline import ALL_INPUT_FEATURES, build_preprocessor

DATA_PATH = BASE_DIR / "ml" / "data" / "student_performance_dataset.csv"
ARTIFACTS_DIR = BASE_DIR / "ml" / "artifacts"
RANDOM_SEED = 42


def train_and_evaluate(data_path: Path = DATA_PATH, artifacts_dir: Path = ARTIFACTS_DIR) -> dict:
    """Execute complete model training, benchmarking, and serialization pipeline."""
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} samples from {data_path.name}.")

    X = df[ALL_INPUT_FEATURES]
    y_reg = df["exam_score"]
    y_clf = df["passed"]

    # Stratified split based on classification outcome
    X_train, X_test, y_reg_train, y_reg_test, y_clf_train, y_clf_test = train_test_split(
        X, y_reg, y_clf, test_size=0.2, random_state=RANDOM_SEED, stratify=y_clf
    )
    print(f"Train split: {len(X_train)} samples | Test split: {len(X_test)} samples")

    # Fit preprocessor on training data
    preprocessor = build_preprocessor()
    X_train_transformed = preprocessor.fit_transform(X_train)
    X_test_transformed = preprocessor.transform(X_test)
    joblib.dump(preprocessor, artifacts_dir / "preprocessor.joblib")
    print("Fitted and saved preprocessor.joblib")

    training_timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
    metadata = {
        "training_run_id": f"run_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}",
        "trained_at": training_timestamp,
        "dataset_version": "v1.0.0",
        "random_seed": RANDOM_SEED,
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "features": ALL_INPUT_FEATURES,
        "models": {},
    }

    # =========================================================================
    # 1. REGRESSION MODELS (Marks Prediction)
    # =========================================================================
    print("\n--- Training Regression Models ---")

    # Model 1A: Linear Regression (Mandated Baseline)
    lr = LinearRegression(fit_intercept=True)
    lr.fit(X_train_transformed, y_reg_train)
    lr_pred = lr.predict(X_test_transformed)
    lr_mae = float(mean_absolute_error(y_reg_test, lr_pred))
    lr_rmse = float(np.sqrt(mean_squared_error(y_reg_test, lr_pred)))
    lr_r2 = float(r2_score(y_reg_test, lr_pred))
    print(f"[LinearRegression]  MAE: {lr_mae:.3f} | RMSE: {lr_rmse:.3f} | R2: {lr_r2:.4f}")

    joblib.dump(lr, artifacts_dir / "marks_linear_regression.joblib")
    metadata["models"]["marks_linear_regression"] = {
        "model_name": "marks_linear_regression",
        "algorithm": "LinearRegression",
        "task": "regression",
        "version": "v1.0.0",
        "parameters": {"fit_intercept": True},
        "metrics": {"mae": round(lr_mae, 3), "rmse": round(lr_rmse, 3), "r2": round(lr_r2, 4)},
        "artifact_path": "ml/artifacts/marks_linear_regression.joblib",
    }

    # Model 1B: Random Forest Regressor (Comparison)
    rf_reg = RandomForestRegressor(n_estimators=120, max_depth=10, min_samples_split=4, random_state=RANDOM_SEED)
    rf_reg.fit(X_train_transformed, y_reg_train)
    rf_pred = rf_reg.predict(X_test_transformed)
    rf_mae = float(mean_absolute_error(y_reg_test, rf_pred))
    rf_rmse = float(np.sqrt(mean_squared_error(y_reg_test, rf_pred)))
    rf_r2 = float(r2_score(y_reg_test, rf_pred))
    print(f"[RandomForestRegressor] MAE: {rf_mae:.3f} | RMSE: {rf_rmse:.3f} | R2: {rf_r2:.4f}")

    joblib.dump(rf_reg, artifacts_dir / "marks_random_forest.joblib")
    metadata["models"]["marks_random_forest"] = {
        "model_name": "marks_random_forest",
        "algorithm": "RandomForestRegressor",
        "task": "regression",
        "version": "v1.0.0",
        "parameters": {"n_estimators": 120, "max_depth": 10, "min_samples_split": 4},
        "metrics": {"mae": round(rf_mae, 3), "rmse": round(rf_rmse, 3), "r2": round(rf_r2, 4)},
        "artifact_path": "ml/artifacts/marks_random_forest.joblib",
    }

    # Deploy best regression model as active default
    best_reg = "marks_linear_regression" if lr_r2 >= rf_r2 else "marks_random_forest"
    active_reg_model = lr if best_reg == "marks_linear_regression" else rf_reg
    joblib.dump(active_reg_model, artifacts_dir / "marks_regressor.joblib")
    metadata["active_regression_model"] = best_reg
    print(f"Selected active marks predictor: {best_reg}")

    # =========================================================================
    # 2. CLASSIFICATION MODELS (Pass/Fail Prediction)
    # =========================================================================
    print("\n--- Training Classification Models ---")

    # Model 2A: Logistic Regression (Mandated Baseline)
    log_reg = LogisticRegression(C=1.0, max_iter=1000, random_state=RANDOM_SEED)
    log_reg.fit(X_train_transformed, y_clf_train)
    log_pred = log_reg.predict(X_test_transformed)
    log_prob = log_reg.predict_proba(X_test_transformed)[:, 1]

    log_acc = float(accuracy_score(y_clf_test, log_pred))
    log_prec = float(precision_score(y_clf_test, log_pred))
    log_rec = float(recall_score(y_clf_test, log_pred))
    log_f1 = float(f1_score(y_clf_test, log_pred))
    log_auc = float(roc_auc_score(y_clf_test, log_prob))
    log_cm = confusion_matrix(y_clf_test, log_pred).tolist()
    print(f"[LogisticRegression] Acc: {log_acc:.4f} | F1: {log_f1:.4f} | AUC: {log_auc:.4f}")

    joblib.dump(log_reg, artifacts_dir / "pass_fail_logistic_regression.joblib")
    metadata["models"]["pass_fail_logistic_regression"] = {
        "model_name": "pass_fail_logistic_regression",
        "algorithm": "LogisticRegression",
        "task": "classification",
        "version": "v1.0.0",
        "parameters": {"C": 1.0, "max_iter": 1000},
        "metrics": {
            "accuracy": round(log_acc, 4),
            "precision": round(log_prec, 4),
            "recall": round(log_rec, 4),
            "f1": round(log_f1, 4),
            "roc_auc": round(log_auc, 4),
            "confusion_matrix": log_cm,
        },
        "artifact_path": "ml/artifacts/pass_fail_logistic_regression.joblib",
    }

    # Model 2B: Random Forest Classifier (Comparison)
    rf_clf = RandomForestClassifier(n_estimators=120, max_depth=8, random_state=RANDOM_SEED)
    rf_clf.fit(X_train_transformed, y_clf_train)
    rf_clf_pred = rf_clf.predict(X_test_transformed)
    rf_clf_prob = rf_clf.predict_proba(X_test_transformed)[:, 1]

    rf_acc = float(accuracy_score(y_clf_test, rf_clf_pred))
    rf_prec = float(precision_score(y_clf_test, rf_clf_pred))
    rf_rec = float(recall_score(y_clf_test, rf_clf_pred))
    rf_f1 = float(f1_score(y_clf_test, rf_clf_pred))
    rf_auc = float(roc_auc_score(y_clf_test, rf_clf_prob))
    rf_cm = confusion_matrix(y_clf_test, rf_clf_pred).tolist()
    print(f"[RandomForestClassifier] Acc: {rf_acc:.4f} | F1: {rf_f1:.4f} | AUC: {rf_auc:.4f}")

    joblib.dump(rf_clf, artifacts_dir / "pass_fail_random_forest.joblib")
    metadata["models"]["pass_fail_random_forest"] = {
        "model_name": "pass_fail_random_forest",
        "algorithm": "RandomForestClassifier",
        "task": "classification",
        "version": "v1.0.0",
        "parameters": {"n_estimators": 120, "max_depth": 8},
        "metrics": {
            "accuracy": round(rf_acc, 4),
            "precision": round(rf_prec, 4),
            "recall": round(rf_rec, 4),
            "f1": round(rf_f1, 4),
            "roc_auc": round(rf_auc, 4),
            "confusion_matrix": rf_cm,
        },
        "artifact_path": "ml/artifacts/pass_fail_random_forest.joblib",
    }

    # Deploy best classification model as active default
    best_clf = "pass_fail_logistic_regression" if log_f1 >= rf_f1 else "pass_fail_random_forest"
    active_clf_model = log_reg if best_clf == "pass_fail_logistic_regression" else rf_clf
    joblib.dump(active_clf_model, artifacts_dir / "pass_fail_classifier.joblib")
    metadata["active_classification_model"] = best_clf
    print(f"Selected active pass/fail predictor: {best_clf}")

    # Save model metadata JSON
    meta_path = artifacts_dir / "model_metadata.json"
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved complete model metadata to: {meta_path}")

    return metadata


if __name__ == "__main__":
    train_and_evaluate()
