from __future__ import annotations

from dataclasses import dataclass
from typing import Any

LANGUAGE_NAMES: dict[str, str] = {
    "es": "Spanish",
    "fr": "French",
    "ja": "Japanese",
}


@dataclass(frozen=True)
class LessonVocabularyItem:
    word: str
    translation: str


@dataclass(frozen=True)
class LessonPhraseItem:
    text: str
    translation: str


@dataclass(frozen=True)
class LessonContext:
    language_code: str = "es"
    language_name: str = "Spanish"
    lesson_title: str = "Today's lesson"
    lesson_goal: str = "Practice beginner phrases."
    lesson_id: str | None = None
    goals: tuple[str, ...] = ()
    vocabulary: tuple[LessonVocabularyItem, ...] = ()
    phrases: tuple[LessonPhraseItem, ...] = ()
    ai_teacher_prompt: str | None = None
    opening_line: str | None = None

    @classmethod
    def from_call_custom(cls, custom: dict[str, Any] | None) -> LessonContext:
        if not custom:
            return cls()

        language_code = str(custom.get("languageCode") or "es")
        language_name = LANGUAGE_NAMES.get(language_code, language_code)

        goals = tuple(
            str(goal)
            for goal in (custom.get("goals") or [])
            if isinstance(goal, str) and goal.strip()
        )

        vocabulary: list[LessonVocabularyItem] = []
        for item in custom.get("vocabulary") or []:
            if not isinstance(item, dict):
                continue
            word = str(item.get("word") or "").strip()
            translation = str(item.get("translation") or "").strip()
            if word and translation:
                vocabulary.append(LessonVocabularyItem(word=word, translation=translation))

        phrases: list[LessonPhraseItem] = []
        for item in custom.get("phrases") or []:
            if not isinstance(item, dict):
                continue
            text = str(item.get("text") or "").strip()
            translation = str(item.get("translation") or "").strip()
            if text and translation:
                phrases.append(LessonPhraseItem(text=text, translation=translation))

        return cls(
            language_code=language_code,
            language_name=language_name,
            lesson_title=str(custom.get("lessonTitle") or "Today's lesson"),
            lesson_goal=str(custom.get("lessonGoal") or "Practice beginner phrases."),
            lesson_id=(
                str(custom["lessonId"]) if custom.get("lessonId") is not None else None
            ),
            goals=goals,
            vocabulary=tuple(vocabulary),
            phrases=tuple(phrases),
            ai_teacher_prompt=(
                str(custom["aiTeacherPrompt"])
                if custom.get("aiTeacherPrompt")
                else None
            ),
            opening_line=(
                str(custom["openingLine"]).strip()
                if custom.get("openingLine")
                else None
            ),
        )


def _format_vocabulary(context: LessonContext) -> str:
    if not context.vocabulary:
        return "Use only lesson-appropriate beginner vocabulary."

    pairs = [
        f"{item.word} ({item.translation})" for item in context.vocabulary
    ]
    return "Focus on these vocabulary words: " + ", ".join(pairs) + "."


def _format_phrases(context: LessonContext) -> str:
    if not context.phrases:
        return "Introduce short lesson phrases with English translations."

    pairs = [f"{item.text} = {item.translation}" for item in context.phrases]
    return "Practice these phrases: " + " | ".join(pairs) + "."


def _format_goals(context: LessonContext) -> str:
    if not context.goals:
        return context.lesson_goal

    return "; ".join(context.goals)


def build_teacher_instructions(context: LessonContext) -> str:
    """English-speaking tutor that teaches the target language through English."""
    extra = ""
    if context.ai_teacher_prompt:
        extra = f"\n\nLesson-specific guidance:\n{context.ai_teacher_prompt}"

    opening_rule = ""
    if context.opening_line:
        opening_rule = (
            f'\n- Your very first spoken message must be exactly this, word for word: '
            f'"{context.opening_line}"'
        )

    return f"""You are Foxi, a warm and encouraging AI language teacher in a live audio lesson.

Always speak in English. Teach {context.language_name} to a beginner by explaining in English and introducing {context.language_name} words or short phrases with clear English translations.

Today's lesson: "{context.lesson_title}"
Lesson goal: {_format_goals(context)}
{_format_vocabulary(context)}
{_format_phrases(context)}

Rules:
- Keep replies to one or two short, conversational sentences.
- Use natural contractions and a friendly tone.
- Stay on today's lesson only; do not switch topics or languages.
- Invite the student to repeat key words or try a short phrase.
- If the student says the wrong word or phrase, calmly correct them and ask them to try again. Do not praise incorrect answers or move on until they say the target phrase correctly.
- For a correct attempt, use a brief neutral acknowledgment (for example: "That's right", "Good", "Okay") and move on. Do not use enthusiastic praise during practice.
- Reserve warmer congratulations for the final closing message only, after the last phrase is correct.
- After the student successfully practices the last phrase for this lesson, give a brief closing message: congratulate them, name one thing they did well, and say the lesson is complete. Do not ask another practice question after that.
- Do not use markdown, bullet lists, or special formatting in speech.{opening_rule}{extra}"""


def build_verbatim_opening_prompt(opening_line: str) -> str:
    """Prompt the Realtime model to speak a scripted lesson opening exactly."""
    return (
        "Begin the lesson now. Say the following opening message to the student "
        "exactly as written. Do not add, remove, or rephrase any words:\n"
        f'"{opening_line}"'
    )


def build_opening_line(context: LessonContext) -> str:
    first_phrase = context.phrases[0].text if context.phrases else None
    phrase_hint = (
        f" Mention the phrase {first_phrase} and invite them to try it."
        if first_phrase
        else f" Invite them to try their first {context.language_name} greeting."
    )

    return (
        f"Greet the student in English, name today's lesson ({context.lesson_title}),"
        f" and explain the goal in one sentence.{phrase_hint}"
    )
