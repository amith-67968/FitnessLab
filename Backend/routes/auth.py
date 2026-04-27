"""Authentication routes — signup, login, logout, and current user."""

from __future__ import annotations

from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from dependencies import get_current_user
from services.auth_service import sign_up, sign_in, sign_out

router = APIRouter(prefix="/auth", tags=["auth"])

_bearer_scheme = HTTPBearer(auto_error=True)


# ── Request / Response Models ────────────────────────────────────────────────

class AuthRequest(BaseModel):
    """Email + password body for signup and login."""
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6, description="Password (min 6 chars)")


class AuthResponse(BaseModel):
    """Successful auth response."""
    access_token: str
    refresh_token: str | None = None
    token_type: str = "bearer"
    user: dict


class UserResponse(BaseModel):
    """Current user profile."""
    id: str
    email: str
    created_at: str | None = None


class MessageResponse(BaseModel):
    """Simple message response."""
    message: str


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(body: AuthRequest):
    """Register a new user with email and password."""
    try:
        data = await sign_up(body.email, body.password)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    session = data.get("session") or {}
    user = data.get("user") or {}

    return AuthResponse(
        access_token=session.get("access_token", ""),
        refresh_token=session.get("refresh_token"),
        user=user,
    )


@router.post("/login", response_model=AuthResponse)
async def login(body: AuthRequest):
    """Authenticate with email and password. Returns access + refresh tokens."""
    try:
        data = await sign_in(body.email, body.password)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc

    user = data.get("user") or {}

    return AuthResponse(
        access_token=data.get("access_token", ""),
        refresh_token=data.get("refresh_token"),
        user=user,
    )


@router.post("/logout", response_model=MessageResponse)
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
):
    """Invalidate the current session. Requires a valid Bearer token."""
    try:
        await sign_out(credentials.credentials)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return MessageResponse(message="Logged out successfully")


@router.get("/me", response_model=UserResponse)
async def me(user: dict = Depends(get_current_user)):
    """Get the currently authenticated user's profile."""
    return UserResponse(
        id=user.get("id", ""),
        email=user.get("email", ""),
        created_at=user.get("created_at"),
    )
