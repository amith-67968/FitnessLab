"""Supabase authentication service.

Uses the Supabase Auth REST API directly via httpx — no heavy SDK needed.
"""

from __future__ import annotations

import logging
import os
from pathlib import Path

import httpx
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

load_dotenv(Path(__file__).resolve().parents[1] / ".env")


def _get_config() -> tuple[str, str]:
    """Return (supabase_url, supabase_anon_key) from environment."""
    url = os.getenv("SUPABASE_URL", "")
    key = os.getenv("SUPABASE_ANON_KEY", "")
    if not url or not key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env"
        )
    if not url.startswith(("http://", "https://")):
        raise RuntimeError(
            f"SUPABASE_URL must start with http:// or https:// (got: {url!r})"
        )
    return url.rstrip("/"), key


def _auth_headers(anon_key: str, access_token: str | None = None) -> dict[str, str]:
    """Build the standard Supabase request headers."""
    headers = {
        "apikey": anon_key,
        "Content-Type": "application/json",
    }
    if access_token:
        headers["Authorization"] = f"Bearer {access_token}"
    else:
        headers["Authorization"] = f"Bearer {anon_key}"
    return headers


# ── Sign Up ──────────────────────────────────────────────────────────────────

async def sign_up(email: str, password: str) -> dict:
    """Register a new user with email + password.

    Returns the raw Supabase response dict (contains user, session, etc.).
    """
    url, key = _get_config()
    endpoint = f"{url}/auth/v1/signup"

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                endpoint,
                headers=_auth_headers(key),
                json={"email": email, "password": password},
            )
    except httpx.HTTPError as exc:
        logger.exception("Supabase signup request failed")
        raise RuntimeError(f"Could not reach Supabase: {exc}") from exc

    data = resp.json()
    if resp.status_code >= 400:
        error_msg = data.get("error_description") or data.get("msg") or data.get("message", "Sign-up failed")
        raise ValueError(error_msg)

    return data


# ── Sign In ──────────────────────────────────────────────────────────────────

async def sign_in(email: str, password: str) -> dict:
    """Authenticate an existing user with email + password.

    Returns dict with access_token, refresh_token, user, etc.
    """
    url, key = _get_config()
    endpoint = f"{url}/auth/v1/token?grant_type=password"

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                endpoint,
                headers=_auth_headers(key),
                json={"email": email, "password": password},
            )
    except httpx.HTTPError as exc:
        logger.exception("Supabase sign-in request failed")
        raise RuntimeError(f"Could not reach Supabase: {exc}") from exc

    data = resp.json()
    if resp.status_code >= 400:
        error_msg = data.get("error_description") or data.get("msg") or data.get("message", "Sign-in failed")
        raise ValueError(error_msg)

    return data


# ── Get Current User ─────────────────────────────────────────────────────────

async def get_user(access_token: str) -> dict:
    """Fetch the authenticated user's profile from Supabase.

    Returns the user object or raises on invalid/expired token.
    """
    url, key = _get_config()
    endpoint = f"{url}/auth/v1/user"

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(
                endpoint,
                headers=_auth_headers(key, access_token),
            )
    except httpx.HTTPError as exc:
        logger.exception("Supabase get-user request failed")
        raise RuntimeError(f"Could not reach Supabase: {exc}") from exc

    data = resp.json()
    if resp.status_code >= 400:
        error_msg = data.get("error_description") or data.get("msg") or data.get("message", "Unauthorized")
        raise ValueError(error_msg)

    return data


# ── Sign Out ─────────────────────────────────────────────────────────────────

async def sign_out(access_token: str) -> None:
    """Invalidate the user's session on Supabase."""
    url, key = _get_config()
    endpoint = f"{url}/auth/v1/logout"

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                endpoint,
                headers=_auth_headers(key, access_token),
            )
    except httpx.HTTPError as exc:
        logger.exception("Supabase logout request failed")
        raise RuntimeError(f"Could not reach Supabase: {exc}") from exc

    if resp.status_code >= 400:
        data = resp.json()
        error_msg = data.get("error_description") or data.get("msg") or data.get("message", "Logout failed")
        raise ValueError(error_msg)
