"""Structured 8-week exercise plan based on BMI category.

No AI — plans are deterministic and category-driven.
"""

from __future__ import annotations

from typing import Literal


def _skinny_plan() -> list[dict]:
    """Strength-focused plan for underweight users."""
    return [
        {
            "week": "1-2",
            "focus": "Foundation Strength",
            "workout": "Full-body compound lifts 3×/week: squats 3×10, bench press 3×10, deadlifts 3×8, overhead press 3×10. Rest 90s between sets.",
        },
        {
            "week": "3-4",
            "focus": "Progressive Overload",
            "workout": "Upper/Lower split 4×/week. Upper: bench press 4×8, barbell rows 4×8, shoulder press 3×10, bicep curls 3×12. Lower: squats 4×8, Romanian deadlifts 3×10, leg press 3×12, calf raises 4×15.",
        },
        {
            "week": "5-6",
            "focus": "Hypertrophy",
            "workout": "Push/Pull/Legs 5×/week. Push: incline bench 4×8, dumbbell flyes 3×12, tricep dips 3×10. Pull: pull-ups 4×8, cable rows 4×10, face pulls 3×15. Legs: front squats 4×8, lunges 3×12, leg curls 3×12.",
        },
        {
            "week": "7-8",
            "focus": "Strength Peaks",
            "workout": "Push/Pull/Legs 6×/week with increased weight. Target 5×5 on compound lifts (squat, bench, deadlift). Add drop sets on isolation exercises. Include 1 rest day for recovery.",
        },
    ]


def _fat_plan() -> list[dict]:
    """Cardio + HIIT focused plan for overweight users."""
    return [
        {
            "week": "1-2",
            "focus": "Active Recovery & Low-Impact Cardio",
            "workout": "30-min brisk walking 5×/week, bodyweight exercises 2×/week: wall push-ups 3×10, chair squats 3×10, planks 3×20s. Stretch daily.",
        },
        {
            "week": "3-4",
            "focus": "HIIT Introduction",
            "workout": "HIIT 3×/week: 30s high knees + 30s rest × 10 rounds. Moderate cardio 2×/week: cycling or swimming 30 min. Bodyweight circuits 2×/week: burpees 3×8, mountain climbers 3×15, jump squats 3×10.",
        },
        {
            "week": "5-6",
            "focus": "Fat Burn Intensification",
            "workout": "HIIT 4×/week: 40s work/20s rest × 12 rounds (mix of sprints, burpees, jump lunges). Resistance training 2×/week with light weights: circuit format, 30s rest between exercises.",
        },
        {
            "week": "7-8",
            "focus": "Endurance & Lean Muscle",
            "workout": "HIIT 3×/week with increasing intensity. Resistance training 3×/week: supersets of compound movements (squat-to-press, deadlift-to-row). Steady-state cardio 2×/week: 40-min jog or cycling.",
        },
    ]


def _fit_plan() -> list[dict]:
    """Balanced routine for users in a healthy BMI range."""
    return [
        {
            "week": "1-2",
            "focus": "Baseline Assessment",
            "workout": "Full-body training 3×/week: squats 3×10, push-ups 3×15, rows 3×10, planks 3×30s. Light cardio 2×/week: 20-min jog. Flexibility work daily.",
        },
        {
            "week": "3-4",
            "focus": "Strength & Cardio Balance",
            "workout": "Upper/Lower split 4×/week. Cardio 2×/week: 25-min interval running (2 min jog / 1 min sprint). Core work 3×/week: hanging leg raises, Russian twists, bicycle crunches.",
        },
        {
            "week": "5-6",
            "focus": "Performance Training",
            "workout": "Push/Pull/Legs 4×/week with progressive overload. HIIT 1×/week: 30-min mixed format. Sport-specific drills 1×/week. Active recovery with yoga or swimming.",
        },
        {
            "week": "7-8",
            "focus": "Peak Performance",
            "workout": "Push/Pull/Legs 5×/week at higher intensity. Cardio 2×/week: mix of steady-state (30 min) and HIIT (20 min). Mobility and flexibility sessions 2×/week. Deload on week 8 final days.",
        },
    ]


_PLAN_MAP = {
    "skinny": _skinny_plan,
    "fat": _fat_plan,
    "fit": _fit_plan,
}


def get_exercise_plan(category: Literal["skinny", "fit", "fat"]) -> list[dict]:
    """Return a structured 8-week exercise plan for the given BMI category."""
    return _PLAN_MAP[category]()
