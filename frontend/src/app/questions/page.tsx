"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { analyzeBody } from "@/services/api";

type Gender = "male" | "female";

interface FormData {
  height: string;
  weight: string;
  gender: Gender | "";
}

interface FormErrors {
  height?: string;
  weight?: string;
  gender?: string;
}

const fields = [
  { key: "height", label: "Height", unit: "cm", placeholder: "175" },
  { key: "weight", label: "Weight", unit: "kg", placeholder: "70" },
] as const;

const genderOptions: Array<{ value: Gender; label: string }> = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function QuestionsPage() {
  const router = useRouter();
  const { isLoggedIn, setAnalysisResult } = useAppContext();
  const [form, setForm] = useState<FormData>({ height: "", weight: "", gender: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!isLoggedIn) router.replace("/auth");
  }, [isLoggedIn, router]);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!form.height.trim()) {
      nextErrors.height = "Height is required";
    } else if (Number.isNaN(Number(form.height)) || Number(form.height) <= 0) {
      nextErrors.height = "Must be a positive number";
    }

    if (!form.weight.trim()) {
      nextErrors.weight = "Weight is required";
    } else if (Number.isNaN(Number(form.weight)) || Number(form.weight) <= 0) {
      nextErrors.weight = "Must be a positive number";
    }

    if (!form.gender) {
      nextErrors.gender = "Gender is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleTextChange = (key: "height" | "weight", value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    if (errors[key]) setErrors((previous) => ({ ...previous, [key]: undefined }));
    if (apiError) setApiError("");
  };

  const handleGenderChange = (gender: Gender) => {
    setForm((previous) => ({ ...previous, gender }));
    if (errors.gender) setErrors((previous) => ({ ...previous, gender: undefined }));
    if (apiError) setApiError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate() || loading || submittedRef.current || !form.gender) return;

    setLoading(true);
    setApiError("");
    submittedRef.current = true;

    try {
      const payload = {
        height: Number(form.height),
        weight: Number(form.weight),
        gender: form.gender,
      };
      const data = await analyzeBody(payload);
      if (!data) throw new Error("Empty response from server");
      setAnalysisResult(data);
      router.push("/result");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setApiError(message);
      submittedRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 pb-12 px-6 overflow-hidden">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-8 fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Body Analysis</h1>
          <p className="text-white/50">Enter your details for a formula-based fitness plan</p>
        </div>

        <div className="glass-card p-8 fade-in stagger-2">
          {apiError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => (
              <div key={field.key}>
                <label htmlFor={`q-${field.key}`} className="flex items-center justify-between text-sm font-medium text-white/70 mb-2">
                  <span>
                    {field.label} <span className="text-red-400">*</span>
                  </span>
                  <span className="text-xs text-white/30">{field.unit}</span>
                </label>
                <input
                  id={`q-${field.key}`}
                  type="text"
                  inputMode="decimal"
                  value={form[field.key]}
                  onChange={(event) => handleTextChange(field.key, event.target.value)}
                  placeholder={field.placeholder}
                  className={`input-field ${errors[field.key] ? "error" : ""}`}
                />
                {errors[field.key] && (
                  <p className="mt-1.5 text-xs text-red-400">{errors[field.key]}</p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Gender <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {genderOptions.map((option) => {
                  const selected = form.gender === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => handleGenderChange(option.value)}
                      className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                        selected
                          ? "bg-indigo-500/25 border-indigo-400 text-white shadow-lg shadow-indigo-500/20"
                          : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              {errors.gender && <p className="mt-1.5 text-xs text-red-400">{errors.gender}</p>}
            </div>

            <button id="questions-submit" type="submit" disabled={loading} className="btn-glow w-full flex items-center justify-center gap-2 mt-4">
              {loading ? (
                <>
                  <div className="spinner" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  Analyze My Body
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
