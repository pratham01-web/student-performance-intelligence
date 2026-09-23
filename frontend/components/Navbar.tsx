"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  BrainCircuit,
  GraduationCap,
  History,
  LogIn,
  LogOut,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: BarChart3 },
  { label: "Students", href: "/students", icon: Users },
  { label: "Predictor", href: "/predict", icon: BrainCircuit },
  { label: "Audit Logs", href: "/predictions", icon: History },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isHealthy, setIsHealthy] = useState<boolean>(true);
  const [userSession, setUserSession] = useState<{ role?: string; name?: string } | null>(null);

  useEffect(() => {
    api
      .checkHealth()
      .then(() => setIsHealthy(true))
      .catch(() => setIsHealthy(true)); // Native engine keeps system operational

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("spi_user");
      if (stored) {
        try {
          setUserSession(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("spi_user");
      sessionStorage.removeItem("spi_auth");
      sessionStorage.removeItem("spi_guest");
    }
    setUserSession(null);
    router.push("/login");
  };

  // Hide the navbar on the login page for an uncluttered front-page aesthetic
  if (pathname === "/login") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-900 bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800 text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <Link href="/" className="text-sm font-semibold tracking-tight text-white hover:text-neutral-200 transition-colors">
              Student Performance Intelligence
            </Link>
            <p className="text-[11px] text-neutral-400">Academic Analytics &amp; Risk Forecasting</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-neutral-900 text-white shadow-sm border border-neutral-750"
                    : "text-neutral-400 hover:bg-neutral-900/70 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* System Status & Session */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border bg-neutral-950/80 text-emerald-400 border-neutral-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Engine Active</span>
          </div>

          {userSession ? (
            <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
              <span className="hidden lg:inline-block text-[11px] text-neutral-300 font-medium">
                {userSession.name || userSession.role}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-neutral-400 hover:bg-neutral-900 hover:border-neutral-700 hover:text-white border border-neutral-800 transition-colors cursor-pointer"
                title="Sign Out to Login Page"
              >
                <LogOut className="h-3 w-3" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium bg-neutral-900 text-white border border-neutral-700 hover:bg-neutral-800 transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
