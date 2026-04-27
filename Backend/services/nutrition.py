"""Nutrition feedback service.

Evaluates daily intake values and returns actionable suggestions.
"""

from __future__ import annotations


def evaluate_nutrition(
    calories: float,
    protein: float,
    fibre: float,
    category: str,
) -> list[str]:
    """Return a list of plain-English nutrition tips.

    Parameters
    ----------
    calories : float  – daily calorie intake (kcal)
    protein  : float  – daily protein intake (g)
    fibre    : float  – daily fibre intake (g)
    category : str    – BMI category ("skinny" | "fit" | "fat")
    """
    feedback: list[str] = []

    # ── Protein ──────────────────────────────────────────────────────────
    if protein < 50:
        feedback.append("Increase protein intake")

    # ── Fibre ────────────────────────────────────────────────────────────
    if fibre < 20:
        feedback.append("Increase fibre intake")

    # ── Calories (context-aware) ─────────────────────────────────────────
    if category == "fat" and calories > 2200:
        feedback.append("Reduce calorie intake")
    elif category == "fit" and calories > 2500:
        feedback.append("Reduce calorie intake")
    elif category == "skinny" and calories < 1800:
        feedback.append("Increase calorie intake")
    elif calories < 1200:
        feedback.append("Increase calorie intake")
    elif calories > 3000:
        feedback.append("Reduce calorie intake")

    if not feedback:
        feedback.append("Your nutrition looks well-balanced — keep it up!")

    return feedback
