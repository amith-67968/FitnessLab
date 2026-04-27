"use client";

/* eslint-disable @next/next/no-img-element */

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { getWorkoutPlan } from "@/services/api";
import type { Category, WorkoutResponse } from "@/services/api";

function isCategory(value: string | null): value is Category {
  return value === "skinny" || value === "fit" || value === "fat";
}

function imageSrc(base64: string) {
  return `data:image/jpeg;base64,${base64}`;
}

function WorkoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { analysisResult } = useAppContext();
  const [workout, setWorkout] = useState<WorkoutResponse | null>(null);
  const [error, setError] = useState("");

  const categoryParam = searchParams.get("category");
  const category = isCategory(categoryParam) ? categoryParam : analysisResult?.category;

  useEffect(() => {
    if (!category) {
      router.replace("/questions");
      return;
    }

    let cancelled = false;
    getWorkoutPlan(category)
      .then((data) => {
        if (!cancelled) setWorkout(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Could not load workout plan.";
        setError(message);
      });

    return () => {
      cancelled = true;
    };
  }, [category, router]);

  if (!category) return null;

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-6 overflow-hidden">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-8 fade-in">
          <button
            onClick={() => router.push("/result")}
            className="mb-6 px-4 py-2 rounded-xl text-sm font-medium text-white/60 border border-white/10 hover:bg-white/5 transition-all"
          >
            Back to Results
          </button>

          <div className="glass-card p-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <span className="inline-flex w-fit rounded-full border border-indigo-400/25 bg-indigo-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-300">
                  {category} plan
                </span>
                <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-white">
                  {workout?.title || "Loading Workout Plan"}
                </h1>
                <p className="mt-3 max-w-3xl text-white/60 leading-relaxed">
                  {workout?.description || "Building your detailed 8-week routine..."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {!workout && !error && (
          <div className="glass-card p-8 text-center text-white/60">
            Loading workout plan...
          </div>
        )}

        {workout && (
          <div className="grid gap-6">
            {workout.weeks.map((week, index) => (
              <article key={week.week} className={`glass-card overflow-hidden fade-in stagger-${Math.min(index + 1, 6)}`}>
                {week.images.length > 0 && (
                  <div className="grid sm:grid-cols-3 gap-1 bg-white/5">
                    {week.images.map((image, imageIndex) => (
                      <img
                        key={`${week.week}-${imageIndex}`}
                        src={imageSrc(image)}
                        alt={`${week.focus} workout ${imageIndex + 1}`}
                        className="h-48 w-full object-cover"
                      />
                    ))}
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <span className="inline-flex w-fit items-center rounded-full border border-indigo-400/25 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300">
                      Week {week.week}
                    </span>
                    <h2 className="text-xl font-bold text-white">{week.focus}</h2>
                  </div>

                  <p className="text-white/65 leading-relaxed mb-6">{week.details}</p>

                  <div className="grid md:grid-cols-3 gap-4">
                    {week.exercises.map((exercise) => (
                      <div key={exercise.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <h3 className="font-semibold text-white">{exercise.name}</h3>
                        <p className="mt-2 text-sm font-medium text-indigo-300">{exercise.sets}</p>
                        <p className="mt-2 text-sm text-white/55 leading-relaxed">{exercise.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorkoutPage() {
  return (
    <Suspense fallback={null}>
      <WorkoutContent />
    </Suspense>
  );
}
