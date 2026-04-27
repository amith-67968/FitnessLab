"use client";

/* eslint-disable @next/next/no-img-element */

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { getWorkoutPlan } from "@/services/api";
import type { Category, WorkoutExercise, WorkoutResponse, WorkoutWeek } from "@/services/api";

type ExerciseDetail = {
  muscleGroup: string;
  instructions: string[];
  tips: string[];
  mistakes: string[];
};

const MUSCLE_GROUP_RULES: Array<{ match: RegExp; muscleGroup: string }> = [
  { match: /squat|lunge|leg press/i, muscleGroup: "Lower Body" },
  { match: /deadlift|romanian deadlift|kettlebell deadlift/i, muscleGroup: "Posterior Chain" },
  { match: /bench|push-up|push press|incline/i, muscleGroup: "Chest + Shoulders" },
  { match: /row|pulldown|pull-up|face pull/i, muscleGroup: "Back" },
  { match: /plank|knee raise|battle rope/i, muscleGroup: "Core + Conditioning" },
  { match: /run|walking|cycling|interval|sprint|jog/i, muscleGroup: "Cardio" },
];

const EXERCISE_OVERRIDES: Record<string, ExerciseDetail> = {
  "Goblet Squat": {
    muscleGroup: "Lower Body",
    instructions: [
      "Hold the weight close to your chest and set your feet just outside hip width.",
      "Sit down between your hips while keeping your chest lifted and core braced.",
      "Drive through your full foot to return to standing without letting your knees cave inward.",
    ],
    tips: [
      "Use a slow lowering phase to improve depth and control.",
      "Keep elbows tucked so the load stays centered.",
    ],
    mistakes: [
      "Letting the heels lift off the floor.",
      "Collapsing the chest forward at the bottom.",
    ],
  },
  "Bench Press": {
    muscleGroup: "Chest + Shoulders",
    instructions: [
      "Set your shoulder blades down and back before unracking the bar.",
      "Lower the bar to mid-chest with forearms stacked vertically.",
      "Press upward in a slight arc while keeping feet planted and glutes on the bench.",
    ],
    tips: [
      "Create leg drive for a more stable press.",
      "Pause briefly on the chest to improve control.",
    ],
    mistakes: [
      "Flaring elbows too wide.",
      "Losing upper-back tension between reps.",
    ],
  },
  Deadlift: {
    muscleGroup: "Posterior Chain",
    instructions: [
      "Stand with the bar over midfoot and hinge down to grip just outside the legs.",
      "Brace your core, pull slack out of the bar, and keep your spine neutral.",
      "Drive the floor away and finish tall without leaning back excessively.",
    ],
    tips: [
      "Keep the bar close to your body throughout the lift.",
      "Think about pushing through the floor rather than yanking upward.",
    ],
    mistakes: [
      "Rounding the lower back off the floor.",
      "Letting the bar drift away from the shins.",
    ],
  },
};

function isCategory(value: string | null): value is Category {
  return value === "skinny" || value === "fit" || value === "fat";
}

function imageSrc(base64: string) {
  return `data:image/jpeg;base64,${base64}`;
}

function getGoalLabel(category: Category) {
  if (category === "skinny") return "Muscle Gain";
  if (category === "fit") return "Performance Balance";
  return "Fat Loss";
}

function getPhaseInsight(category: Category, week: WorkoutWeek, weekIndex: number) {
  const base =
    category === "skinny"
      ? "This block emphasizes progressive overload, movement quality, and enough recovery to support lean mass gains."
      : category === "fit"
        ? "This block balances performance output, conditioning, and joint-friendly training density."
        : "This block prioritizes calorie expenditure, repeatable movement quality, and sustainable intensity.";

  return `Week ${weekIndex + 1} insight: ${base}`;
}

function deriveExerciseDetail(exercise: WorkoutExercise): ExerciseDetail {
  const override = EXERCISE_OVERRIDES[exercise.name];
  if (override) return override;

  const rule = MUSCLE_GROUP_RULES.find(({ match }) => match.test(exercise.name));
  const muscleGroup = rule?.muscleGroup ?? "Full Body";

  return {
    muscleGroup,
    instructions: [
      `Set up carefully for ${exercise.name} and establish a stable starting position.`,
      "Move through a controlled range of motion while maintaining tension in the target muscles.",
      "Finish each rep with clean posture and reset before the next repetition.",
    ],
    tips: [
      exercise.notes,
      "Keep your breathing rhythm steady and stop the set before technique breaks down.",
    ],
    mistakes: [
      "Using momentum instead of controlled reps.",
      "Rushing the setup and losing alignment early in the movement.",
    ],
  };
}

function ExerciseDetailModal({
  exercise,
  images,
  onClose,
}: {
  exercise: WorkoutExercise;
  images: string[];
  onClose: () => void;
}) {
  const detail = deriveExerciseDetail(exercise);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="relative max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
        >
          Close
        </button>

        <div className="grid max-h-[88vh] overflow-y-auto lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border-r border-slate-200 bg-slate-50/70 p-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                {detail.muscleGroup}
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-slate-950">
                {exercise.name}
              </h2>
              <p className="mt-2 text-base font-medium text-slate-500">{exercise.sets}</p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {images.slice(0, 3).map((image, index) => (
                <img
                  key={`${exercise.name}-${index}`}
                  src={imageSrc(image)}
                  alt={`${exercise.name} visual ${index + 1}`}
                  className="h-44 w-full rounded-2xl border border-slate-200 object-cover"
                />
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-6">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                  Step-by-step
                </h3>
                <div className="mt-3 space-y-3">
                  {detail.instructions.map((instruction) => (
                    <div
                      key={instruction}
                      className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600"
                    >
                      {instruction}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                  Coach Tips
                </h3>
                <div className="mt-3 space-y-3">
                  {detail.tips.map((tip) => (
                    <div
                      key={tip}
                      className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm leading-7 text-slate-700"
                    >
                      {tip}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                  Common Mistakes
                </h3>
                <div className="mt-3 space-y-3">
                  {detail.mistakes.map((mistake) => (
                    <div
                      key={mistake}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600"
                    >
                      {mistake}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { analysisResult } = useAppContext();
  const [workout, setWorkout] = useState<WorkoutResponse | null>(null);
  const [error, setError] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<{
    exercise: WorkoutExercise;
    images: string[];
  } | null>(null);

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
    <div className="landing-shell min-h-screen overflow-hidden pt-16 lg:h-screen lg:pt-16">
      <div className="landing-backdrop" />

      <section className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col border-y border-slate-200 bg-[#f8fafc] lg:h-[calc(100vh-4rem)]">
        <div className="relative flex-1 overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col">
            <div className="shrink-0 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <div>
                <div>
                  <button
                    onClick={() => router.push("/result")}
                    className="mb-4 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                  >
                    Back to Results
                  </button>
                  <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                    Your 8 Week Performance Plan
                  </h1>
                  <p className="mt-2 text-base text-slate-500 sm:text-lg">
                    AI-generated personalized workout plan
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                      BMI-based
                    </span>
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                      Goal: {getGoalLabel(category)}
                    </span>
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                      Duration: 8 Weeks
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 min-h-0 flex-1 overflow-hidden">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {!workout && !error && (
                <div className="h-full rounded-[28px] border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                  Loading workout plan...
                </div>
              )}

              {workout && (
                <div className="h-full overflow-y-auto pr-1">
                  <div className="grid gap-5 pb-2">
                    {workout.weeks.map((week, index) => (
                      <article
                        key={week.week}
                        className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-300 hover:shadow-[0_22px_55px_rgba(37,99,235,0.12)]"
                      >
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                          <div className="max-w-3xl">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                                Week {week.week}
                              </span>
                              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                                {week.focus}
                              </span>
                            </div>
                            <h2 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                              {week.focus}
                            </h2>
                            <p className="mt-3 text-base leading-7 text-slate-500">
                              {week.details}
                            </p>
                            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
                              {getPhaseInsight(category, week, index)}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                            <div className="font-semibold text-slate-700">Phase {index + 1}</div>
                            <div>{week.exercises.length} exercises</div>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                          {week.exercises.map((exercise, exerciseIndex) => {
                            const detail = deriveExerciseDetail(exercise);
                            const thumbnail = week.images[exerciseIndex % Math.max(week.images.length, 1)];

                            return (
                              <div
                                key={exercise.name}
                                className="group rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-[0_18px_38px_rgba(37,99,235,0.1)]"
                              >
                                <div className="flex gap-4">
                                  {thumbnail ? (
                                    <img
                                      src={imageSrc(thumbnail)}
                                      alt={exercise.name}
                                      className="h-24 w-24 rounded-2xl border border-slate-200 object-cover"
                                    />
                                  ) : (
                                    <div className="h-24 w-24 rounded-2xl border border-slate-200 bg-white" />
                                  )}

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                      <h3 className="text-lg font-bold text-slate-950">
                                        {exercise.name}
                                      </h3>
                                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                                        {detail.muscleGroup}
                                      </span>
                                    </div>
                                    <p className="mt-2 text-sm font-semibold text-blue-700">
                                      {exercise.sets}
                                    </p>
                                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                                      {exercise.notes}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={1.8}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 5.25a3 3 0 013 3m-3-3a3 3 0 00-3 3m3-3h-7.5m7.5 0v13.5m-7.5-13.5a3 3 0 00-3 3m3-3a3 3 0 013-3m-3 3v13.5m0 0h7.5m-7.5 0H6"
                                      />
                                    </svg>
                                    AI coach brief
                                  </div>
                                  <button
                                    onClick={() =>
                                      setSelectedExercise({
                                        exercise,
                                        images: week.images,
                                      })
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-700 ring-1 ring-slate-200 transition group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-600"
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise.exercise}
          images={selectedExercise.images}
          onClose={() => setSelectedExercise(null)}
        />
      )}
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
