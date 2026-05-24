from foxi_teacher.agent import _parse_call_id_context


def test_parse_call_id_with_hyphenated_lesson_id() -> None:
    call_id = "foxi-v2-fr-fr-lesson-4-user_3E8GW93UpE7CZR9fNlFzNBrndBe"
    context = _parse_call_id_context(call_id)

    assert context["languageCode"] == "fr"
    assert context["lessonId"] == "fr-lesson-4"
    assert context["lessonTitle"] == "Fr Lesson 4"


def test_parse_call_id_with_simple_lesson_id() -> None:
    call_id = "foxi-v2-es-es-lesson-1-clerk_user_abc"
    context = _parse_call_id_context(call_id)

    assert context["languageCode"] == "es"
    assert context["lessonId"] == "es-lesson-1"


def test_parse_call_id_rejects_invalid_prefix() -> None:
    assert _parse_call_id_context("foxi-v1-es-es-lesson-1-user") == {}
