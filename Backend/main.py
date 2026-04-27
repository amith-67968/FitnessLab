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
from models import AnalyzeRequest, AnalyzeResponse
from routes.auth import router as auth_router
from services.bmi import calculate_bmi, classify_bmi
from services.exercise import get_exercise_plan
from services.nutrition import get_full_nutrition

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-8s %(name)s %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="FitnessLab API",
    description="A formula-based fitness planner with structured nutrition and exercise output.",
    version="2.1.0",
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
    return {"status": "ok", "service": "FitnessLab API", "version": "2.1.0"}


@app.post("/analyze", response_model=AnalyzeResponse, tags=["analyze"])
async def analyze(
    body: AnalyzeRequest,
    user: dict = Depends(get_current_user),
):
    """Analyze user metrics and return a structured fitness plan."""
    logger.info("Authenticated user: %s", user.get("email", "unknown"))

    bmi = calculate_bmi(body.weight, body.height)
    category = classify_bmi(bmi)
    nutrition = get_full_nutrition(body.weight, body.gender, category)
    exercise_plan = get_exercise_plan(category)

    return AnalyzeResponse(
        bmi=bmi,
        category=category,
        nutrition=nutrition,
        exercise_plan=exercise_plan,
    )
