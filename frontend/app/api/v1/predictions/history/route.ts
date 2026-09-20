import { NextRequest, NextResponse } from "next/server";

const DEMO_HISTORY = [
  {
    id: 1,
    student_id: 1,
    model_version: "Production Model v1.0",
    prediction_type: "both",
    predicted_marks: 74.8,
    pass_probability: 0.985,
    input_features: { study_hours: 5.0, attendance: 88.0, previous_marks: 70.0, sleep_hours: 7.5, screen_time: 2.0, study_days: 5, class_level: "10th", semester: "Semester 1" },
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    student_id: 3,
    model_version: "Production Model v1.0",
    prediction_type: "both",
    predicted_marks: 48.2,
    pass_probability: 0.421,
    input_features: { study_hours: 1.5, attendance: 55.0, previous_marks: 45.0, sleep_hours: 5.5, screen_time: 6.0, study_days: 3, class_level: "9th", semester: "Semester 1" },
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 3,
    student_id: 8,
    model_version: "Production Model v1.0",
    prediction_type: "both",
    predicted_marks: 68.5,
    pass_probability: 0.945,
    input_features: { study_hours: 4.0, attendance: 82.0, previous_marks: 65.0, sleep_hours: 7.0, screen_time: 3.0, study_days: 5, class_level: "11th", semester: "Semester 2" },
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("page_size") || "20", 10);

  return NextResponse.json({
    items: DEMO_HISTORY,
    total: DEMO_HISTORY.length,
    page,
    page_size: pageSize,
  });
}
