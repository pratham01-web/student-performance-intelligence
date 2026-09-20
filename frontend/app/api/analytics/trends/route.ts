import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    semester_trends: [
      { semester: "Semester 1", average_marks: 63.2, average_attendance: 78.1, student_count: 500 },
      { semester: "Semester 2", average_marks: 63.9, average_attendance: 77.8, student_count: 500 },
      { semester: "Semester 3", average_marks: 64.1, average_attendance: 78.2, student_count: 500 },
      { semester: "Semester 4", average_marks: 63.8, average_attendance: 77.8, student_count: 500 },
    ],
    attendance_bands: [
      { band: "<60%", student_count: 210, pass_rate: 58.5, average_marks: 48.2 },
      { band: "60-74%", student_count: 590, pass_rate: 82.4, average_marks: 59.6 },
      { band: "75-89%", student_count: 820, pass_rate: 93.6, average_marks: 66.8 },
      { band: "90-100%", student_count: 380, pass_rate: 98.2, average_marks: 74.3 },
    ],
    study_hour_bands: [
      { habit_range: "<2 Hours", student_count: 450, average_marks: 52.4 },
      { habit_range: "2-4 Hours", student_count: 850, average_marks: 61.8 },
      { habit_range: "4-6 Hours", student_count: 520, average_marks: 69.5 },
      { habit_range: ">6 Hours", student_count: 180, average_marks: 78.2 },
    ],
  });
}
