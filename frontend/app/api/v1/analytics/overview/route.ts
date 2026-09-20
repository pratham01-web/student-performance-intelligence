import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    total_students: 2000,
    average_marks: 63.77,
    pass_rate: 88.8,
    average_attendance: 77.98,
    average_study_hours: 3.65,
    total_predictions: 142,
  });
}
