"""FastAPI main application with routes and middleware."""

import os
import uuid
from pathlib import Path
from typing import List

from fastapi import FastAPI, Depends, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from starlette.middleware.base import BaseHTTPMiddleware

from .database import get_db, init_db
from .models import Persona
from .schemas import PersonaCreateRequest, PersonaResponse, PersonaListItem, PersonaProfile
from .llm_client import analyze_persona_from_logs


# ============================================================================
# Session Middleware
# ============================================================================

class SessionMiddleware(BaseHTTPMiddleware):
    """
    Middleware to manage anonymous session IDs via cookies.

    If no session_id cookie exists, generates a new UUID and sets the cookie.
    Attaches session_id to request.state for use in route handlers.
    """

    async def dispatch(self, request: Request, call_next):
        # Check for existing session_id cookie
        session_id = request.cookies.get("session_id")

        # Generate new session if none exists
        if not session_id:
            session_id = str(uuid.uuid4())

        # Attach to request state
        request.state.session_id = session_id

        # Process request
        response = await call_next(request)

        # Set cookie in response (with httponly and samesite for security)
        response.set_cookie(
            key="session_id",
            value=session_id,
            httponly=True,
            samesite="lax",
            max_age=60 * 60 * 24 * 365,  # 1 year
        )

        return response


# ============================================================================
# FastAPI App Setup
# ============================================================================

app = FastAPI(
    title="Persona Vault API",
    description="API for backing up and restoring AI persona identities",
    version="1.0.0"
)

# Add session middleware
app.add_middleware(SessionMiddleware)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        # Add production frontend URL when deployed
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# Startup event
# ============================================================================

@app.on_event("startup")
def on_startup():
    """Initialize database on application startup."""
    init_db()
    # Ensure logs directory exists
    logs_dir = Path("logs")
    logs_dir.mkdir(exist_ok=True)


# ============================================================================
# API Routes
# ============================================================================

@app.get("/")
def read_root():
    """Health check endpoint."""
    return {"status": "ok", "app": "Persona Vault API"}


@app.post("/api/personas", response_model=PersonaResponse, status_code=201)
async def create_persona(
    request: Request,
    persona_request: PersonaCreateRequest,
    db: Session = Depends(get_db)
):
    """
    Create a new persona backup from chat logs.

    Args:
        request: FastAPI request (contains session_id in state)
        persona_request: Persona creation data
        db: Database session

    Returns:
        PersonaResponse: Created persona data

    Raises:
        HTTPException: If logs are empty or processing fails
    """
    # Validate logs are not empty
    if not persona_request.logs_text.strip():
        raise HTTPException(status_code=400, detail="Chat logs cannot be empty")

    # Get session_id from request state (set by middleware)
    session_id = request.state.session_id

    # Generate unique ID for this persona
    persona_id = str(uuid.uuid4())

    # Save raw logs to file
    logs_dir = Path("logs")
    logs_path = logs_dir / f"{persona_id}.txt"
    logs_path.write_text(persona_request.logs_text, encoding="utf-8")

    try:
        # Analyze logs using LLM
        analysis_result = await analyze_persona_from_logs(
            logs=persona_request.logs_text,
            persona_name=persona_request.name,
            user_relationship_notes=persona_request.user_relationship_notes
        )

        # Create persona record
        persona = Persona(
            id=persona_id,
            session_id=session_id,
            name=persona_request.name,
            source_platform=persona_request.source_platform,
            tagline=analysis_result.tagline,
            persona_profile_json=analysis_result.persona_profile.model_dump(),
            persona_description=analysis_result.persona_description,
            restoration_prompt=analysis_result.restoration_prompt,
            user_relationship_notes=persona_request.user_relationship_notes,
            logs_path=str(logs_path)
        )

        db.add(persona)
        db.commit()
        db.refresh(persona)

        # Build response
        return PersonaResponse(
            id=persona.id,
            session_id=persona.session_id,
            name=persona.name,
            source_platform=persona.source_platform,
            tagline=persona.tagline,
            persona_profile=PersonaProfile(**persona.persona_profile_json),
            persona_description=persona.persona_description,
            restoration_prompt=persona.restoration_prompt,
            user_relationship_notes=persona.user_relationship_notes,
            created_at=persona.created_at,
            updated_at=persona.updated_at
        )

    except Exception as e:
        # Clean up logs file if persona creation fails
        if logs_path.exists():
            logs_path.unlink()
        raise HTTPException(status_code=500, detail=f"Failed to analyze persona: {str(e)}")


@app.get("/api/personas", response_model=List[PersonaListItem])
def list_personas(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    List all personas for the current session.

    Args:
        request: FastAPI request (contains session_id in state)
        db: Database session

    Returns:
        List of PersonaListItem
    """
    session_id = request.state.session_id

    personas = db.query(Persona).filter(
        Persona.session_id == session_id
    ).order_by(Persona.created_at.desc()).all()

    return [
        PersonaListItem(
            id=p.id,
            name=p.name,
            tagline=p.tagline,
            source_platform=p.source_platform,
            created_at=p.created_at
        )
        for p in personas
    ]


@app.get("/api/personas/{persona_id}", response_model=PersonaResponse)
def get_persona(
    persona_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a specific persona by ID.

    Args:
        persona_id: UUID of the persona
        db: Database session

    Returns:
        PersonaResponse: Persona data

    Raises:
        HTTPException: If persona not found
    """
    persona = db.query(Persona).filter(Persona.id == persona_id).first()

    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")

    return PersonaResponse(
        id=persona.id,
        session_id=persona.session_id,
        name=persona.name,
        source_platform=persona.source_platform,
        tagline=persona.tagline,
        persona_profile=PersonaProfile(**persona.persona_profile_json),
        persona_description=persona.persona_description,
        restoration_prompt=persona.restoration_prompt,
        user_relationship_notes=persona.user_relationship_notes,
        created_at=persona.created_at,
        updated_at=persona.updated_at
    )


# ============================================================================
# Main entry point
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
