"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import ResultCard from "@/components/ResultCard";

/* ── Icon helpers ── */
const BmiIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);
const GoalIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);
const DietIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12" />
  </svg>
);
const WorkoutIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);
const TimelineIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);
const NutritionIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/* ── BMI category color mapping ── */
function getCategoryStyle(category?: string) {
  const c = (category || "").toLowerCase();
  if (c.includes("fit") || c.includes("normal")) return { color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/25" };
  if (c.includes("skinny") || c.includes("under")) return { color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/25" };
  return { color: "text-rose-400", bg: "bg-rose-500/15 border-rose-500/25" };
}

export default function ResultPage() {
  const router = useRouter();
  const { analysisResult, clearResult, isLoggedIn } = useAppContext();

  useEffect(() => {
    if (!analysisResult) router.replace("/questions");
  }, [analysisResult, router]);

  if (!analysisResult) return null;

  const { bmi, category, ai_plan, nutrition_feedback, images } = analysisResult;
  const catStyle = getCategoryStyle(category);
  const displayImages = (images || []).slice(0, 2);

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-6 overflow-hidden">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Your Results</h1>
          <p className="text-white/50">AI-generated fitness plan based on your body analysis</p>
        </div>

        {/* BMI Hero Card */}
        <div className="glass-card p-8 mb-8 fade-in stagger-1">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* BMI Circle */}
            <div className="relative w-36 h-36 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="url(#bmiGrad)" strokeWidth="8"
                  strokeLinecap="round" strokeDasharray={`${Math.min((bmi || 0) / 40 * 327, 327)} 327`} />
                <defs>
                  <linearGradient id="bmiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{bmi != null ? bmi.toFixed(1) : "—"}</span>
                <span className="text-xs text-white/40 mt-1">BMI</span>
              </div>
            </div>

            {/* Category & Summary */}
            <div className="text-center sm:text-left flex-1">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-3 ${catStyle.bg} ${catStyle.color}`}>
                <div className="w-2 h-2 rounded-full bg-current" />
                {category || "Unknown"}
              </div>
              <p className="text-white/60 leading-relaxed">
                {bmi != null && bmi < 18.5 && "Your BMI indicates you are underweight. Focus on healthy weight gain through nutrition and strength training."}
                {bmi != null && bmi >= 18.5 && bmi < 25 && "Great! Your BMI is within the healthy range. Maintain your fitness with balanced nutrition and regular exercise."}
                {bmi != null && bmi >= 25 && bmi < 30 && "Your BMI indicates you are overweight. A structured diet and exercise plan will help you reach a healthier weight."}
                {bmi != null && bmi >= 30 && "Your BMI indicates obesity. Consult with a healthcare professional and follow the AI plan below."}
              </p>
            </div>
          </div>
        </div>

        {/* AI Plan Cards Grid */}
        {ai_plan && (
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {ai_plan.goal && (
              <ResultCard title="Goal" icon={<GoalIcon />} className="stagger-2">
                <p>{ai_plan.goal}</p>
              </ResultCard>
            )}
            {ai_plan.diet_plan && (
              <ResultCard title="Diet Plan" icon={<DietIcon />} className="stagger-3">
                <p className="whitespace-pre-line">{ai_plan.diet_plan}</p>
              </ResultCard>
            )}
            {ai_plan.workout_plan && (
              <ResultCard title="Workout Plan" icon={<WorkoutIcon />} className="stagger-4">
                <p className="whitespace-pre-line">{ai_plan.workout_plan}</p>
              </ResultCard>
            )}
            {ai_plan.timeline && ai_plan.timeline.length > 0 && (
              <ResultCard title="Timeline" icon={<TimelineIcon />} className="stagger-5">
                <ul className="space-y-2">
                  {ai_plan.timeline.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 w-6 h-6 shrink-0 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
                        {i + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </ResultCard>
            )}
          </div>
        )}

        {/* Nutrition Feedback */}
        {nutrition_feedback && nutrition_feedback.length > 0 && (
          <ResultCard title="Nutrition Feedback" icon={<NutritionIcon />} className="mb-8 stagger-5">
            <ul className="space-y-3">
              {nutrition_feedback.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 shrink-0 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ResultCard>
        )}

        {/* AI-generated Images */}
        {displayImages.length > 0 && (
          <div className="fade-in stagger-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M6.75 7.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18 7.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              Visual Insights
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {displayImages.map((img, i) => (
                <div key={i} className="glass-card overflow-hidden group">
                  <img
                    src={img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`}
                    alt={`Fitness insight ${i + 1}`}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 fade-in stagger-6">
          <button
            id="result-retry"
            onClick={() => { clearResult(); router.push("/questions"); }}
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
