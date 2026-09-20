export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 antialiased">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
          <div className="flex items-center space-x-3">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              System Online
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-950 text-blue-400 border border-blue-800">
            Phase 1 — Project Foundation
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
          Student Performance Intelligence System
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          End-to-end machine learning system for student academic performance analysis,
          mark prediction, and pass/fail probability forecasting.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="text-xs font-medium text-slate-400 mb-1">Frontend Stack</div>
            <div className="text-sm font-semibold text-slate-200">Next.js 15 &bull; TypeScript &bull; Tailwind CSS</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="text-xs font-medium text-slate-400 mb-1">Backend Stack</div>
            <div className="text-sm font-semibold text-slate-200">FastAPI &bull; Python 3.10 &bull; Pydantic &bull; SQLAlchemy</div>
          </div>
        </div>

        <div className="rounded-lg bg-slate-950/70 border border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Status</span>
            <span className="font-mono text-emerald-400">Foundation Verified</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Database models, data pipelines, ML inference, and dashboard interfaces will be implemented in subsequent phases.
          </div>
        </div>
      </div>
    </main>
  );
}
