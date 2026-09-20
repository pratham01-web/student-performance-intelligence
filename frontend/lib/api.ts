/**
 * API client layer for communicating with the FastAPI backend.
 * Adheres to AGENTS.md Section 7: Frontend -> FastAPI -> Database.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:8000");

export interface Student {
  id: number;
  student_code: string;
  name: string;
  age: number;
  gender: string;
  class_level: string;
  created_at: string;
  updated_at: string;
}

export interface AcademicRecord {
  id: number;
  semester: string;
  previous_marks: number;
  attendance: number;
  exam_score?: number | null;
}

export interface StudyHabit {
  id: number;
  study_hours: number;
  sleep_hours: number;
  screen_time?: number | null;
  study_days?: number | null;
}

export interface StudentDetail extends Student {
  academic_records: AcademicRecord[];
  study_habits: StudyHabit[];
}

export interface StudentListResponse {
  items: Student[];
  total: number;
  page: number;
  page_size: number;
}

export interface PredictionInput {
  student_id?: number | null;
  study_hours: number;
  sleep_hours: number;
  screen_time: number;
  study_days: number;
  attendance: number;
  previous_marks: number;
  age?: number;
  gender?: string;
  class_level?: string;
  semester?: string;
}

export interface PredictionResult {
  prediction_id?: number;
  student_id?: number | null;
  predicted_marks: number;
  passed: number;
  pass_probability: number;
  model_version: string;
  prediction_type: string;
  input_features: Record<string, any>;
  created_at: string;
}

export interface PredictionHistoryItem {
  id: number;
  student_id?: number | null;
  model_version: string;
  prediction_type: string;
  predicted_marks?: number | null;
  pass_probability?: number | null;
  input_features: Record<string, any>;
  created_at: string;
}

export interface PredictionHistoryResponse {
  items: PredictionHistoryItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface AnalyticsOverview {
  total_students: number;
  average_marks: number;
  pass_rate: number;
  average_attendance: number;
  average_study_hours: number;
  total_predictions: number;
}

export interface SemesterTrend {
  semester: string;
  average_marks: number;
  average_attendance: number;
  student_count: number;
}

export interface AttendanceBand {
  band: string;
  student_count: number;
  pass_rate: number;
  average_marks: number;
}

export interface StudyHourBand {
  habit_range: string;
  average_marks: number;
  student_count: number;
}

export interface AnalyticsTrends {
  semester_trends: SemesterTrend[];
  attendance_bands: AttendanceBand[];
  study_hour_bands: StudyHourBand[];
}

export interface ModelVersion {
  id: number;
  model_name: string;
  algorithm: string;
  version: string;
  dataset_version: string;
  metrics: Record<string, any>;
  parameters?: Record<string, any> | null;
  is_active: boolean;
  artifact_path?: string | null;
  trained_at: string;
  created_at: string;
}

export interface ModelComparison {
  models: ModelVersion[];
  active_regression: string;
  active_classification: string;
}

// ==========================================
// API REQUEST METHODS
// ==========================================

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`API Error ${res.status}: ${errorBody || res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error(`Fetch failure on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Health
  checkHealth: () => fetchAPI<{ status: string }>("/health"),

  // Analytics
  getAnalyticsOverview: () => fetchAPI<AnalyticsOverview>("/api/v1/analytics/overview"),
  getAnalyticsTrends: () => fetchAPI<AnalyticsTrends>("/api/v1/analytics/trends"),

  // Students
  listStudents: (page = 1, pageSize = 20, search?: string, classLevel?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (search) params.append("search", search);
    if (classLevel) params.append("class_level", classLevel);
    return fetchAPI<StudentListResponse>(`/api/v1/students?${params.toString()}`);
  },

  getStudent: (id: number) => fetchAPI<StudentDetail>(`/api/v1/students/${id}`),

  createStudent: (student: {
    student_code: string;
    name: string;
    age: number;
    gender: string;
    class_level: string;
  }) =>
    fetchAPI<Student>("/api/v1/students", {
      method: "POST",
      body: JSON.stringify(student),
    }),

  addAcademicRecord: (
    studentId: number,
    record: { semester: string; previous_marks: number; attendance: number; exam_score?: number }
  ) =>
    fetchAPI<AcademicRecord>(`/api/v1/students/${studentId}/academic-records`, {
      method: "POST",
      body: JSON.stringify(record),
    }),

  addStudyHabit: (
    studentId: number,
    habit: { study_hours: number; sleep_hours: number; screen_time?: number; study_days?: number }
  ) =>
    fetchAPI<StudyHabit>(`/api/v1/students/${studentId}/study-habits`, {
      method: "POST",
      body: JSON.stringify(habit),
    }),

  // Predictions
  predictPerformance: (input: PredictionInput) =>
    fetchAPI<PredictionResult>("/api/v1/predictions/predict", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  getPredictionHistory: (page = 1, pageSize = 20, studentId?: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (studentId) params.append("student_id", studentId.toString());
    return fetchAPI<PredictionHistoryResponse>(`/api/v1/predictions/history?${params.toString()}`);
  },

  // Models
  listModels: () => fetchAPI<ModelVersion[]>("/api/v1/models"),
  compareModels: () => fetchAPI<ModelComparison>("/api/v1/models/comparison"),
};
