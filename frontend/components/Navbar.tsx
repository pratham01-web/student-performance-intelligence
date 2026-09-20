"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  GraduationCap,
  History,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: BarChart3 },
  { label: "Students", href: "/students", icon: Users },
  { label: "Predictor", href: "/predict", icon: BrainCircuit },
  { label: "Audit Logs", href: "/predictions", icon: History },
  { label: "Model Governance", href: "/models", icon: GraduationCap },
];

export function Navbar() {
  const pathname = usePathname();
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    api
      .checkHealth()
      .then(() => setIsHealthy(true))
      .catch(() => setIsHealthy(false));
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <Link href="/" className="text-base font-bold tracking-tight text-slate-100 hover:text-white">
              Student Performance Intelligence
            </Link>
            <p className="text-xs text-slate-400">Production ML Analytics &amp; Scoring</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* System Health Status */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${
              isHealthy === true
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/60"
                : isHealthy === false
                ? "bg-rose-950/60 text-rose-400 border-rose-800/60"
                : "bg-slate-900 text-slate-400 border-slate-800"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isHealthy === true
                  ? "bg-emerald-500 animate-pulse"
                  : isHealthy === false
                  ? "bg-rose-500"
                  : "bg-slate-500"
              }`}
            />
            <span>{isHealthy === true ? "API Online" : isHealthy === false ? "Offline" : "Connecting..."}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
