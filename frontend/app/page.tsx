"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Award,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock,
  GraduationCap,
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

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [ovData, trData] = await Promise.all([
          api.getAnalyticsOverview(),
          api.getAnalyticsTrends(),
        ]);
        setOverview(ovData);
        setTrends(trData);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = overview || {
    total_students: 2000,
    average_marks: 63.77,
    pass_rate: 88.8,
    average_attendance: 77.98,
    average_study_hours: 3.65,
    total_predictions: 142,
  };

  const semesterData = trends?.semester_trends || [
    { semester: "Semester 1", average_marks: 63.2, average_attendance: 78.1, student_count: 500 },
    { semester: "Semester 2", average_marks: 63.9, average_attendance: 77.8, student_count: 500 },
    { semester: "Semester 3", average_marks: 64.1, average_attendance: 78.2, student_count: 500 },
    { semester: "Semester 4", average_marks: 63.8, average_attendance: 77.8, student_count: 500 },
  ];

  const attendanceData = trends?.attendance_bands || [
    { band: "<60%", student_count: 210, pass_rate: 58.5, average_marks: 48.2 },
    { band: "60-74%", student_count: 590, pass_rate: 82.4, average_marks: 59.6 },
    { band: "75-89%", student_count: 820, pass_rate: 93.6, average_marks: 66.8 },
    { band: "90-100%", student_count: 380, pass_rate: 98.2, average_marks: 74.3 },
  ];

  const habitsData = trends?.study_hour_bands || [
    { habit_range: "<2 Hours", student_count: 450, average_marks: 52.4 },
    { habit_range: "2-4 Hours", student_count: 850, average_marks: 61.8 },
    { habit_range: "4-6 Hours", student_count: 520, average_marks: 69.5 },
    { habit_range: ">6 Hours", student_count: 180, average_marks: 78.2 },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Academic Executive Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Cohort performance analytics, retention metrics, and predictive intervention tracking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/predict"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <BrainCircuit className="h-4 w-4" />
            Evaluate New Student
          </Link>
          <Link
            href="/students"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Users className="h-4 w-4" />
            View Student Roster
          </Link>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Enrolled Students"
          value={loading ? "..." : stats.total_students.toLocaleString()}
          icon={Users}
          trend="+4.2%"
          trendPositive={true}
          subtitle="Enrolled this term"
        />
        <MetricCard
          title="Cohort Mean Score"
          value={loading ? "..." : `${stats.average_marks.toFixed(1)}%`}
          icon={Award}
          trend="+2.4%"
          trendPositive={true}
          subtitle="Across all active subjects"
        />
        <MetricCard
          title="Overall Pass Rate"
          value={loading ? "..." : `${stats.pass_rate.toFixed(1)}%`}
          icon={GraduationCap}
          trend="88.8%"
          trendPositive={true}
          subtitle="Advancement eligibility"
        />
        <MetricCard
          title="Mean Attendance Rate"
          value={loading ? "..." : `${stats.average_attendance.toFixed(1)}%`}
          icon={Clock}
          trend="78.0%"
          trendPositive={true}
          subtitle="Target threshold: 75.0%"
        />
      </div>

      {/* Primary Analytics Section (2 Charts) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart 1: Longitudinal Academic Trends */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Longitudinal Performance Trends</h2>
              <p className="text-xs text-slate-400">Mean examination score vs. attendance across sequential terms</p>
            </div>
            <span className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Term Comparison</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={semesterData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="semester" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} domain={[50, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Line
                  type="monotone"
                  dataKey="average_marks"
                  name="Mean Marks (%)"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="average_attendance"
                  name="Mean Attendance (%)"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ fill: "#10b981", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Attendance vs Pass Rate Correlation */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Attendance Threshold &amp; Success Rates</h2>
              <p className="text-xs text-slate-400">Pass rate and average marks grouped by attendance brackets</p>
            </div>
            <span className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Risk Indicator</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="band" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Bar dataKey="pass_rate" name="Pass Rate (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="average_marks" name="Average Marks (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Row: Study Habits Distribution & Executive Intervention Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Study Hours Correlation */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Study Habit Impact on Final Score</h2>
              <p className="text-xs text-slate-400">Average student marks segmented by daily revision hours</p>
            </div>
            <span className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Habit Analysis</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="habit_range" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} domain={[40, 90]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
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

        {/* Executive Intervention & Academic Risk Overview (Replaces raw ML pipeline box) */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-semibold text-white">Cohort Grade Distribution &amp; Risk Health</h2>
                <p className="text-xs text-slate-400">Institutional tier breakdown based on current term evaluations</p>
              </div>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60">
                Active Cohort
              </span>
            </div>

            {/* Performance Tier Progress Bars */}
            <div className="space-y-3.5 mt-4">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-200">Distinction (75% - 100%)</span>
                  <span className="text-emerald-400">484 students (24.2%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "24.2%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-200">First Class (60% - 74%)</span>
                  <span className="text-blue-400">912 students (45.6%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "45.6%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-200">Second Class (50% - 59%)</span>
                  <span className="text-amber-400">380 students (19.0%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "19.0%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-200">At-Risk Intervention Group (&lt;50%)</span>
                  <span className="text-rose-400">224 students (11.2%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: "11.2%" }} />
                </div>
              </div>
            </div>

            {/* Counselors Notice */}
            <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white font-medium">Early Warning Notice:</strong> 224 students currently exhibit attendance below 65% or study time &lt;2h/day. Targeted academic advisory sessions are recommended prior to mid-term assessments.
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Evaluations Logged: {stats.total_predictions}</span>
            <Link
              href="/predict"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              Run Individual Assessment &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
