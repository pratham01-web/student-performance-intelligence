"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Award,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock,
  History,
  Info,
  Monitor,
  Moon,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { api, PredictionInput, PredictionResult } from "@/lib/api";

export default function PredictionStudio() {
  const [formData, setFormData] = useState<PredictionInput>({
    study_hours: 4.5,
    sleep_hours: 7.5,
    screen_time: 2.5,
    study_days: 5,
    attendance: 85.0,
    previous_marks: 72.0,
    age: 16,
    gender: "Male",
    class_level: "10th",
    semester: "Semester 1",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSliderChange = (field: keyof PredictionInput, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: keyof PredictionInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.predictPerformance(formData);
      setResult(response);
    } catch (err: any) {
      setError(err?.message || "Failed to execute inference");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <BrainCircuit className="h-4 w-4" />
            Machine Learning Inference Studio
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Student Performance Predictor
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Enter academic and habit parameters to predict continuous marks and pass/fail probability.
          </p>
        </div>
        <Link
          href="/predictions"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-all self-start"
        >
          <History className="h-4 w-4" />
          Audit History
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Input Parameters Form (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
          <h2 className="text-base font-semibold text-white mb-1">Student Academic &amp; Behavioral Parameters</h2>
          <p className="text-xs text-slate-400 mb-6">
            Adjust the sliders to simulate different study routines and past performance profiles.
          </p>

          <form onSubmit={handlePredict} className="space-y-6">
            {/* Row 1: Demographics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Class Level</label>
                <select
                  value={formData.class_level}
                  onChange={(e) => handleSelectChange("class_level", e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="9th">9th Standard</option>
                  <option value="10th">10th Standard</option>
                  <option value="11th">11th Standard</option>
                  <option value="12th">12th Standard</option>
                  <option value="Undergraduate">Undergraduate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Semester / Term</label>
                <select
                  value={formData.semester}
                  onChange={(e) => handleSelectChange("semester", e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Semester 3">Semester 3</option>
                  <option value="Semester 4">Semester 4</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleSelectChange("gender", e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Sliders: Previous Marks */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-300 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-blue-400" />
                  Previous Semester Marks
                </span>
                <span className="font-bold text-blue-400">{formData.previous_marks}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="0.5"
                value={formData.previous_marks}
                onChange={(e) => handleSliderChange("previous_marks", parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>30%</span>
                <span>65%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Sliders: Attendance */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  Class Attendance
                </span>
                <span className="font-bold text-emerald-400">{formData.attendance}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="0.5"
                value={formData.attendance}
                onChange={(e) => handleSliderChange("attendance", parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>40%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Sliders: Daily Study Hours */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-300 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                  Daily Study Hours
                </span>
                <span className="font-bold text-indigo-400">{formData.study_hours} hrs/day</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12"
                step="0.5"
                value={formData.study_hours}
                onChange={(e) => handleSliderChange("study_hours", parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0.5h</span>
                <span>6.0h</span>
                <span>12.0h</span>
              </div>
            </div>

            {/* Sliders: Sleep Hours */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-300 flex items-center gap-1.5">
                  <Moon className="h-3.5 w-3.5 text-purple-400" />
                  Daily Sleep Duration (Optimal ~7-8 hrs)
                </span>
                <span className="font-bold text-purple-400">{formData.sleep_hours} hrs/night</span>
              </div>
              <input
                type="range"
                min="4"
                max="10"
                step="0.5"
                value={formData.sleep_hours}
                onChange={(e) => handleSliderChange("sleep_hours", parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Sliders: Screen Time */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-300 flex items-center gap-1.5">
                  <Monitor className="h-3.5 w-3.5 text-rose-400" />
                  Non-Academic Screen Time
                </span>
                <span className="font-bold text-rose-400">{formData.screen_time} hrs/day</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={formData.screen_time}
                onChange={(e) => handleSliderChange("screen_time", parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              <BrainCircuit className="h-4 w-4" />
              {loading ? "Running Machine Learning Inference..." : "Generate Performance Prediction"}
            </button>
          </form>
        </div>

        {/* Prediction Results Display (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {error && (
            <div className="rounded-xl border border-rose-800 bg-rose-950/60 p-4 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {result ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md shadow-lg space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-medium text-slate-400">Predicted Outcome</span>
                  <h3 className="text-lg font-bold text-white">Inference Summary</h3>
                </div>
                <div
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${
                    result.passed
                      ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                      : "bg-rose-950 text-rose-400 border-rose-800"
                  }`}
                >
                  {result.passed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                  <span>{result.passed ? "LIKELY TO PASS" : "AT RISK OF FAILING"}</span>
                </div>
              </div>

              {/* Main Score Display */}
              <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-6 text-center space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Predicted Final Exam Score
                </span>
                <div className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                  {result.predicted_marks.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500">Continuous Linear Regression Forecast (0–100%)</div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-800 rounded-full h-2.5 mt-4 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      result.predicted_marks >= 75
                        ? "bg-emerald-500"
                        : result.predicted_marks >= 50
                        ? "bg-blue-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, result.predicted_marks))}%` }}
                  />
                </div>
              </div>

              {/* Pass Probability Card */}
              <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-400">Pass Probability</div>
                  <div className="text-xl font-bold text-white">
                    {(result.pass_probability * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <span>Classification Confidence:</span>
                  <div className="font-semibold text-emerald-400">
                    {result.pass_probability >= 0.8
                      ? "High Confidence"
                      : result.pass_probability >= 0.5
                      ? "Moderate Confidence"
                      : "High Risk"}
                  </div>
                </div>
              </div>

              {/* Inference Metadata & Audit confirmation */}
              <div className="rounded-lg bg-slate-950/40 p-4 border border-slate-800/80 text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Serving Model:</span>
                  <span className="font-mono text-slate-200">{result.model_version}</span>
                </div>
                {result.prediction_id && (
                  <div className="flex justify-between text-slate-400">
                    <span>Audit Log ID:</span>
                    <span className="font-mono text-blue-400">#{result.prediction_id}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Audited Timestamp:</span>
                  <span className="font-mono text-slate-300">
                    {new Date(result.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  href="/predictions"
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View full audit entry in log table &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center flex flex-col items-center justify-center h-full min-h-[350px]">
              <div className="h-12 w-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200">No Prediction Generated Yet</h3>
              <p className="mt-1 text-xs text-slate-400 max-w-xs">
                Adjust the input parameters on the left and click &quot;Generate Performance Prediction&quot; to run real-time inference.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
