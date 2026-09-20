# STUDENT PERFORMANCE INTELLIGENCE SYSTEM

## REST API Specification & Reference Documentation

**Document:** 06_API.md  
**Project:** Student Performance Intelligence System  
**Base URL:** `http://localhost:8000/api/v1`  
**Interactive Docs:** `http://localhost:8000/docs` (Swagger UI) / `http://localhost:8000/redoc` (ReDoc)  
**Version:** 1.0.0  

---

# 1. OVERVIEW

The Backend API provides RESTful services for student demographic management, longitudinal academic histories, study habit tracking, real-time machine learning inference, historical audit inspection, and cohort performance analytics.

All requests and responses use standard `application/json` payloads.

---

# 2. SYSTEM ENDPOINTS

## 2.1 Operational Health

### `GET /health`
Returns system operational status.
* **Response `200 OK`:**
  ```json
  {
    "status": "healthy"
  }
  ```

---

# 3. STUDENT MANAGEMENT ENDPOINTS

## 3.1 Register Student
### `POST /api/v1/students`
Creates a new enrolled student profile.
* **Request Body:**
  ```json
  {
    "student_code": "STU-00101",
    "name": "Aarav Sharma",
    "age": 16,
    "gender": "Male",
    "class_level": "10th"
  }
  ```
* **Response `201 Created`:**
  ```json
  {
    "id": 1,
    "student_code": "STU-00101",
    "name": "Aarav Sharma",
    "age": 16,
    "gender": "Male",
    "class_level": "10th",
    "created_at": "2026-09-20T16:20:00Z",
    "updated_at": "2026-09-20T16:20:00Z"
  }
  ```
* **Error `400 Bad Request`:** If `student_code` already exists.

## 3.2 List Students
### `GET /api/v1/students`
Retrieves a paginated list of students with optional search and class level filtering.
* **Query Parameters:**
  - `page` (int, default: 1): Page number
  - `page_size` (int, default: 20, max: 100): Records per page
  - `search` (string, optional): Search by student name or code
  - `class_level` (string, optional): Filter by grade/class
* **Response `200 OK`:**
  ```json
  {
    "items": [...],
    "total": 2000,
    "page": 1,
    "page_size": 20
  }
  ```

## 3.3 Get Student Profile
### `GET /api/v1/students/{id}`
Retrieves a complete student profile with all associated academic records and study habits.
* **Response `200 OK`:**
  ```json
  {
    "id": 1,
    "student_code": "STU-00101",
    "name": "Aarav Sharma",
    "age": 16,
    "gender": "Male",
    "class_level": "10th",
    "created_at": "2026-09-20T16:20:00Z",
    "updated_at": "2026-09-20T16:20:00Z",
    "academic_records": [
      {
        "id": 1,
        "semester": "Semester 1",
        "previous_marks": 78.5,
        "attendance": 88.0,
        "exam_score": 82.0
      }
    ],
    "study_habits": [
      {
        "id": 1,
        "study_hours": 4.5,
        "sleep_hours": 7.5,
        "screen_time": 2.0,
        "study_days": 5
      }
    ]
  }
  ```

## 3.4 Update Student
### `PUT /api/v1/students/{id}`
Modifies student profile attributes.

## 3.5 Delete Student
### `DELETE /api/v1/students/{id}`
Permanently removes a student record and cascades deletion to all child academic and study habit records.
* **Response `204 No Content`**

## 3.6 Append Academic Record
### `POST /api/v1/students/{id}/academic-records`
* **Request Body:**
  ```json
  {
    "semester": "Semester 2",
    "previous_marks": 82.0,
    "attendance": 91.5,
    "exam_score": 86.0
  }
  ```

## 3.7 Append Study Habit
### `POST /api/v1/students/{id}/study-habits`
* **Request Body:**
  ```json
  {
    "study_hours": 5.0,
    "sleep_hours": 7.0,
    "screen_time": 2.5,
    "study_days": 6
  }
  ```

---

# 4. PREDICTION INFERENCE ENDPOINTS

## 4.1 Full Prediction & Audit Logging
### `POST /api/v1/predictions/predict`
Executes dual machine learning inference: continuous marks regression and binary pass/fail classification. The exact input feature dictionary, timestamp, and resulting scores are logged to PostgreSQL for auditability.

* **Request Body:**
  ```json
  {
    "student_id": 1,
    "study_hours": 4.5,
    "sleep_hours": 7.5,
    "screen_time": 2.0,
    "study_days": 5,
    "attendance": 88.0,
    "previous_marks": 78.5,
    "age": 16,
    "gender": "Male",
    "class_level": "10th",
    "semester": "Semester 1"
  }
  ```
* **Response `201 Created`:**
  ```json
  {
    "prediction_id": 15,
    "student_id": 1,
    "predicted_marks": 79.4,
    "passed": 1,
    "pass_probability": 0.9412,
    "model_version": "marks_linear_regression:pass_fail_logistic_regression",
    "prediction_type": "both",
    "input_features": {
      "study_hours": 4.5,
      "sleep_hours": 7.5,
      "screen_time": 2.0,
      "study_days": 5,
      "attendance": 88.0,
      "previous_marks": 78.5,
      "age": 16,
      "gender": "Male",
      "class_level": "10th",
      "semester": "Semester 1"
    },
    "created_at": "2026-09-20T16:50:00Z"
  }
  ```

## 4.2 Fast Continuous Marks Inference
### `POST /api/v1/predictions/marks`
High-speed endpoint returning continuous predicted marks without database write.
* **Response `200 OK`:**
  ```json
  {
    "predicted_marks": 79.4,
    "model_version": "marks_linear_regression",
    "prediction_type": "marks"
  }
  ```

## 4.3 Fast Pass/Fail Classification
### `POST /api/v1/predictions/pass-fail`
High-speed endpoint returning binary pass/fail and confidence probability.
* **Response `200 OK`:**
  ```json
  {
    "passed": 1,
    "pass_probability": 0.9412,
    "model_version": "pass_fail_logistic_regression",
    "prediction_type": "pass_fail"
  }
  ```

## 4.4 Prediction History Logs
### `GET /api/v1/predictions/history`
Retrieves past prediction audit records.
* **Query Parameters:**
  - `page` (int, default: 1)
  - `page_size` (int, default: 20)
  - `student_id` (int, optional): Filter by student

---

# 5. ANALYTICS & COHORT REPORTING ENDPOINTS

## 5.1 Cohort KPI Overview
### `GET /api/v1/analytics/overview`
Computes real-time cohort statistics.
* **Response `200 OK`:**
  ```json
  {
    "total_students": 2000,
    "average_marks": 58.27,
    "pass_rate": 73.85,
    "average_attendance": 77.85,
    "average_study_hours": 3.58,
    "total_predictions": 42
  }
  ```

## 5.2 Performance & Habit Trends
### `GET /api/v1/analytics/trends`
Computes longitudinal term metrics and habit correlation distributions.
* **Response `200 OK`:**
  ```json
  {
    "semester_trends": [
      {
        "semester": "Semester 1",
        "average_marks": 56.4,
        "average_attendance": 76.8,
        "student_count": 512
      }
    ],
    "attendance_bands": [
      {
        "band": "75-89%",
        "student_count": 820,
        "pass_rate": 84.5,
        "average_marks": 62.8
      }
    ],
    "study_hour_bands": [
      {
        "habit_range": "4-6 Hours",
        "average_marks": 67.5,
        "student_count": 540
      }
    ]
  }
  ```

---

# 6. MODEL GOVERNANCE ENDPOINTS

## 6.1 List Models
### `GET /api/v1/models`
Retrieves registered model versions, algorithms, evaluation metrics, and active flags.

## 6.2 Model Comparison
### `GET /api/v1/models/comparison`
Returns comparative benchmark evaluation across Linear Regression, Logistic Regression, and Random Forest models.
