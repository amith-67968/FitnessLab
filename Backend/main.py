"""FitnessLab — BMI-based fitness planner API.

Run with:
    uvicorn main:app --reload
"""

from __future__ import annotations

import logging

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from dependencies import get_current_user
from models import AnalyzeRequest, AnalyzeResponse
from routes.auth import router as auth_router
from services.bmi import calculate_bmi, classify_bmi
from services.nutrition import get_full_nutrition
from services.exercise import get_exercise_plan

# ── Bootstrap ────────────────────────────────────────────────────────────────
load_dotenv()  # reads .env in project root

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)

# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="FitnessLab API",
    description="A BMI-based fitness planner with formula-driven nutrition and exercise plans.",
    version="2.0.0",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth_router)


@app.get("/", tags=["health"])
async def root():
    """Health-check endpoint."""
    return {"status": "ok", "service": "FitnessLab API", "version": "2.0.0"}


@app.post("/analyze", response_model=AnalyzeResponse, tags=["analyze"])
async def analyze(
    body: AnalyzeRequest,
    user: dict = Depends(get_current_user),
):
    """Analyse user metrics and return a structured fitness plan.

    **Requires authentication** — pass a valid Bearer token in the
    Authorization header.

    Workflow
    --------
    1. Calculate BMI and classify the user.
    2. Compute nutrition targets from formulas.
    3. Generate a structured 8-week exercise plan.
    4. Return the combined response.
    """
    logger.info("Authenticated user: %s", user.get("email", "unknown"))

    # 1. BMI
    bmi = calculate_bmi(body.weight, body.height)
    category = classify_bmi(bmi)
    logger.info("BMI=%.1f  category=%s  gender=%s", bmi, category, body.gender)

    # 2. Nutrition (formula-based)
    nutrition = get_full_nutrition(body.weight, body.gender, category)

    # 3. Exercise plan (deterministic)
    exercise_plan = get_exercise_plan(category)

    # 4. Response
    return AnalyzeResponse(
        bmi=bmi,
        category=category,
        nutrition=nutrition,
        exercise_plan=exercise_plan,
    )
