"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { loginUser, signupUser } from "@/services/api";
import axios from "axios";

export default function AuthPage() {
  const router = useRouter();
  const { isLoggedIn, setLoggedIn } = useAppContext();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (isLoggedIn) router.replace("/questions");
  }, [isLoggedIn, router]);

  const validate = (): boolean => {
    const e: { email?: string; password?: string } = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password.trim()) e.password = "Password is required";
    else if (password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    setApiError("");

    try {
      const authFn = mode === "login" ? loginUser : signupUser;
      const data = await authFn(email, password);

      const token = data.access_token;
      const userEmail =
        (data.user as Record<string, unknown>)?.email as string || email;

      if (!token) {
        // Supabase may return empty token for unconfirmed signups
        setApiError(
          mode === "signup"
            ? "Account created! Check your email to confirm, then log in."
            : "Login succeeded but no token was returned."
        );
        if (mode === "signup") setMode("login");
        return;
      }

      setLoggedIn(userEmail, token);
      router.push("/questions");
    } catch (err: unknown) {
      let msg = "Something went wrong. Please try again.";
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        if (typeof detail === "string") msg = detail;
        else if (Array.isArray(detail) && detail.length > 0) msg = detail[0]?.msg || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-16 px-6 overflow-hidden">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card p-8 sm:p-10 fade-in">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
            <p className="text-sm text-white/50 mt-2">{mode === "login" ? "Sign in to access your fitness planner" : "Start your fitness journey today"}</p>
          </div>

          <div className="flex rounded-xl bg-white/5 p-1 mb-8">
            {(["login", "signup"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setErrors({}); setApiError(""); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${mode === m ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg" : "text-white/50 hover:text-white/70"}`}>
                {m === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>

          {apiError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
              <input id="auth-email" type="email" value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }}
                placeholder="you@example.com" className={`input-field ${errors.email ? "error" : ""}`} autoComplete="email" />
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <input id="auth-password" type="password" value={password}
                onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: undefined })); }}
                placeholder="••••••••" className={`input-field ${errors.password ? "error" : ""}`}
                autoComplete={mode === "login" ? "current-password" : "new-password"} />
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
            </div>
            <button id="auth-submit" type="submit" disabled={submitting} className="btn-glow w-full flex items-center justify-center gap-2 mt-2">
              {submitting ? (<><div className="spinner" /><span>Please wait…</span></>) : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
          <p className="text-center text-xs text-white/30 mt-6">By continuing, you agree to our Terms of Service.</p>
        </div>
      </div>
    </div>
  );
}
