"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import type { Category, NutritionImages } from "@/services/api";

function getCategoryAccent(category?: string) {
  if (category === "fit") {
    return {
      tone: "text-emerald-600",
      ring: "#16a34a",
      pill: "bg-emerald-50 text-emerald-700",
    };
  }
  if (category === "skinny") {
    return {
      tone: "text-amber-600",
      ring: "#d97706",
      pill: "bg-amber-50 text-amber-700",
    };
  }
  return {
    tone: "text-red-600",
    ring: "#c81e1e",
    pill: "bg-red-50 text-red-700",
  };
}

function getCategorySummary(bmi?: number) {
  if (bmi == null) return "";
  if (bmi < 18.5) {
    return "Your Body Mass Index is below the healthy range. Nutrition guidance supports improved recovery and steady healthy weight gain.";
  }
  if (bmi < 25) {
    return "Your Body Mass Index is in the healthy range. Nutrition guidance supports balanced energy, muscle maintenance, and performance.";
  }
  return "Your Body Mass Index is in the overweight range. This is based on standard formulas considering your height and weight.";
}

function getInsight(bmi?: number) {
  if (bmi == null) return "";
  if (bmi < 18.5) {
    return "AI Insight: Emphasize calorie-dense whole foods and progressive strength training to support lean mass gains.";
  }
  if (bmi < 25) {
    return "AI Insight: Maintain a balanced mix of protein, fibre, and steady activity to preserve your current composition.";
  }
  return "AI Insight: Prioritize high-volume fiber-rich foods to manage satiety while adhering to your calorie budget.";
}

function imageSrc(base64?: string) {
  return base64 ? `data:image/jpeg;base64,${base64}` : "";
}

function getRingProgress(bmi: number) {
  const normalized = Math.min(Math.max(bmi, 0), 40);
  return (normalized / 40) * 327;
}

export default function ResultPage() {
  const router = useRouter();
  const { analysisResult, clearResult } = useAppContext();

  useEffect(() => {
    if (!analysisResult) router.replace("/questions");
  }, [analysisResult, router]);

  if (!analysisResult) return null;

  const { bmi, category, nutrition, nutrition_images: nutritionImages } = analysisResult;
  const accent = getCategoryAccent(category);
  const macros: Array<{
    key: keyof NutritionImages;
    label: string;
    value?: number;
    unit: string;
  }> = [
    { key: "protein", label: "Protein", value: nutrition?.protein, unit: "g" },
    { key: "fibre", label: "Fibre", value: nutrition?.fibre, unit: "g" },
    { key: "fats", label: "Fats", value: nutrition?.fats, unit: "g" },
    { key: "carbs", label: "Carbs", value: nutrition?.carbs, unit: "g" },
  ];

  const caloriesImage = imageSrc(nutritionImages?.calories);

  const openWorkout = (selectedCategory: Category) => {
    router.push(`/workout?category=${selectedCategory}`);
  };

  return (
    <div className="landing-shell min-h-screen overflow-hidden pt-16 lg:h-screen lg:pt-16">
      <div className="landing-backdrop" />

      <section className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col border-y border-slate-200 bg-[#f8fafc] lg:h-[calc(100vh-4rem)]">
        <div className="relative flex-1 overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex h-full w-full max-w-[1280px] flex-col">
            <div className="shrink-0 pb-5">
              <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                Your Results
              </h1>
              <p className="mt-1.5 text-base text-slate-500 sm:text-lg">
                Formula-based BMI and nutrition targets
              </p>
            </div>

            <div className="grid flex-1 gap-5 overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex min-h-0 flex-col gap-4">
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                  <div className="flex justify-center">
                    <div className="relative h-40 w-40">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          fill="none"
                          stroke="rgba(15,23,42,0.08)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          fill="none"
                          stroke={accent.ring}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${getRingProgress(bmi)} 327`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-slate-950">{bmi.toFixed(1)}</span>
                        <span className={`mt-2 rounded-full px-3 py-1 text-xs font-bold uppercase ${accent.pill}`}>
                          {category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 text-center">
                    <h2 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                      BMI Index
                    </h2>
                    <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
                      {getCategorySummary(bmi)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openWorkout(category)}
                  className="inline-flex justify-center rounded-2xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-[0_16px_36px_rgba(37,99,235,0.24)] transition hover:bg-blue-700"
                >
                  View Workout Plan
                </button>
              </div>

              <div className="min-h-0 rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
                  <div className="text-blue-600">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v12m6-6H6"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                    Nutrition Targets
                  </h2>
                </div>

                <div className="mt-5 rounded-[18px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Daily Budget
                      </div>
                      <div className="mt-2 text-5xl font-black leading-none text-slate-950">
                        {nutrition?.calories ?? "--"}
                        <span className="ml-2 text-xl font-semibold text-slate-500">kcal</span>
                      </div>
                    </div>
                    {caloriesImage && (
                      <img
                        src={caloriesImage}
                        alt="Calories target"
                        className="h-20 w-20 rounded-2xl object-cover shadow-md"
                      />
                    )}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {macros.map((macro) => {
                    const source = imageSrc(nutritionImages?.[macro.key]);
                    return (
                      <div
                        key={macro.label}
                        className="flex items-center gap-3 rounded-[16px] border border-slate-200 bg-white p-3"
                      >
                        {source ? (
                          <img
                            src={source}
                            alt={`${macro.label} nutrition`}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-slate-100" />
                        )}
                        <div>
                          <div className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-slate-500">
                            {macro.label}
                          </div>
                          <div className="mt-1 text-2xl font-bold leading-none text-slate-950">
                            {macro.value ?? "--"}
                            <span className="ml-1 text-base font-medium text-slate-500">
                              {macro.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-[18px] border-l-4 border-blue-600 bg-slate-50 px-4 py-3">
                  <p className="text-sm leading-6 text-slate-600">{getInsight(bmi)}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex shrink-0 justify-center gap-4">
              <button
                onClick={() => {
                  clearResult();
                  router.push("/questions");
                }}
                className="rounded-2xl bg-blue-100 px-8 py-3.5 text-base font-medium text-slate-700 transition hover:bg-blue-200"
              >
                Analyze Again
              </button>
              <button
                onClick={() => router.push("/")}
                className="rounded-2xl border border-slate-200 bg-white px-8 py-3.5 text-base font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white px-6 py-3 text-sm text-slate-500 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="font-semibold text-slate-800">Athletic Intelligence</div>
            <div className="flex flex-wrap gap-5">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Support</span>
              <span>Contact</span>
            </div>
            <div className="hidden lg:block">© 2024 Athletic Intelligence Precision Performance Data</div>
          </div>
        </div>
      </section>
    </div>
  );
}
