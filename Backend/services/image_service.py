"""Unsplash image helpers that return downloaded images as base64 strings."""

from __future__ import annotations

import base64
import logging
import os

import httpx

logger = logging.getLogger(__name__)

UNSPLASH_API_URL = "https://api.unsplash.com/search/photos"
MAX_IMAGE_BYTES = 2 * 1024 * 1024


async def fetch_base64_images(query: str, count: int = 1) -> list[str]:
    """Return up to ``count`` Unsplash images for ``query`` as base64 strings."""
    access_key = os.getenv("UNSPLASH_ACCESS_KEY")
    if not access_key:
        logger.warning("UNSPLASH_ACCESS_KEY not set; skipping images for query=%r", query)
        return []

    safe_count = max(1, min(count, 3))
    try:
        return await _search_and_encode(access_key, query, safe_count)
    except Exception:
        logger.exception("Image fetching failed for query=%r", query)
        return []


async def fetch_single_image(query: str) -> str:
    """Return one base64 image for ``query`` or an empty string."""
    images = await fetch_base64_images(query, count=1)
    return images[0] if images else ""


async def _search_and_encode(access_key: str, query: str, count: int) -> list[str]:
    params = {
        "query": query,
        "per_page": count,
        "orientation": "landscape",
        "content_filter": "high",
    }
    headers = {"Authorization": f"Client-ID {access_key}"}

    async with httpx.AsyncClient(timeout=15.0) as client:
        search_resp = await client.get(
            UNSPLASH_API_URL,
            params=params,
            headers=headers,
        )
        search_resp.raise_for_status()
        results = search_resp.json().get("results", [])

        encoded_images: list[str] = []
        for item in results[:count]:
            image_url = item["urls"].get("small") or item["urls"].get("regular")
            if not image_url:
                continue

            image_resp = await client.get(image_url, timeout=10.0)
            image_resp.raise_for_status()

            if len(image_resp.content) > MAX_IMAGE_BYTES:
                logger.warning("Image from %s exceeds %d bytes", image_url, MAX_IMAGE_BYTES)
                continue

            encoded_images.append(base64.b64encode(image_resp.content).decode("utf-8"))

        return encoded_images
