"""Pydantic models for request and response validation."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

Gender = Literal["male", "female"]
Category = Literal["skinny", "fit", "fat"]


class AnalyzeRequest(BaseModel):
    """Body accepted by POST /analyze."""

    height: float = Field(..., gt=0, le=300, description="Height in centimeters")
    weight: float = Field(..., gt=0, le=500, description="Weight in kilograms")
    gender: Gender = Field(..., description="Gender")

    class Config:
        extra = "forbid"


class NutritionPlan(BaseModel):
    """Macro targets calculated from formulas."""

    calories: int
    protein: int
    fibre: int
    fats: int
    carbs: int


class NutritionImages(BaseModel):
    """One base64 image for each nutrient."""

    calories: str = ""
    protein: str = ""
    fibre: str = ""
    fats: str = ""
    carbs: str = ""


class AnalyzeResponse(BaseModel):
    """Structured response returned by POST /analyze."""

    bmi: float
    category: Category
    nutrition: NutritionPlan
    nutrition_images: NutritionImages


class WorkoutExercise(BaseModel):
    """A specific exercise in a weekly workout block."""

    name: str
    sets: str
    notes: str


class WorkoutWeek(BaseModel):
    """One block in the 8-week workout plan."""

    week: str
    focus: str
    details: str
    exercises: list[WorkoutExercise]
    images: list[str]


class WorkoutResponse(BaseModel):
    """Detailed workout plan returned by GET /workout/{category}."""

    title: str
    description: str
    weeks: list[WorkoutWeek]
