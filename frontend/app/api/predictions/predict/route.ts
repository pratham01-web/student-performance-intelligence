import { NextRequest, NextResponse } from "next/server";
import { calculateEvaluation, EvaluationInput } from "@/lib/ml-engine";

export async function POST(request: NextRequest) {
  try {
    const body: EvaluationInput = await request.json();
    const result = calculateEvaluation(body);

    return NextResponse.json(
      {
        prediction_id: Date.now(),
        student_id: body.student_id || null,
        predicted_marks: result.predicted_marks,
        passed: result.passed,
        pass_probability: result.pass_probability,
        grade_band: result.grade_band,
        risk_level: result.risk_level,
        recommendations: result.recommendations,
        key_factors: result.key_factors,
        model_version: result.model_version,
        prediction_type: "both",
        input_features: {
          study_hours: body.study_hours,
          sleep_hours: body.sleep_hours,
          screen_time: body.screen_time,
          study_days: body.study_days,
          attendance: body.attendance,
          previous_marks: body.previous_marks,
          age: body.age || 16,
          gender: body.gender || "Male",
          class_level: body.class_level || "10th",
          semester: body.semester || "Semester 1",
        },
        created_at: result.created_at,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { detail: error?.message || "Prediction execution error" },
      { status: 400 }
    );
  }
}
