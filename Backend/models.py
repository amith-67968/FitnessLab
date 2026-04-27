"""Pydantic models for request/response validation."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


# ── Request ──────────────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    """Body accepted by POST /analyze."""

    height: float = Field(..., gt=0, description="Height in centimetres")
    weight: float = Field(..., gt=0, description="Weight in kilograms")
    gender: Literal["male", "female"] = Field(..., description="Gender: male or female")


# ── Nested Response Models ───────────────────────────────────────────────────

class NutritionPlan(BaseModel):
    """Macro-nutrient targets calculated from formulas."""

    calories: int
    protein: int
    fibre: int
    fats: int
    carbs: int


class ExerciseWeek(BaseModel):
    """One phase of the 8-week exercise plan."""

    week: str
    focus: str
    workout: str


# ── Response ─────────────────────────────────────────────────────────────────

class AnalyzeResponse(BaseModel):
    """Full response returned by POST /analyze."""

    bmi: float
    category: Literal["skinny", "fit", "fat"]
    nutrition: NutritionPlan
    exercise_plan: list[ExerciseWeek]
