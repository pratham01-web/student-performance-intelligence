"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BookOpen,
  BrainCircuit,
  Calendar,
  Clock,
  GraduationCap,
  History,
  Monitor,
  Moon,
  Plus,
  TrendingUp,
  User,
} from "lucide-react";
import { api, PredictionHistoryItem, StudentDetail } from "@/lib/api";

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const studentId = parseInt(resolvedParams.id);

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [predictions, setPredictions] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const [studentData, historyData] = await Promise.all([
          api.getStudent(studentId),
          api.getPredictionHistory(1, 10, studentId).catch(() => ({ items: [], total: 0 })),
        ]);
        setStudent(studentData);
        setPredictions(historyData.items);
      } catch (err: any) {
        setError(err?.message || "Failed to load student profile");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [studentId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-400">
        Loading student profile...
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
        <div className="text-rose-400 text-sm font-semibold">{error || "Student not found"}</div>
        <Link
          href="/students"
          className="inline-flex items-center gap-2 text-xs text-blue-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Student Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/students"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Students Directory
        </Link>
        <Link
          href="/predict"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-all self-start"
        >
          <BrainCircuit className="h-4 w-4" />
          Run Prediction for Student
        </Link>
      </div>

      {/* Student Profile Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-xl">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-white">{student.name}</h1>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-blue-400 border border-slate-700">
                {student.student_code}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span>{student.class_level} Standard</span>
              <span>&bull;</span>
              <span>{student.gender}</span>
              <span>&bull;</span>
              <span>{student.age} Years Old</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 text-xs text-slate-400">
          <div>
            <div className="text-slate-500">Enrolled On</div>
            <div className="font-semibold text-slate-200 mt-0.5">
              {new Date(student.created_at).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Semesters Logged</div>
            <div className="font-semibold text-slate-200 mt-0.5">
              {student.academic_records.length} Terms
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Academic Records & Study Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Academic Records */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-400" />
              Longitudinal Academic History
            </h2>
          </div>

          {student.academic_records.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No academic records recorded for this student yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {student.academic_records.map((rec) => (
                <div key={rec.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-200">{rec.semester}</div>
                    <div className="text-slate-400 mt-0.5 flex gap-3">
                      <span>Attendance: <strong className="text-emerald-400">{rec.attendance}%</strong></span>
                      <span>Prior Marks: <strong className="text-blue-400">{rec.previous_marks}%</strong></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[11px] block">Realized Score</span>
                    <span className="text-sm font-bold text-white">
                      {rec.exam_score !== null && rec.exam_score !== undefined
                        ? `${rec.exam_score}%`
                        : "In Progress"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Study Habits */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              Behavioral &amp; Lifestyle Habits
            </h2>
          </div>

          {student.study_habits.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No study habit records recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {student.study_habits.map((habit) => (
                <div key={habit.id} className="py-3.5 space-y-2 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
                    <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Study Time
                      </div>
                      <div className="text-sm font-bold text-blue-400 mt-0.5">{habit.study_hours} hrs/d</div>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Moon className="h-3 w-3" /> Sleep Time
                      </div>
                      <div className="text-sm font-bold text-purple-400 mt-0.5">{habit.sleep_hours} hrs/d</div>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Monitor className="h-3 w-3" /> Screen Time
                      </div>
                      <div className="text-sm font-bold text-rose-400 mt-0.5">{habit.screen_time || 0} hrs/d</div>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Study Days
                      </div>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">{habit.study_days || 0} d/wk</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Historical Inference Log for This Student */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
          <History className="h-4 w-4 text-blue-400" />
          ML Prediction History for this Student
        </h2>

        {predictions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No inferences generated for this student yet. Use the Predictor Studio to forecast outcomes.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-2.5">Date &amp; Time</th>
                  <th className="py-2.5">Model</th>
                  <th className="py-2.5">Predicted Marks</th>
                  <th className="py-2.5">Pass Probability</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {predictions.map((p) => {
                  const isPass = (p.predicted_marks || 0) >= 50;
                  return (
                    <tr key={p.id}>
                      <td className="py-2.5 text-slate-400">
                        {new Date(p.created_at).toLocaleString()}
                      </td>
                      <td className="py-2.5 font-mono text-[11px] text-slate-400">{p.model_version}</td>
                      <td className="py-2.5 font-bold text-white">{p.predicted_marks?.toFixed(1)}%</td>
                      <td className="py-2.5 font-semibold text-blue-400">
                        {p.pass_probability ? `${(p.pass_probability * 100).toFixed(1)}%` : "N/A"}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isPass ? "bg-emerald-950 text-emerald-400" : "bg-rose-950 text-rose-400"
                          }`}
                        >
                          {isPass ? "PASS" : "FAIL"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
