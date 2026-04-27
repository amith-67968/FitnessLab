"""Groq LLM service — generates a structured diet + workout plan."""

from __future__ import annotations

import json
import logging
import os

import httpx

from models import AIPlan

logger = logging.getLogger(__name__)

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"


def _build_prompt(height: float, weight: float, bmi: float, category: str) -> str:
    """Build the system + user messages for the Groq chat completion."""
    return (
        f"User details:\n"
        f"Height: {height} cm\n"
        f"Weight: {weight} kg\n"
        f"BMI: {bmi}\n"
        f"Category: {category}\n\n"
        f"Generate a personalised fitness plan as **strict JSON only** with the "
        f"following schema — no explanation text, no markdown fences, just raw JSON:\n"
        f'{{\n'
        f'  "goal": "string — the primary fitness goal",\n'
        f'  "diet_plan": "string — a detailed daily diet plan",\n'
        f'  "workout_plan": "string — a detailed daily workout routine",\n'
        f'  "timeline": ["Week 1: ...", "Week 2: ...", ...]\n'
        f'}}'
    )


async def generate_fitness_plan(
    height: float,
    weight: float,
    bmi: float,
    category: str,
) -> AIPlan:
    """Call Groq API and return a validated ``AIPlan``.

    Raises
    ------
    httpx.HTTPStatusError  – on non-2xx response from Groq.
    ValueError             – if the model returns unparseable JSON.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set in environment variables")

    user_prompt = _build_prompt(height, weight, bmi, category)

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a certified fitness coach. "
                    "Always respond with strict JSON only — "
                    "no markdown, no explanation, no code fences."
                ),
            },
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.7,
        "max_tokens": 1024,
        "response_format": {"type": "json_object"},
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(GROQ_API_URL, json=payload, headers=headers)
        response.raise_for_status()

    data = response.json()
    raw_content: str = data["choices"][0]["message"]["content"]

    logger.debug("Groq raw response: %s", raw_content)

    try:
        plan_dict = json.loads(raw_content)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Groq returned invalid JSON: {raw_content!r}") from exc

    return AIPlan(**plan_dict)
