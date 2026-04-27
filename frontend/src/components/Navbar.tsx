"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { logoutUser } from "@/services/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, userEmail, logout } = useAppContext();
  const useLandingNavbar =
    pathname === "/" ||
    pathname === "/auth" ||
    pathname === "/questions" ||
    pathname === "/result" ||
    pathname === "/workout";
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/questions", label: "Analyze" },
    { href: "/result", label: "Results" },
  ];

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Even if the API call fails, still log out locally
    }
    logout();
    router.push("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        useLandingNavbar
          ? "border-b border-slate-200/80 bg-white/92 backdrop-blur-xl"
          : "glass-card rounded-none border-t-0 border-x-0"
      }`}
    >
      <div className="w-full px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              useLandingNavbar
                ? "bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-500/20"
                : "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40"
            }`}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span
            className={`font-bold text-lg tracking-tight ${
              useLandingNavbar ? "text-blue-600" : "text-white"
            }`}
          >
            FITNESSLAB PRO
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? useLandingNavbar
                    ? "text-blue-600 underline underline-offset-8 decoration-2"
                    : "bg-white/10 text-white"
                  : useLandingNavbar
                    ? "text-slate-500 hover:text-slate-900"
                    : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          </div>

          {isLoggedIn ? (
            <div
              className={`flex items-center gap-3 ml-4 pl-4 ${
                useLandingNavbar ? "border-l border-slate-200/80" : "border-l border-white/10"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {userEmail.charAt(0)}
                </div>
                <span
                  className={`text-sm hidden sm:block max-w-[120px] truncate ${
                    useLandingNavbar ? "text-slate-600" : "text-white/70"
                  }`}
                >
                  {userEmail}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className={`text-sm transition-colors ${
                  useLandingNavbar
                    ? "text-slate-500 hover:text-red-500"
                    : "text-white/50 hover:text-red-400"
                }`}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="ml-4 flex items-center gap-3">
              <Link
                href="/auth"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  useLandingNavbar
                    ? "text-slate-700 hover:text-slate-950"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 ${
                  useLandingNavbar
                    ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25"
                }`}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
