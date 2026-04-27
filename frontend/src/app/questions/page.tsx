"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { analyzeBody } from "@/services/api";

interface FormData {
  height: string;
  weight: string;
  calories: string;
  protein: string;
  fibre: string;
}

interface FormErrors {
  height?: string;
  weight?: string;
  calories?: string;
  protein?: string;
  fibre?: string;
}

const fields = [
  { key: "height", label: "Height", unit: "cm", placeholder: "175", required: true },
  { key: "weight", label: "Weight", unit: "kg", placeholder: "70", required: true },
  { key: "calories", label: "Daily Calories", unit: "kcal", placeholder: "2000", required: false },
  { key: "protein", label: "Protein Intake", unit: "g", placeholder: "50", required: false },
  { key: "fibre", label: "Fibre Intake", unit: "g", placeholder: "25", required: false },
] as const;

export default function QuestionsPage() {
  const router = useRouter();
  const { isLoggedIn, setAnalysisResult } = useAppContext();
  const [form, setForm] = useState<FormData>({ height: "", weight: "", calories: "", protein: "", fibre: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!isLoggedIn) router.replace("/auth");
  }, [isLoggedIn, router]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.height.trim()) e.height = "Height is required";
    else if (isNaN(Number(form.height)) || Number(form.height) <= 0) e.height = "Must be a positive number";
    if (!form.weight.trim()) e.weight = "Weight is required";
    else if (isNaN(Number(form.weight)) || Number(form.weight) <= 0) e.weight = "Must be a positive number";
    for (const f of ["calories", "protein", "fibre"] as const) {
      if (form[f].trim() && (isNaN(Number(form[f])) || Number(form[f]) < 0)) e[f] = "Must be a valid number";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (key: keyof FormData, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
    if (apiError) setApiError("");
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate() || loading || submittedRef.current) return;
    setLoading(true);
    setApiError("");
    submittedRef.current = true;

    try {
      const payload = {
        height: Number(form.height),
        weight: Number(form.weight),
        calories: form.calories ? Number(form.calories) : 0,
        protein: form.protein ? Number(form.protein) : 0,
        fibre: form.fibre ? Number(form.fibre) : 0,
      };
      const data = await analyzeBody(payload);
      if (!data) throw new Error("Empty response from server");
      setAnalysisResult(data);
      router.push("/result");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setApiError(msg);
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
          <p className="text-white/50">Enter your details for a personalized AI fitness plan</p>
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
            {fields.map((f) => (
              <div key={f.key}>
                <label htmlFor={`q-${f.key}`} className="flex items-center justify-between text-sm font-medium text-white/70 mb-2">
                  <span>{f.label} {f.required && <span className="text-red-400">*</span>}</span>
                  <span className="text-xs text-white/30">{f.unit}</span>
                </label>
                <input id={`q-${f.key}`} type="text" inputMode="decimal" value={form[f.key as keyof FormData]}
                  onChange={(e) => handleChange(f.key as keyof FormData, e.target.value)}
                  placeholder={f.placeholder} className={`input-field ${errors[f.key as keyof FormErrors] ? "error" : ""}`} />
                {errors[f.key as keyof FormErrors] && (
                  <p className="mt-1.5 text-xs text-red-400">{errors[f.key as keyof FormErrors]}</p>
                )}
              </div>
            ))}

            <button id="questions-submit" type="submit" disabled={loading} className="btn-glow w-full flex items-center justify-center gap-2 mt-4">
              {loading ? (<><div className="spinner" /><span>Analyzing…</span></>) : (
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
