"""Formula-based nutrition calculations.

All values are derived from weight, gender, and BMI category — no AI involved.
"""

from __future__ import annotations

from typing import Literal


def calculate_calories(
    weight: float,
    gender: Literal["male", "female"],
    category: Literal["skinny", "fit", "fat"],
) -> int:
    """Daily calorie target.

    Base: male → weight × 24, female → weight × 22.
    Adjusted: skinny +300, fit +0, fat −300.
    """
    base = weight * (24 if gender == "male" else 22)
    adjustment = {"skinny": 300, "fit": 0, "fat": -300}
    return round(base + adjustment[category])


def calculate_protein(
    weight: float,
    category: Literal["skinny", "fit", "fat"],
) -> int:
    """Daily protein target in grams.

    skinny → 1.5 × weight, fit → 1.0 × weight, fat → 1.2 × weight.
    """
    multiplier = {"skinny": 1.5, "fit": 1.0, "fat": 1.2}
    return round(weight * multiplier[category])


def calculate_fibre(gender: Literal["male", "female"]) -> int:
    """Daily fibre target in grams.

    male → 30 g, female → 25 g.
    """
    return 30 if gender == "male" else 25


def calculate_fats(calories: int) -> int:
    """Daily fat target in grams (25 % of calories ÷ 9)."""
    return round(calories * 0.25 / 9)


def calculate_carbs(calories: int, protein: int, fats: int) -> int:
    """Daily carb target in grams.

    Remaining calories after protein (4 kcal/g) and fats (9 kcal/g), divided by 4.
    """
    remaining = calories - (protein * 4) - (fats * 9)
    return round(max(remaining, 0) / 4)


def get_full_nutrition(
    weight: float,
    gender: Literal["male", "female"],
    category: Literal["skinny", "fit", "fat"],
) -> dict:
    """Return all macro targets as a dict ready for the API response."""
    calories = calculate_calories(weight, gender, category)
    protein = calculate_protein(weight, category)
    fibre = calculate_fibre(gender)
    fats = calculate_fats(calories)
    carbs = calculate_carbs(calories, protein, fats)

    return {
        "calories": calories,
        "protein": protein,
        "fibre": fibre,
        "fats": fats,
        "carbs": carbs,
    }
