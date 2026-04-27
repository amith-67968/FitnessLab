"""FitnessLab BMI-based fitness planner API.

Run with:
    uvicorn main:app --reload
"""

from __future__ import annotations

import logging

from dotenv import load_dotenv
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dependencies import get_current_user
from models import AnalyzeRequest, AnalyzeResponse, Category, WorkoutResponse
from routes.auth import router as auth_router
from services.bmi import calculate_bmi, classify_bmi
from services.exercise import get_workout_plan
from services.nutrition import get_full_nutrition, get_nutrition_images

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-8s %(name)s %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="FitnessLab API",
    description="A formula-based fitness planner with structured nutrition and workout output.",
    version="2.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/", tags=["health"])
async def root():
    """Health-check endpoint."""
    return {"status": "ok", "service": "FitnessLab API", "version": "2.2.0"}


@app.post("/analyze", response_model=AnalyzeResponse, tags=["analyze"])
async def analyze(
    body: AnalyzeRequest,
    user: dict = Depends(get_current_user),
):
    """Analyze user metrics and return BMI plus nutrition targets."""
    logger.info("Authenticated user: %s", user.get("email", "unknown"))

    bmi = calculate_bmi(body.weight, body.height)
    category = classify_bmi(bmi)
    nutrition = get_full_nutrition(body.weight, body.gender, category)
    nutrition_images = await get_nutrition_images()

    return {
        "bmi": bmi,
        "category": category,
        "nutrition": nutrition,
        "nutrition_images": nutrition_images,
    }


@app.get("/workout/{category}", response_model=WorkoutResponse, tags=["workout"])
async def workout(
    category: Category,
    user: dict = Depends(get_current_user),
):
    """Return the detailed 8-week workout plan for a BMI category."""
    logger.info("Workout plan requested by %s for %s", user.get("email", "unknown"), category)
    return await get_workout_plan(category)
