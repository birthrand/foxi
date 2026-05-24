from foxi_teacher.instructions import (
    LessonContext,
    build_teacher_instructions,
    build_verbatim_opening_prompt,
)


def test_build_verbatim_opening_prompt_includes_script() -> None:
    opening = "Hey! Ready to learn your first Spanish greetings?"
    prompt = build_verbatim_opening_prompt(opening)

    assert opening in prompt
    assert "exactly as written" in prompt


def test_build_teacher_instructions_includes_opening_rule() -> None:
    context = LessonContext(
        opening_line="Hey! Ready to learn your first Spanish greetings?",
    )
    instructions = build_teacher_instructions(context)

    assert "Your very first spoken message must be exactly this" in instructions
    assert context.opening_line in instructions
