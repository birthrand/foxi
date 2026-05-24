from __future__ import annotations

from typing import Any

_pending_by_call_id: dict[str, dict[str, Any]] = {}


def set_pending_lesson_custom(call_id: str, custom: dict[str, Any]) -> None:
    if custom:
        _pending_by_call_id[call_id] = custom


def pop_pending_lesson_custom(call_id: str) -> dict[str, Any]:
    return _pending_by_call_id.pop(call_id, None) or {}
