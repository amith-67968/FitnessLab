"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

export default function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, userEmail, logout } = useAppContext();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-t-0 border-x-0">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
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
          <span className="font-bold text-lg tracking-tight text-white">
            AI Fitness
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {[
            { href: "/", label: "Home" },
            { href: "/questions", label: "Analyze" },
            { href: "/result", label: "Results" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Auth State */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {userEmail.charAt(0)}
                </div>
                <span className="text-sm text-white/70 hidden sm:block max-w-[120px] truncate">
                  {userEmail}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-sm text-white/50 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="ml-4 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
