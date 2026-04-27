"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import ResultCard from "@/components/ResultCard";
import type { Category, NutritionImages } from "@/services/api";

const NutritionIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

function getCategoryStyle(category?: string) {
  if (category === "fit") return { color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/25" };
  if (category === "skinny") return { color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/25" };
  return { color: "text-rose-400", bg: "bg-rose-500/15 border-rose-500/25" };
}

function getCategorySummary(bmi?: number) {
  if (bmi == null) return "";
  if (bmi < 18.5) return "Your BMI is below the healthy range. Nutrition targets support healthy weight gain and recovery.";
  if (bmi < 25) return "Your BMI is in the healthy range. Nutrition targets support a balanced routine and steady performance.";
  return "Your BMI is above the healthy range. Nutrition targets support calorie control and consistent training.";
}

function imageSrc(base64?: string) {
  return base64 ? `data:image/jpeg;base64,${base64}` : "";
}

export default function ResultPage() {
  const router = useRouter();
  const { analysisResult, clearResult } = useAppContext();

  useEffect(() => {
    if (!analysisResult) router.replace("/questions");
  }, [analysisResult, router]);

  if (!analysisResult) return null;

  const { bmi, category, nutrition, nutrition_images: nutritionImages } = analysisResult;
  const catStyle = getCategoryStyle(category);
  const macros: Array<{ key: keyof NutritionImages; label: string; value?: number; unit: string }> = [
    { key: "calories", label: "Calories", value: nutrition?.calories, unit: "kcal" },
    { key: "protein", label: "Protein", value: nutrition?.protein, unit: "g" },
    { key: "fibre", label: "Fibre", value: nutrition?.fibre, unit: "g" },
    { key: "fats", label: "Fats", value: nutrition?.fats, unit: "g" },
    { key: "carbs", label: "Carbs", value: nutrition?.carbs, unit: "g" },
  ];

  const openWorkout = (selectedCategory: Category) => {
    router.push(`/workout?category=${selectedCategory}`);
  };

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-6 overflow-hidden">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-10 fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Your Results</h1>
          <p className="text-white/50">Formula-based BMI and nutrition targets</p>
        </div>

        <div className="glass-card p-8 mb-8 fade-in stagger-1">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative w-36 h-36 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="url(#bmiGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${Math.min((bmi || 0) / 40 * 327, 327)} 327`}
                />
                <defs>
                  <linearGradient id="bmiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{bmi != null ? bmi.toFixed(1) : "--"}</span>
                <span className="text-xs text-white/40 mt-1">BMI</span>
              </div>
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-3 capitalize ${catStyle.bg} ${catStyle.color}`}>
                <div className="w-2 h-2 rounded-full bg-current" />
                {category || "Unknown"}
              </div>
              <p className="text-white/60 leading-relaxed mb-5">{getCategorySummary(bmi)}</p>
              <button
                onClick={() => openWorkout(category)}
                className="btn-glow inline-flex items-center justify-center gap-2 px-6"
              >
                View Workout Plan
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <ResultCard title="Nutrition Targets" icon={<NutritionIcon />} className="mb-8 stagger-2">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {macros.map((macro) => {
              const source = imageSrc(nutritionImages?.[macro.key]);
              return (
                <div key={macro.label} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  {source && (
                    <img
                      src={source}
                      alt={`${macro.label} nutrition`}
                      className="h-24 w-full object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="text-xs uppercase text-white/40 mb-2">{macro.label}</div>
                    <div className="text-2xl font-bold text-white">
                      {macro.value ?? "--"}
                      <span className="ml-1 text-sm font-medium text-white/40">{macro.unit}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ResultCard>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 fade-in stagger-4">
          <button
            id="result-retry"
            onClick={() => {
              clearResult();
              router.push("/questions");
            }}
            className="btn-glow px-8"
          >
            Analyze Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3.5 rounded-xl text-sm font-medium text-white/60 border border-white/10 hover:bg-white/5 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
