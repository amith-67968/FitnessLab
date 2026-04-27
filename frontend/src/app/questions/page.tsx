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
  { key: "height", label: "Height (cm)", unit: "CM", placeholder: "e.g., 180" },
  { key: "weight", label: "Weight (kg)", unit: "KG", placeholder: "e.g., 75.5" },
] as const;

const genderOptions: Array<{
  value: Gender;
  label: string;
  symbol: string;
}> = [
  { value: "male", label: "Male", symbol: "♂" },
  { value: "female", label: "Female", symbol: "♀" },
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
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setApiError(message);
      submittedRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="analysis-shell min-h-screen overflow-hidden pt-16 lg:h-screen lg:pt-16">
      <div className="analysis-backdrop" />

      <section className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col border-y border-slate-200 bg-[#f8fafc] lg:h-[calc(100vh-4rem)]">
        <div className="relative flex-1 overflow-hidden px-4 py-4 sm:px-6 lg:px-8 lg:py-4">
          <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col">
            <div className="shrink-0 px-2 pb-4 pt-1 text-center">
              <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                Body Analysis
              </h1>
              <p className="mx-auto mt-2 max-w-3xl text-base leading-7 text-slate-500 sm:text-lg">
                Our AI diagnostic engine uses precise physiological metrics to
                calibrate your performance profile and nutritional requirements.
              </p>
            </div>

            <div className="grid flex-1 gap-5 overflow-hidden lg:min-h-0 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="flex min-h-0 flex-col gap-4">
                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                  <div
                    className="h-44 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.14)), url('https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80')",
                    }}
                  />
                  <div className="p-5">
                    <div className="inline-flex rounded-md bg-blue-600 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white">
                      Precision Labs
                    </div>
                    <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-slate-950">
                      Scientific Rigor
                    </h2>
                    <p className="mt-3 text-base leading-7 text-slate-500">
                      We use standardized anthropometric data to generate your
                      metabolic baseline and muscle symmetry score.
                    </p>

                    <div className="mt-4 space-y-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                      <div>BMR Calculation</div>
                      <div>Macro Recommendations</div>
                      <div>Mapping Progress</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 h-10 w-1 rounded-full bg-blue-600" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                        AI Insight
                      </div>
                      <p className="mt-2 text-base italic leading-7 text-slate-500">
                        Consistent biometric tracking is the foundation of
                        data-driven performance. Accurate inputs ensure
                        personalized precision in every workout.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="min-h-0">
                <div className="h-full rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] sm:p-7">
                  {apiError && (
                    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {apiError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-slate-700">
                        Select Biological Gender
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
                              className={`rounded-2xl border px-6 py-6 text-center transition ${
                                selected
                                  ? "border-blue-600 bg-blue-50 shadow-[0_10px_24px_rgba(37,99,235,0.12)]"
                                  : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                              }`}
                            >
                              <div className="text-3xl text-slate-950">{option.symbol}</div>
                              <div
                                className={`mt-2 text-sm font-semibold ${
                                  selected ? "text-blue-700" : "text-slate-700"
                                }`}
                              >
                                {option.label}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {errors.gender && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.gender}</p>
                      )}
                    </div>

                    {fields.map((field) => (
                      <div key={field.key}>
                        <label
                          htmlFor={`q-${field.key}`}
                          className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-slate-700"
                        >
                          <span>{field.label}</span>
                          <span className="text-slate-400">{field.unit}</span>
                        </label>
                        <input
                          id={`q-${field.key}`}
                          type="text"
                          inputMode="decimal"
                          value={form[field.key]}
                          onChange={(event) =>
                            handleTextChange(field.key, event.target.value)
                          }
                          placeholder={field.placeholder}
                          className={`analysis-input ${
                            errors[field.key] ? "analysis-input-error" : ""
                          }`}
                        />
                        {errors[field.key] && (
                          <p className="mt-1.5 text-xs text-red-500">
                            {errors[field.key]}
                          </p>
                        )}
                      </div>
                    ))}

                    <div className="rounded-2xl bg-slate-50 px-4 py-3.5 text-sm leading-6 text-slate-500">
                      Your data is stored securely and encrypted. We use these
                      metrics solely for performance analysis and AI-driven goal
                      setting.
                    </div>

                    <button
                      id="questions-submit"
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-[0_18px_38px_rgba(37,99,235,0.24)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <div className="analysis-spinner" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          Analyze My Body
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white px-6 py-3 text-sm text-slate-500 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="font-semibold text-slate-800">FitnessLab Intelligence System</div>
            <div>Precision performance diagnostics for structured planning.</div>
            <div className="flex flex-wrap gap-5">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
