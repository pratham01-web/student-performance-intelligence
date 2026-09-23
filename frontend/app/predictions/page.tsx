"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Eye,
  History,
} from "lucide-react";
import { api, PredictionHistoryItem } from "@/lib/api";

export default function PredictionAuditLogsPage() {
  const [items, setItems] = useState<PredictionHistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PredictionHistoryItem | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getPredictionHistory(page, pageSize);
      setItems(res.items);
      setTotal(res.total);
    } catch (err: unknown) {
      console.error("Failed to load audit history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-900">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <History className="h-4 w-4" />
            Evaluation Registry
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Academic Evaluation Logs
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Historical records of student performance projections and counseling assessments.
          </p>
        </div>
        <Link
          href="/predict"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black shadow-sm hover:bg-neutral-200 transition-all self-start cursor-pointer"
        >
          <BrainCircuit className="h-4 w-4" />
          Evaluate Student
        </Link>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-850 bg-black/60 backdrop-blur-md shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-850 bg-neutral-950 text-neutral-400 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Log ID</th>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Serving Model</th>
                <th className="px-6 py-3.5">Predicted Marks</th>
                <th className="px-6 py-3.5">Pass Probability</th>
                <th className="px-6 py-3.5">Outcome</th>
                <th className="px-6 py-3.5 text-right">Feature Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-neutral-500">
                    Loading inference logs...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                    <p>No historical predictions logged yet.</p>
                    <Link href="/predict" className="mt-2 text-white font-medium inline-block hover:underline">
                      Generate your first prediction &rarr;
                    </Link>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isPass = (item.predicted_marks || 0) >= 50;
                  return (
                    <tr key={item.id} className="hover:bg-neutral-900/50 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-neutral-300 font-bold">#{item.id}</td>
                      <td className="px-6 py-3.5 text-neutral-400">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-neutral-300 text-[11px]">
                        {item.model_version}
                      </td>
                      <td className="px-6 py-3.5 font-bold text-white text-sm">
                        {item.predicted_marks?.toFixed(1)}%
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-neutral-300">
                        {item.pass_probability ? `${(item.pass_probability * 100).toFixed(1)}%` : "N/A"}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            isPass
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                              : "bg-rose-950/80 text-rose-400 border border-rose-800/60"
                          }`}
                        >
                          {isPass ? "PASS" : "FAIL"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="inline-flex items-center gap-1 font-medium text-neutral-200 hover:text-white cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Features
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-neutral-900 px-6 py-3 bg-neutral-950/80 text-xs text-neutral-400">
          <div>
            Showing <span className="font-semibold text-neutral-200">{items.length}</span> of{" "}
            <span className="font-semibold text-neutral-200">{total}</span> logged inferences
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="inline-flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Prev
            </button>
            <span className="font-medium text-neutral-300">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="inline-flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 cursor-pointer"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Inspection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-xl border border-neutral-800 bg-black p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
              <div>
                <span className="text-xs text-neutral-400 font-mono">Inference Record #{selectedItem.id}</span>
                <h3 className="text-base font-bold text-white">Input Feature Audit Snapshot</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-neutral-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                <div>
                  <span className="text-neutral-500">Predicted Score:</span>
                  <div className="text-base font-bold text-white">
                    {selectedItem.predicted_marks?.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-neutral-500">Pass Probability:</span>
                  <div className="text-base font-bold text-neutral-200">
                    {selectedItem.pass_probability ? `${(selectedItem.pass_probability * 100).toFixed(1)}%` : "N/A"}
                  </div>
                </div>
              </div>

              <div>
                <span className="font-semibold text-neutral-300 block mb-2">Payload JSON Data:</span>
                <pre className="rounded-lg bg-neutral-950 p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto border border-neutral-800">
                  {JSON.stringify(selectedItem.input_features, null, 2)}
                </pre>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-800 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
