"""Unsplash image service — fetches fitness images and returns Base64."""

from __future__ import annotations

import base64
import logging
import os

import httpx

logger = logging.getLogger(__name__)

UNSPLASH_API_URL = "https://api.unsplash.com/search/photos"
MAX_IMAGES = 2
# Limit individual image downloads to 2 MB to prevent huge payloads.
MAX_IMAGE_BYTES = 2 * 1024 * 1024


async def fetch_fitness_images(query: str = "fitness workout") -> list[str]:
    """Search Unsplash for *query*, download up to ``MAX_IMAGES``, and
    return them as Base64-encoded strings.

    If the Unsplash key is missing or an error occurs, an empty list is
    returned so the main endpoint never fails because of images.
    """
    access_key = os.getenv("UNSPLASH_ACCESS_KEY")
    if not access_key:
        logger.warning("UNSPLASH_ACCESS_KEY not set — skipping images")
        return []

    try:
        return await _search_and_encode(access_key, query)
    except Exception:
        logger.exception("Image fetching failed")
        return []


async def _search_and_encode(access_key: str, query: str) -> list[str]:
    """Internal helper that performs the Unsplash search + download."""
    params = {
        "query": query,
        "per_page": MAX_IMAGES,
        "orientation": "landscape",
    }
    headers = {"Authorization": f"Client-ID {access_key}"}

    async with httpx.AsyncClient(timeout=15.0) as client:
        # 1. Search Unsplash
        search_resp = await client.get(
            UNSPLASH_API_URL, params=params, headers=headers,
        )
        search_resp.raise_for_status()
        results = search_resp.json().get("results", [])

        if not results:
            logger.info("No Unsplash results for query=%r", query)
            return []

        # 2. Download each image (use "small" variant to limit size)
        encoded_images: list[str] = []
        for item in results[:MAX_IMAGES]:
            image_url: str = item["urls"].get("small", item["urls"]["regular"])
            img_resp = await client.get(image_url, timeout=10.0)
            img_resp.raise_for_status()

            if len(img_resp.content) > MAX_IMAGE_BYTES:
                logger.warning(
                    "Image from %s exceeds %d bytes — skipped",
                    image_url,
                    MAX_IMAGE_BYTES,
                )
                continue

            b64 = base64.b64encode(img_resp.content).decode("utf-8")
            encoded_images.append(b64)

        return encoded_images
