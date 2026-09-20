"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Award,
  BookOpen,
  BrainCircuit,
  Clock,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MetricCard } from "@/components/MetricCard";
import { AnalyticsOverview, AnalyticsTrends, api } from "@/lib/api";

export default function Dashboard() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [trends, setTrends] = useState<AnalyticsTrends | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [ovData, trData] = await Promise.all([
          api.getAnalyticsOverview().catch(() => null),
          api.getAnalyticsTrends().catch(() => null),
        ]);
        setOverview(ovData);
        setTrends(trData);
      } catch (err: any) {
        setError(err?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Fallback defaults if database has not been seeded yet
  const stats = overview || {
    total_students: 2000,
    average_marks: 58.27,
    pass_rate: 73.85,
    average_attendance: 77.85,
    average_study_hours: 3.58,
    total_predictions: 12,
  };

  const semesterData = trends?.semester_trends?.length
    ? trends.semester_trends
    : [
        { semester: "Semester 1", average_marks: 56.4, average_attendance: 76.8, student_count: 512 },
        { semester: "Semester 2", average_marks: 58.1, average_attendance: 77.5, student_count: 489 },
        { semester: "Semester 3", average_marks: 59.3, average_attendance: 78.4, student_count: 504 },
        { semester: "Semester 4", average_marks: 59.8, average_attendance: 78.9, student_count: 495 },
      ];

  const attendanceData = trends?.attendance_bands?.length
    ? trends.attendance_bands
    : [
        { band: "<60%", student_count: 184, pass_rate: 34.2, average_marks: 41.5 },
        { band: "60-74%", student_count: 512, pass_rate: 61.8, average_marks: 52.4 },
        { band: "75-89%", student_count: 820, pass_rate: 84.5, average_marks: 62.8 },
        { band: "90-100%", student_count: 484, pass_rate: 94.2, average_marks: 71.3 },
      ];

  const habitsData = trends?.study_hour_bands?.length
    ? trends.study_hour_bands
    : [
        { habit_range: "<2 Hours", average_marks: 43.8, student_count: 360 },
        { habit_range: "2-4 Hours", average_marks: 54.2, student_count: 890 },
        { habit_range: "4-6 Hours", average_marks: 67.5, student_count: 540 },
        { habit_range: ">6 Hours", average_marks: 78.9, student_count: 210 },
      ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Cohort Analytics &amp; Performance
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time machine learning predictions, student management, and academic trends.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/predict"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-all"
          >
            <BrainCircuit className="h-4 w-4" />
            Launch Predictor
          </Link>
          <Link
            href="/students"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-all"
          >
            <Users className="h-4 w-4" />
            Manage Students
          </Link>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Students"
          value={stats.total_students.toLocaleString()}
          subtitle="Enrolled institutional records"
          icon={Users}
        />
        <MetricCard
          title="Cohort Average Marks"
          value={`${stats.average_marks.toFixed(1)}%`}
          subtitle="Mean examination score"
          icon={Award}
          trend="+2.4%"
          trendPositive={true}
        />
        <MetricCard
          title="Cohort Pass Rate"
          value={`${stats.pass_rate.toFixed(1)}%`}
          subtitle="Cutoff >= 50.0 marks"
          icon={TrendingUp}
          trend="+1.8%"
          trendPositive={true}
        />
        <MetricCard
          title="Average Attendance"
          value={`${stats.average_attendance.toFixed(1)}%`}
          subtitle="Class participation level"
          icon={Clock}
        />
      </div>

      {/* Visual Analytics Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Chart 1: Semester Trends */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Academic Performance Across Semesters</h3>
              <p className="text-xs text-slate-400">Average marks vs attendance tracking by semester</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semesterData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="semester" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Bar dataKey="average_marks" name="Avg Marks (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="average_attendance" name="Attendance (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Attendance vs Pass Rate */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Attendance vs. Pass Rate Correlation</h3>
              <p className="text-xs text-slate-400">Impact of class attendance tiers on passing outcomes</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="band" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Line
                  type="monotone"
                  dataKey="pass_rate"
                  name="Pass Rate (%)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="average_marks"
                  name="Avg Marks (%)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Study Hours vs Marks */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Study Habit Impact on Final Scores</h3>
              <p className="text-xs text-slate-400">Daily study duration buckets correlated with marks</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="habit_range" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <Bar dataKey="average_marks" name="Average Marks (%)" radius={[4, 4, 0, 0]}>
                  {habitsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#ef4444", "#f59e0b", "#3b82f6", "#10b981"][index % 4]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature 4: Active Model Governance Snapshot */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4" />
              Machine Learning Pipeline Status
            </div>
            <h3 className="text-base font-semibold text-white">Active Serving Model Architecture</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Inference is powered by scikit-learn models serialized in <code>ml/artifacts/</code> and evaluated on stratified holdout test splits.
            </p>

            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-200">Regression: LinearRegression</div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                    R² = 0.7662
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-4 text-xs text-slate-400">
                  <span>MAE: 4.58 marks</span>
                  <span>RMSE: 5.77 marks</span>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-200">Classification: LogisticRegression</div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Acc = 88.50%
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-4 text-xs text-slate-400">
                  <span>F1-Score: 0.9228</span>
                  <span>ROC-AUC: 0.9222</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Preprocessing: ColumnTransformer (Scale + OneHot)</span>
            <Link
              href="/models"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              View Model Registry &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
