"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  BrainCircuit,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";

// Dynamically import Strands to guarantee client-side WebGL canvas initialization
const Strands = dynamic(() => import("@/components/Strands"), {
  ssr: false,
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@university.edu");
  const [password, setPassword] = useState("••••••••");
  const [role, setRole] = useState("Administrator");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const sessionData = {
        email: email || "admin@university.edu",
        role: role,
        name:
          role === "Administrator"
            ? "Dr. Pratham (Lead Analyst)"
            : role === "Faculty"
            ? "Prof. J. Sharma"
            : "Student Scholar",
        loggedInAt: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("spi_user", JSON.stringify(sessionData));
        sessionStorage.setItem("spi_auth", "true");
      }

      setIsLoading(false);
      router.push("/");
    }, 600);
  };

  const handleQuickDemo = (demoRole: string, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("university2026");
    setRole(demoRole);
  };

  const handleGuestEntry = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("spi_guest", "true");
      localStorage.setItem(
        "spi_user",
        JSON.stringify({
          email: "guest@university.edu",
          role: "Guest Auditor",
          name: "Guest Academic Reviewer",
          loggedInAt: new Date().toISOString(),
        })
      );
    }
    router.push("/");
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col justify-between overflow-x-hidden selection:bg-neutral-800 selection:text-white">
      {/* Top Ambient Subtle Dark Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-gradient-to-b from-neutral-900/30 via-neutral-950/20 to-transparent pointer-events-none blur-3xl" />

      {/* Header Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 border border-neutral-800 text-white shadow-sm">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-neutral-300">
              Enterprise Academic Analytics
            </span>
            <p className="text-[11px] text-neutral-500">Machine Learning Intelligence System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGuestEntry}
            className="text-xs font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-neutral-900 border border-transparent hover:border-neutral-800 cursor-pointer"
          >
            <span>Explore Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4 sm:px-6">
        
        {/* Project Title & Subtitle Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-950 text-neutral-300 text-xs font-medium mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            <span>Academic Performance Analytics &amp; Risk Intelligence</span>
          </div>
          
          {/* Bigger Font Project Name */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3">
            <span className="bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
              Student Performance Intelligence
            </span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto font-normal">
            Predictive academic risk forecasting, marks estimation, and institutional decision support powered by machine learning models.
          </p>
        </div>

        {/* Strands Component Interactive Stage */}
        <div className="w-full max-w-5xl relative flex flex-col items-center">
          
          {/* Configured Strands Canvas Container exactly as specified */}
          <div
            style={{ width: "100%", height: "600px", position: "relative" }}
            className="rounded-2xl overflow-hidden border border-neutral-850 bg-black shadow-[0_0_60px_rgba(0,0,0,0.9)]"
          >
            <Strands
              colors={["#F97316", "#7C3AED", "#06B6D4"]}
              count={3}
              speed={0.5}
              amplitude={1}
              waviness={1}
              thickness={0.7}
              glow={2.6}
              taper={3}
              spread={1}
              intensity={0.6}
              saturation={1.5}
              opacity={1}
              scale={1.5}
              glass={false}
              refraction={1}
              dispersion={1}
              glassSize={1}
            />

            {/* Overlaid Clean Floating Pure Black Login Card */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
              <div className="pointer-events-auto w-full max-w-md bg-black/90 backdrop-blur-2xl border border-neutral-800/90 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.95)]">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Portal Access</h2>
                    <p className="text-xs text-neutral-400 mt-0.5">Sign in to access analytics &amp; predictions</p>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email field */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Institutional Email / User ID
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@university.edu"
                        className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3.5 py-2 pl-9 text-sm text-white placeholder-neutral-600 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Security Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3.5 py-2 pl-9 pr-9 text-sm text-white placeholder-neutral-600 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-neutral-800 bg-neutral-950 text-white focus:ring-0"
                      />
                      <span>Remember session</span>
                    </label>
                    <span className="text-neutral-400 hover:text-white hover:underline cursor-pointer">
                      Institutional SSO
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-lg hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-all cursor-pointer disabled:opacity-70"
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                        <span>Authenticating...</span>
                      </span>
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Demo Autofill options */}
                <div className="mt-5 pt-4 border-t border-neutral-900">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-medium text-neutral-400">Quick Demo Access:</span>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 1-Click Fill
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemo("Administrator", "admin@university.edu")}
                      className={`px-2 py-1.5 text-[11px] rounded-md border text-center transition-all cursor-pointer ${
                        role === "Administrator"
                          ? "bg-neutral-900 border-neutral-600 text-white font-medium"
                          : "bg-neutral-950 border-neutral-850 text-neutral-400 hover:border-neutral-700 hover:text-white"
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemo("Faculty", "faculty@university.edu")}
                      className={`px-2 py-1.5 text-[11px] rounded-md border text-center transition-all cursor-pointer ${
                        role === "Faculty"
                          ? "bg-neutral-900 border-neutral-600 text-white font-medium"
                          : "bg-neutral-950 border-neutral-850 text-neutral-400 hover:border-neutral-700 hover:text-white"
                      }`}
                    >
                      Faculty
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemo("Student", "student@university.edu")}
                      className={`px-2 py-1.5 text-[11px] rounded-md border text-center transition-all cursor-pointer ${
                        role === "Student"
                          ? "bg-neutral-900 border-neutral-600 text-white font-medium"
                          : "bg-neutral-950 border-neutral-850 text-neutral-400 hover:border-neutral-700 hover:text-white"
                      }`}
                    >
                      Student
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Black Footer */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-2 border-t border-neutral-900">
        <div>
          <span>Student Performance Intelligence System • Academic Risk Forecasting</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Machine Learning Engine Active
          </span>
          <button
            onClick={handleGuestEntry}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Bypass to Dashboard →
          </button>
        </div>
      </footer>
    </div>
  );
}
