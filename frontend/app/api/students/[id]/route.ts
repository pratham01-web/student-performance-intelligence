import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const studentId = parseInt(id, 10);

  return NextResponse.json({
    id: studentId,
    student_code: `STU-${String(studentId).padStart(5, "0")}`,
    name: "Aarav Sharma",
    age: 16,
    gender: "Male",
    class_level: "10th",
    created_at: "2026-09-01T08:00:00Z",
    updated_at: "2026-09-01T08:00:00Z",
    academic_records: [
      { id: 1, semester: "Semester 1", previous_marks: 72.5, attendance: 86.4, exam_score: 75.0 },
      { id: 2, semester: "Semester 2", previous_marks: 75.0, attendance: 88.2, exam_score: 78.4 },
    ],
    study_habits: [
      { id: 1, study_hours: 4.5, sleep_hours: 7.5, screen_time: 2.0, study_days: 5 },
    ],
  });
}
