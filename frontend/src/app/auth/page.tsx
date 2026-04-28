"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { getApiBase, loginUser, signupUser } from "@/services/api";

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
    const nextErrors: { email?: string; password?: string } = {};

    if (!email.trim()) nextErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email";

    if (!password.trim()) nextErrors.password = "Password is required";
    else if (password.length < 6) nextErrors.password = "Min 6 characters";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    setApiError("");

    try {
      const authFn = mode === "login" ? loginUser : signupUser;
      const data = await authFn(email, password);

      const token = data.access_token;
      const userEmail =
        ((data.user as Record<string, unknown>)?.email as string) || email;

      if (!token) {
        setApiError(
          mode === "signup"
            ? "Account created. Sign in to continue."
            : "Login succeeded but no token was returned."
        );
        if (mode === "signup") setMode("login");
        return;
      }

      setLoggedIn(userEmail, token);
      router.push("/questions");
    } catch (err: unknown) {
      let message = "Something went wrong. Please try again.";
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          message = `Backend API is unavailable at ${getApiBase()}.`;
        } else {
          const detail = err.response.data?.detail;
          if (typeof detail === "string") message = detail;
          else if (Array.isArray(detail) && detail.length > 0) message = detail[0]?.msg || message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setApiError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="landing-shell min-h-screen overflow-hidden pt-16 lg:h-screen lg:pt-16">
      <div className="landing-backdrop" />

      <section className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col border-y border-slate-200 bg-white">
        <div className="absolute left-1/2 top-0 h-full w-96 -translate-x-1/2 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1),_transparent_72%)]" />

        <div className="relative flex flex-1 items-center justify-center px-6 py-8 sm:px-8 lg:py-6">
          <div className="w-full max-w-[1500px]">
            <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="hidden lg:block">
                <div className="max-w-xl">
                  <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Secure Access
                  </div>
                  <h1 className="mt-6 text-6xl font-black leading-[0.92] tracking-[-0.06em] text-slate-950">
                    {mode === "login" ? "Welcome Back." : "Create Your Account."}
                  </h1>
                  <p className="mt-6 max-w-lg text-xl leading-8 text-slate-600">
                    {mode === "login"
                      ? "Sign in to continue your precision fitness workflow, review results, and launch a new analysis without leaving the same clean dashboard."
                      : "Start your FitnessLab journey with a fast account setup and move straight into your personalized analysis flow."}
                  </p>

                  <div className="mt-10 rounded-[28px] border border-slate-200 bg-slate-50/85 p-7 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                      Athletic Insight
                    </div>
                    <p className="mt-3 text-lg italic leading-8 text-slate-600">
                      &quot;Consistency is the foundation of scientific performance.
                      {mode === "login"
                        ? " Sign in to sync your latest biometric data."
                        : " Create your account to begin building your baseline."}
                      &quot;
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-[540px] rounded-[30px] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:p-10">
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-[0_14px_30px_rgba(37,99,235,0.24)]">
                      <svg
                        className="h-7 w-7 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>
                    <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] text-slate-950">
                      {mode === "login" ? "Welcome Back" : "Get Started"}
                    </h2>
                    <p className="mt-2 text-base text-slate-500">
                      {mode === "login"
                        ? "Access your FitnessLab dashboard."
                        : "Create your account and begin your analysis."}
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
                    {(["login", "signup"] as const).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setMode(item);
                          setErrors({});
                          setApiError("");
                        }}
                        className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                          mode === item
                            ? "bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)]"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {item === "login" ? "Login" : "Sign Up"}
                      </button>
                    ))}
                  </div>

                  {apiError && (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {apiError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                      <label
                        htmlFor="auth-email"
                        className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
                      >
                        Email Address
                      </label>
                      <input
                        id="auth-email"
                        type="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (errors.email) {
                            setErrors((previous) => ({ ...previous, email: undefined }));
                          }
                        }}
                        placeholder="name@fitnesslab.com"
                        autoComplete="email"
                        className={`auth-input ${errors.email ? "auth-input-error" : ""}`}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <label
                          htmlFor="auth-password"
                          className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
                        >
                          Password
                        </label>
                        {mode === "login" && (
                          <button
                            type="button"
                            className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                          >
                            Forgot Password?
                          </button>
                        )}
                      </div>
                      <input
                        id="auth-password"
                        type="password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          if (errors.password) {
                            setErrors((previous) => ({ ...previous, password: undefined }));
                          }
                        }}
                        placeholder="........"
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                        className={`auth-input ${errors.password ? "auth-input-error" : ""}`}
                      />
                      {errors.password && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
                      )}
                    </div>

                    <button
                      id="auth-submit"
                      type="submit"
                      disabled={submitting}
                      className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-[0_16px_36px_rgba(37,99,235,0.28)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting
                        ? mode === "login"
                          ? "Signing In..."
                          : "Creating Account..."
                        : mode === "login"
                          ? "Sign In"
                          : "Create Account"}
                    </button>
                  </form>

                  <p className="mt-6 text-center text-sm text-slate-500">
                    {mode === "login" ? "New to FitnessLab?" : "Already have an account?"}{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode(mode === "login" ? "signup" : "login");
                        setErrors({});
                        setApiError("");
                      }}
                      className="font-semibold text-blue-700 transition hover:text-blue-800"
                    >
                      {mode === "login" ? "Start your journey" : "Sign in instead"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-slate-200 bg-white/92 px-6 py-5 text-sm text-slate-500 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="font-semibold text-slate-800">FitnessLab Pro</div>
            <div>Precision performance access for your personalized fitness workflow.</div>
            <div className="flex flex-wrap gap-5">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
