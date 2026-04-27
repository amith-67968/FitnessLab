"""BMI calculation and classification."""

from __future__ import annotations


def calculate_bmi(weight: float, height: float) -> float:
    """Return BMI rounded to 1 decimal place.

    Parameters
    ----------
    weight : float
        Weight in kilograms.
    height : float
        Height in centimetres.
    """
    height_m = height / 100
    return round(weight / (height_m ** 2), 1)


def classify_bmi(bmi: float) -> str:
    """Classify BMI into a category.

    Returns
    -------
    str
        One of ``"skinny"``, ``"fit"``, or ``"fat"``.
    """
    if bmi < 18.5:
        return "skinny"
    if bmi < 25:
        return "fit"
    return "fat"
