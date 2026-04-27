"""BMI calculation service."""

from __future__ import annotations


def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    """Return BMI rounded to 2 decimal places.

    Formula: weight / (height_in_metres ** 2)
    """
    height_m = height_cm / 100.0
    bmi = weight_kg / (height_m ** 2)
    return round(bmi, 2)


def classify_bmi(bmi: float) -> str:
    """Map a BMI value to a human-readable category.

    Categories
    ----------
    * < 18.5  → "skinny"
    * 18.5–24.9 → "fit"
    * ≥ 25    → "fat"
    """
    if bmi < 18.5:
        return "skinny"
    elif bmi <= 24.9:
        return "fit"
    else:
        return "fat"
