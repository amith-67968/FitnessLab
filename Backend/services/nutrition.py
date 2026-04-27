"""Formula-based nutrition calculations and nutrient image lookup."""

from __future__ import annotations

import asyncio

from models import Category, Gender
from services.image_service import fetch_single_image

_NUTRIENT_IMAGE_QUERIES = {
    "calories": "healthy balanced meal",
    "protein": "protein rich food",
    "fibre": "fiber rich vegetables",
    "fats": "healthy fats avocado nuts",
    "carbs": "healthy carbohydrates whole grains",
}


def calculate_calories(weight: float, gender: Gender, category: Category) -> int:
    """Return the daily calorie target."""
    base_calories = weight * (24 if gender == "male" else 22)
    category_adjustment = {"skinny": 300, "fit": 0, "fat": -300}
    return round(base_calories + category_adjustment[category])


def calculate_protein(weight: float, category: Category) -> int:
    """Return the daily protein target in grams."""
    protein_multiplier = {"skinny": 1.5, "fit": 1.0, "fat": 1.2}
    return round(weight * protein_multiplier[category])


def calculate_fibre(gender: Gender) -> int:
    """Return the daily fibre target in grams."""
    return 30 if gender == "male" else 25


def calculate_fats(calories: int) -> int:
    """Return daily fat target in grams."""
    return round((calories * 0.25) / 9)


def calculate_carbs(calories: int, fats: int) -> int:
    """Return daily carb target in grams from remaining calories after fats."""
    remaining_calories = max(calories - (fats * 9), 0)
    return round(remaining_calories / 4)


def get_full_nutrition(weight: float, gender: Gender, category: Category) -> dict:
    """Return the full nutrition plan for the response body."""
    calories = calculate_calories(weight, gender, category)
    protein = calculate_protein(weight, category)
    fibre = calculate_fibre(gender)
    fats = calculate_fats(calories)
    carbs = calculate_carbs(calories, fats)

    return {
        "calories": calories,
        "protein": protein,
        "fibre": fibre,
        "fats": fats,
        "carbs": carbs,
    }


async def get_nutrition_images() -> dict[str, str]:
    """Return one base64 image for each nutrition target."""
    nutrient_names = list(_NUTRIENT_IMAGE_QUERIES)
    image_tasks = [
        fetch_single_image(_NUTRIENT_IMAGE_QUERIES[nutrient])
        for nutrient in nutrient_names
    ]
    images = await asyncio.gather(*image_tasks)
    return dict(zip(nutrient_names, images))
