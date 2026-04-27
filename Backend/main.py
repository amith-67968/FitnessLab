"""FitnessLab — BMI-based fitness planner API.

Run with:
    uvicorn main:app --reload
"""

from __future__ import annotations

import logging

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException

from dependencies import get_current_user
from models import AnalyzeRequest, AnalyzeResponse
from routes.auth import router as auth_router
from services.bmi import calculate_bmi, classify_bmi
from services.groq_service import generate_fitness_plan
from services.image_service import fetch_fitness_images
from services.nutrition import evaluate_nutrition

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
    description="A BMI-based fitness planner powered by Groq LLM and Unsplash images.",
    version="1.0.0",
)

# ── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth_router)


@app.get("/", tags=["health"])
async def root():
    """Health-check endpoint."""
    return {"status": "ok", "service": "FitnessLab API"}


@app.post("/analyze", response_model=AnalyzeResponse, tags=["analyze"])
async def analyze(
    body: AnalyzeRequest,
    user: dict = Depends(get_current_user),
):
    """Analyse user metrics and return a personalised fitness plan.

    **Requires authentication** — pass a valid Bearer token in the
    Authorization header.

    Workflow
    --------
    1. Calculate BMI and classify the user.
    2. Generate a diet + workout plan via Groq LLM.
    3. Evaluate nutrition intake and produce feedback.
    4. Fetch fitness-related images from Unsplash (Base64-encoded).
    5. Return the combined response.
    """
    logger.info("Authenticated user: %s", user.get("email", "unknown"))

    # 1. BMI
    bmi = calculate_bmi(body.weight, body.height)
    category = classify_bmi(bmi)
    logger.info("BMI=%.2f  category=%s", bmi, category)

    # 2. AI plan (Groq)
    try:
        ai_plan = await generate_fitness_plan(
            height=body.height,
            weight=body.weight,
            bmi=bmi,
            category=category,
        )
    except RuntimeError as exc:
        # Missing API key
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Groq API call failed")
        raise HTTPException(
            status_code=502,
            detail=f"Failed to generate fitness plan: {exc}",
        ) from exc

    # 3. Nutrition feedback
    feedback = evaluate_nutrition(
        calories=body.calories,
        protein=body.protein,
        fibre=body.fibre,
        category=category,
    )

    # 4. Images (non-critical — failures return an empty list)
    search_query = f"{category} fitness workout"
    images = await fetch_fitness_images(query=search_query)

    # 5. Response
    return AnalyzeResponse(
        bmi=bmi,
        category=category,
        ai_plan=ai_plan,
        nutrition_feedback=feedback,
        images=images,
    )
