"""Structured 8-week workout plans based on BMI category."""

from __future__ import annotations

import asyncio
from copy import deepcopy

from models import Category
from services.image_service import fetch_base64_images

_IMAGE_QUERIES = {
    "cardio": "running workout",
    "strength": "gym training",
    "hiit": "hiit workout",
}

_PLANS = {
    "skinny": {
        "title": "8 Week Strength Gain Plan",
        "description": "This plan focuses on progressive strength training to build muscle, improve lifting confidence, and support healthy weight gain.",
        "weeks": [
            {
                "week": "1-2",
                "focus": "Strength foundation",
                "image_type": "strength",
                "details": "Start with controlled full-body training three days per week. The goal is to learn safe movement patterns, build consistency, and create a baseline before adding heavier loads.",
                "exercises": [
                    {"name": "Goblet Squat", "sets": "3 sets of 10 reps", "notes": "Keep your chest tall and move slowly."},
                    {"name": "Dumbbell Bench Press", "sets": "3 sets of 10 reps", "notes": "Use a weight you can control without shoulder pain."},
                    {"name": "Seated Cable Row", "sets": "3 sets of 12 reps", "notes": "Pull elbows back and squeeze your upper back."},
                ],
            },
            {
                "week": "3-4",
                "focus": "Progressive overload",
                "image_type": "strength",
                "details": "Move to four training days and gradually increase weight when all reps feel steady. This phase teaches the body to adapt through small, repeatable increases.",
                "exercises": [
                    {"name": "Barbell Squat", "sets": "4 sets of 8 reps", "notes": "Add weight only when form stays consistent."},
                    {"name": "Lat Pulldown", "sets": "4 sets of 10 reps", "notes": "Pull to the upper chest and avoid swinging."},
                    {"name": "Romanian Deadlift", "sets": "3 sets of 10 reps", "notes": "Hinge at the hips and keep the back neutral."},
                ],
            },
            {
                "week": "5-6",
                "focus": "Muscle building",
                "image_type": "strength",
                "details": "Use higher training volume to drive hypertrophy. Keep rest periods around 60 to 90 seconds and prioritize smooth reps over maximum weight.",
                "exercises": [
                    {"name": "Incline Dumbbell Press", "sets": "4 sets of 8-12 reps", "notes": "Lower the weights with control."},
                    {"name": "Leg Press", "sets": "4 sets of 12 reps", "notes": "Use a full comfortable range of motion."},
                    {"name": "Face Pull", "sets": "3 sets of 15 reps", "notes": "Focus on shoulder stability and posture."},
                ],
            },
            {
                "week": "7-8",
                "focus": "Strength peak",
                "image_type": "strength",
                "details": "Finish with heavier compound lifts and enough recovery to grow. The aim is to feel stronger without grinding every set to failure.",
                "exercises": [
                    {"name": "Deadlift", "sets": "5 sets of 5 reps", "notes": "Rest 2 minutes and keep each rep crisp."},
                    {"name": "Bench Press", "sets": "5 sets of 5 reps", "notes": "Keep feet planted and shoulder blades stable."},
                    {"name": "Pull-Up or Assisted Pull-Up", "sets": "4 sets of 6-8 reps", "notes": "Use assistance if needed to complete clean reps."},
                ],
            },
        ],
    },
    "fat": {
        "title": "8 Week Fat Loss Conditioning Plan",
        "description": "This plan builds cardio capacity, introduces HIIT safely, and uses strength circuits to support fat loss while protecting lean muscle.",
        "weeks": [
            {
                "week": "1-2",
                "focus": "Cardio base",
                "image_type": "cardio",
                "details": "Begin with low-impact steady cardio to build endurance without overwhelming recovery. A consistent base makes later HIIT sessions safer and more effective.",
                "exercises": [
                    {"name": "Brisk Walking", "sets": "30 minutes", "notes": "Maintain a steady pace where talking is possible."},
                    {"name": "Cycling", "sets": "20-30 minutes", "notes": "Keep resistance moderate and cadence smooth."},
                    {"name": "Plank", "sets": "3 sets of 20-30 seconds", "notes": "Brace your core and avoid sagging hips."},
                ],
            },
            {
                "week": "3-4",
                "focus": "HIIT introduction",
                "image_type": "hiit",
                "details": "Add short intervals to raise intensity while keeping total work manageable. The goal is better conditioning, not exhaustion.",
                "exercises": [
                    {"name": "High Knees", "sets": "10 rounds of 30 seconds", "notes": "Rest 30 seconds between rounds."},
                    {"name": "Mountain Climbers", "sets": "3 sets of 20 reps", "notes": "Move quickly while keeping shoulders stacked."},
                    {"name": "Bodyweight Squat", "sets": "3 sets of 12 reps", "notes": "Control the lowering phase."},
                ],
            },
            {
                "week": "5-6",
                "focus": "Fat-loss intensity",
                "image_type": "hiit",
                "details": "Increase interval density and add resistance circuits. This combines calorie burn with muscle-preserving strength work.",
                "exercises": [
                    {"name": "Sprint Intervals", "sets": "12 rounds of 20 seconds", "notes": "Rest 40 seconds and stop if form breaks down."},
                    {"name": "Dumbbell Circuit", "sets": "4 rounds", "notes": "Use squat, press, row, and lunge movements."},
                    {"name": "Burpee Step-Back", "sets": "3 sets of 8 reps", "notes": "Use the step-back version to reduce joint impact."},
                ],
            },
            {
                "week": "7-8",
                "focus": "Conditioning and lean muscle",
                "image_type": "cardio",
                "details": "Blend steady cardio, HIIT, and strength sessions so fitness improves without relying on one training style. Recovery remains important.",
                "exercises": [
                    {"name": "Jog or Fast Walk", "sets": "40 minutes", "notes": "Stay in a sustainable pace zone."},
                    {"name": "Kettlebell Deadlift", "sets": "4 sets of 10 reps", "notes": "Hinge from the hips and keep the weight close."},
                    {"name": "Battle Rope Intervals", "sets": "8 rounds of 20 seconds", "notes": "Rest 40 seconds and keep posture tall."},
                ],
            },
        ],
    },
    "fit": {
        "title": "8 Week Balanced Performance Plan",
        "description": "This plan balances strength, cardio, HIIT, and mobility so you can maintain a healthy body composition while improving performance.",
        "weeks": [
            {
                "week": "1-2",
                "focus": "Balanced base",
                "image_type": "strength",
                "details": "Use full-body sessions and light cardio to establish a baseline. This phase keeps training broad and sustainable.",
                "exercises": [
                    {"name": "Push-Up", "sets": "3 sets of 12-15 reps", "notes": "Keep a straight line from shoulders to ankles."},
                    {"name": "Walking Lunge", "sets": "3 sets of 10 reps per leg", "notes": "Step long enough to keep the front knee stable."},
                    {"name": "Easy Jog", "sets": "20 minutes", "notes": "Stay relaxed and breathe rhythmically."},
                ],
            },
            {
                "week": "3-4",
                "focus": "Strength and cardio",
                "image_type": "cardio",
                "details": "Alternate strength days with interval cardio. This keeps the plan balanced while steadily improving work capacity.",
                "exercises": [
                    {"name": "Upper-Lower Split", "sets": "4 sessions per week", "notes": "Train upper body twice and lower body twice."},
                    {"name": "Interval Run", "sets": "8 rounds of 1 minute", "notes": "Jog 2 minutes between faster efforts."},
                    {"name": "Hanging Knee Raise", "sets": "3 sets of 10 reps", "notes": "Avoid swinging and control each rep."},
                ],
            },
            {
                "week": "5-6",
                "focus": "Performance build",
                "image_type": "hiit",
                "details": "Add one focused HIIT day while maintaining progressive strength work. The goal is better power, stamina, and movement quality.",
                "exercises": [
                    {"name": "Push Press", "sets": "4 sets of 6 reps", "notes": "Drive from the legs and lock out smoothly."},
                    {"name": "Rowing Intervals", "sets": "10 rounds of 30 seconds", "notes": "Rest 60 seconds and keep strokes powerful."},
                    {"name": "Single-Leg Romanian Deadlift", "sets": "3 sets of 8 reps per leg", "notes": "Move slowly and focus on balance."},
                ],
            },
            {
                "week": "7-8",
                "focus": "Peak balance",
                "image_type": "strength",
                "details": "Finish with a strong blend of lifting, conditioning, and mobility. Week 8 should feel challenging but controlled.",
                "exercises": [
                    {"name": "Front Squat", "sets": "4 sets of 6 reps", "notes": "Keep elbows high and torso upright."},
                    {"name": "Tempo Run", "sets": "25 minutes", "notes": "Run at a firm but sustainable effort."},
                    {"name": "Mobility Flow", "sets": "15 minutes", "notes": "Focus on hips, ankles, shoulders, and thoracic spine."},
                ],
            },
        ],
    },
}


async def get_workout_plan(category: Category) -> dict:
    """Return a detailed 8-week workout plan with Unsplash images."""
    plan = deepcopy(_PLANS[category])

    image_tasks = [
        fetch_base64_images(_IMAGE_QUERIES[week["image_type"]], count=3)
        for week in plan["weeks"]
    ]
    weekly_images = await asyncio.gather(*image_tasks)

    for week, images in zip(plan["weeks"], weekly_images):
        week["images"] = images
        del week["image_type"]

    return plan
