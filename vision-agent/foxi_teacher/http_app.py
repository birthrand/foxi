from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field
from vision_agents.core import AgentLauncher
from vision_agents.core.agents.exceptions import (
    MaxConcurrentSessionsExceeded,
    MaxSessionsPerCallExceeded,
)
from vision_agents.core.runner.http.api import lifespan, router as base_router
from vision_agents.core.runner.http.dependencies import (
    can_close_session,
    can_start_session,
    can_view_metrics,
    can_view_session,
    get_launcher,
)
from vision_agents.core.runner.http.models import StartSessionResponse
from vision_agents.core.runner.http.options import ServeOptions

from foxi_teacher.lesson_context_store import set_pending_lesson_custom

logger = logging.getLogger(__name__)


class FoxiStartSessionRequest(BaseModel):
    call_type: str = Field(default="audio_room", description="Type of the call to join")
    lesson_custom: dict[str, Any] | None = Field(
        default=None,
        alias="lessonCustom",
        description="Lesson metadata from the Expo app (preferred over Stream call custom)",
    )

    model_config = {"populate_by_name": True}


foxi_router = APIRouter()


@foxi_router.post(
    "/calls/{call_id}/sessions",
    response_model=StartSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Join call with Foxi AI teacher",
    dependencies=[Depends(can_start_session)],
)
async def start_foxi_session(
    call_id: str,
    request: FoxiStartSessionRequest,
    launcher: AgentLauncher = Depends(get_launcher),
) -> StartSessionResponse:
    if request.lesson_custom:
        language_code = request.lesson_custom.get("languageCode")
        lesson_title = request.lesson_custom.get("lessonTitle")
        set_pending_lesson_custom(call_id, request.lesson_custom)
        logger.info(
            "Queued lesson custom for call %s (%s — %s)",
            call_id,
            language_code,
            lesson_title,
        )
    else:
        logger.warning(
            "Start session for %s without lessonCustom in request body",
            call_id,
        )

    try:
        session = await launcher.start_session(
            call_id=call_id,
            call_type=request.call_type,
        )
    except MaxConcurrentSessionsExceeded as exc:
        raise HTTPException(
            status_code=429,
            detail="Reached maximum number of concurrent sessions",
        ) from exc
    except MaxSessionsPerCallExceeded as exc:
        raise HTTPException(
            status_code=429,
            detail="Reached maximum number of sessions for this call",
        ) from exc
    except Exception as exc:
        logger.exception("Failed to start Foxi agent session")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to start agent",
        ) from exc

    return StartSessionResponse(
        session_id=session.id,
        call_id=session.call_id,
        session_started_at=session.started_at,
    )


def create_foxi_fastapi_app(
    launcher: AgentLauncher,
    options: ServeOptions | None = None,
) -> FastAPI:
    serve_options = options or ServeOptions()
    app = FastAPI(lifespan=lifespan)
    app.state.launcher = launcher
    app.state.options = serve_options

    app.dependency_overrides[can_start_session] = serve_options.can_start_session
    app.dependency_overrides[can_close_session] = serve_options.can_close_session
    app.dependency_overrides[can_view_session] = serve_options.can_view_session
    app.dependency_overrides[can_view_metrics] = serve_options.can_view_metrics

    app.include_router(foxi_router)
    app.include_router(base_router)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(serve_options.cors_allow_origins),
        allow_credentials=serve_options.cors_allow_credentials,
        allow_methods=list(serve_options.cors_allow_methods),
        allow_headers=list(serve_options.cors_allow_headers),
    )

    return app
