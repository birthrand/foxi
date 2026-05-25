import asyncio
import logging
from typing import Any

from vision_agents.core import Agent, User
from vision_agents.core.instructions import Instructions
from vision_agents.plugins import getstream, openai

from foxi_teacher.instructions import (
    LessonContext,
    build_opening_line,
    build_teacher_instructions,
    build_verbatim_opening_prompt,
)
from foxi_teacher.lesson_context_store import pop_pending_lesson_custom

logger = logging.getLogger(__name__)

FOXI_AGENT_USER_ID = "foxi-ai-teacher"
FOXI_AGENT_NAME = "Foxi"


def _normalize_custom(custom: Any) -> dict[str, Any]:
    if custom is None:
        return {}

    if isinstance(custom, dict):
        return custom

    if hasattr(custom, "model_dump"):
        return custom.model_dump()

    if hasattr(custom, "to_dict"):
        return custom.to_dict()

    return dict(custom)


async def _read_call_custom_once(call: Any) -> dict[str, Any]:
    """Read Stream call custom data set by the Expo app when the call was created."""
    try:
        response = await call.get()
    except Exception:
        logger.exception("Could not load call metadata")
        return {}

    envelope = getattr(response, "data", None)
    call_data = getattr(envelope, "call", None) if envelope is not None else None

    if call_data is None:
        call_data = getattr(response, "call", None)

    if call_data is None:
        return {}

    return _normalize_custom(getattr(call_data, "custom", None))


def _parse_call_id_context(call_id: str) -> dict[str, Any]:
    """Fallback when Stream custom is missing (call id: foxi-v2-{lang}-{lessonId}-{userId})."""
    parts = call_id.split("-")
    if len(parts) < 6 or parts[0] != "foxi" or parts[1] != "v2":
        return {}

    language_code = parts[2]
    lesson_id = "-".join(parts[3:-1])
    if not lesson_id:
        return {}

    return {
        "languageCode": language_code,
        "lessonId": lesson_id,
        "lessonTitle": lesson_id.replace("-", " ").title(),
        "lessonGoal": "Practice beginner phrases.",
        "app": "foxi",
    }


def _has_lesson_context(custom: dict[str, Any]) -> bool:
    return bool(custom.get("languageCode"))


def _apply_agent_instructions(agent: Agent, context: LessonContext) -> None:
    """Sync instructions on the agent and LLM before Realtime connects."""
    text = build_teacher_instructions(context)
    agent.instructions = Instructions(input_text=text)
    agent.llm.set_instructions(agent.instructions)


async def _read_call_custom(call: Any, call_id: str) -> dict[str, Any]:
    """Load lesson custom data, retrying if the mobile app is still creating the call."""
    pending = pop_pending_lesson_custom(call_id)
    if pending.get("languageCode") and pending.get("lessonTitle"):
        logger.info(
            "Using lesson context from start request for call %s (%s)",
            call_id,
            pending.get("languageCode"),
        )
        return pending

    last_custom: dict[str, Any] = {}
    max_attempts = 20

    for attempt in range(max_attempts):
        last_custom = await _read_call_custom_once(call)
        if last_custom.get("languageCode") and last_custom.get("lessonTitle"):
            logger.info(
                "Loaded lesson context from Stream for call %s (%s)",
                call_id,
                last_custom.get("languageCode"),
            )
            return last_custom

        if attempt < max_attempts - 1:
            await asyncio.sleep(0.5)

    fallback = _parse_call_id_context(call_id)
    if fallback:
        logger.warning(
            "Stream custom missing for %s; using language from call id (%s)",
            call_id,
            fallback.get("languageCode"),
        )
        return {**fallback, **{k: v for k, v in last_custom.items() if v}}

    return last_custom


def _resolve_lesson_from_custom(
    custom: dict[str, Any], call_id: str
) -> tuple[LessonContext, str]:
    if _has_lesson_context(custom):
        context = LessonContext.from_call_custom(custom)
        opening_line = context.opening_line or ""
        opening = (
            build_verbatim_opening_prompt(opening_line)
            if opening_line
            else build_opening_line(context)
        )
        logger.info(
            "Lesson context for call %s: %s (%s) with %d vocabulary and %d phrases",
            call_id,
            context.lesson_title,
            context.language_name,
            len(context.vocabulary),
            len(context.phrases),
        )
        return context, opening

    context = LessonContext()
    logger.warning(
        "No lesson context for %s; using default Spanish lesson", call_id
    )
    return context, build_opening_line(context)


def _get_existing_call(agent: Agent, call_type: str, call_id: str) -> Any:
    """Reference an existing call without get_or_create (which would wipe lesson custom data)."""
    edge = agent.edge
    client = getattr(edge, "client", None)

    if client is not None and hasattr(client, "video"):
        return client.video.call(call_type, call_id)

    raise RuntimeError("Stream edge client is not available")


async def create_agent(**kwargs) -> Agent:
    context: LessonContext = kwargs.get("lesson_context") or LessonContext()
    instructions = build_teacher_instructions(context)

    return Agent(
        edge=getstream.Edge(),
        agent_user=User(name=FOXI_AGENT_NAME, id=FOXI_AGENT_USER_ID),
        instructions=instructions,
        processors=[],
        llm=openai.Realtime(send_video=False),
    )


async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs) -> None:
    # Authenticate first so we can read Stream call metadata, but load lesson context
    # before agent.join() — join() calls llm.connect() which bakes instructions into
    # the OpenAI Realtime session at connect time.
    await agent.authenticate()

    call = _get_existing_call(agent, call_type, call_id)
    custom = await _read_call_custom(call, call_id)
    context, opening = _resolve_lesson_from_custom(custom, call_id)
    _apply_agent_instructions(agent, context)

    async with agent.join(call):
        await agent.simple_response(opening)
        await agent.finish()
