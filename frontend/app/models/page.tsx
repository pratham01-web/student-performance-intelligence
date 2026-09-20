"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle,
  Database,
  FileCode,
  GraduationCap,
  Layers,
  Sparkles,
} from "lucide-react";
import { api, ModelComparison, ModelVersion } from "@/lib/api";

export default function ModelGovernancePage() {
  const [comparison, setComparison] = useState<ModelComparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadModels() {
      try {
        setLoading(true);
        const res = await api.compareModels().catch(() => null);
        setComparison(res);
      } catch (err) {
        console.error("Failed to load models:", err);
      } finally {
        setLoading(false);
      }
    }
    loadModels();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <GraduationCap className="h-4 w-4" />
            Governance &amp; Experiment Tracking
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Machine Learning Model Registry
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Auditable benchmark metrics, algorithm comparisons, and production deployment statuses.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <span className="text-xs text-slate-400 font-medium">Serving Marks Model</span>
          <div className="mt-2 text-xl font-bold text-white">
            {comparison?.active_regression || "marks_linear_regression"}
          </div>
          <p className="mt-1 text-xs text-emerald-400">LinearRegression &bull; R² = 0.7662</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <span className="text-xs text-slate-400 font-medium">Serving Classifier</span>
          <div className="mt-2 text-xl font-bold text-white">
            {comparison?.active_classification || "pass_fail_logistic_regression"}
          </div>
          <p className="mt-1 text-xs text-emerald-400">LogisticRegression &bull; F1 = 0.9228</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <span className="text-xs text-slate-400 font-medium">Feature Pipeline</span>
          <div className="mt-2 text-xl font-bold text-white">ColumnTransformer</div>
          <p className="mt-1 text-xs text-blue-400">StandardScaler + OneHotEncoder</p>
        </div>
      </div>

      {/* Comparison Tables */}
      <div className="space-y-8">
        {/* Regression Models */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-400" />
                Continuous Marks Prediction Models (Regression)
              </h2>
              <p className="text-xs text-slate-400">Evaluated on 400 holdout test samples</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-blue-950 text-blue-400 border border-blue-800 font-mono">
              Target: exam_score (0-100)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                <tr>
                  <th className="py-3">Model Name</th>
                  <th className="py-3">Algorithm</th>
                  <th className="py-3">MAE (Lower = Better)</th>
                  <th className="py-3">RMSE (Lower = Better)</th>
                  <th className="py-3">R² Score (Higher = Better)</th>
                  <th className="py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr className="bg-blue-950/20">
                  <td className="py-3 font-semibold text-white">marks_linear_regression</td>
                  <td className="py-3 font-mono text-slate-300">LinearRegression</td>
                  <td className="py-3 text-emerald-400 font-bold">4.58 marks</td>
                  <td className="py-3 text-emerald-400 font-bold">5.77 marks</td>
                  <td className="py-3 text-emerald-400 font-bold">0.7662</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      ACTIVE
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-slate-300">marks_random_forest</td>
                  <td className="py-3 font-mono text-slate-400">RandomForestRegressor</td>
                  <td className="py-3 text-slate-300">4.80 marks</td>
                  <td className="py-3 text-slate-300">6.01 marks</td>
                  <td className="py-3 text-slate-300">0.7457</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                      Benchmark
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Classification Models */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Pass/Fail Classification Models
              </h2>
              <p className="text-xs text-slate-400">Cutoff threshold: exam_score &gt;= 50.0</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
              Target: passed (0 / 1)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                <tr>
                  <th className="py-3">Model Name</th>
                  <th className="py-3">Algorithm</th>
                  <th className="py-3">Accuracy</th>
                  <th className="py-3">Precision</th>
                  <th className="py-3">Recall</th>
                  <th className="py-3">F1-Score</th>
                  <th className="py-3">ROC-AUC</th>
                  <th className="py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr className="bg-emerald-950/20">
                  <td className="py-3 font-semibold text-white">pass_fail_logistic_regression</td>
                  <td className="py-3 font-mono text-slate-300">LogisticRegression</td>
                  <td className="py-3 text-emerald-400 font-bold">88.50%</td>
                  <td className="py-3 text-emerald-400 font-bold">90.38%</td>
                  <td className="py-3 text-emerald-400 font-bold">94.24%</td>
                  <td className="py-3 text-emerald-400 font-bold">0.9228</td>
                  <td className="py-3 text-emerald-400 font-bold">0.9222</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      ACTIVE
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-slate-300">pass_fail_random_forest</td>
                  <td className="py-3 font-mono text-slate-400">RandomForestClassifier</td>
                  <td className="py-3 text-slate-300">85.00%</td>
                  <td className="py-3 text-slate-300">88.19%</td>
                  <td className="py-3 text-slate-300">92.20%</td>
                  <td className="py-3 text-slate-300">0.9016</td>
                  <td className="py-3 text-slate-300">0.9134</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                      Benchmark
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Attribution Architecture */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-purple-400" />
            Preprocessing &amp; Input Feature Schemas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2 p-4 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="font-semibold text-slate-200">Numerical Scaler: StandardScaler</span>
              <p className="text-slate-400">
                Transforms features to zero mean and unit variance. Prevents features with wider scales (like attendance and previous marks) from dominating smaller magnitude habit metrics.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {["previous_marks", "attendance", "study_hours", "sleep_hours", "screen_time", "study_days", "age"].map((f) => (
                  <span key={f} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 font-mono text-[11px]">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="font-semibold text-slate-200">Categorical Encoder: OneHotEncoder</span>
              <p className="text-slate-400">
                Converts discrete categorical labels into sparse indicator vectors with <code>handle_unknown=&quot;ignore&quot;</code> to prevent inference crashes on unseen categories.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {["gender", "class_level", "semester"].map((f) => (
                  <span key={f} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 font-mono text-[11px]">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
