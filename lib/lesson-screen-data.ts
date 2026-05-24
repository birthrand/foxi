import { getUnitById } from "@/data/units";
import type { Lesson, LessonWithLanguage, VocabularyItem } from "@/types/learning";

export type LessonStep = {
  id: string;
  text: string;
  translation: string;
  phonetic?: string;
  instruction: string;
};

export type LessonScreenData = {
  headerTitle: string;
  steps: LessonStep[];
  todaysWords: VocabularyItem[];
  totalSteps: number;
};

function getLevelLabel(unitNumber: number): string {
  if (unitNumber <= 1) {
    return "A1";
  }

  if (unitNumber === 2) {
    return "A2";
  }

  if (unitNumber === 3) {
    return "B1";
  }

  return `B${unitNumber - 2}`;
}

function getLessonTopicLabel(lesson: Lesson): string {
  const words = lesson.subtitle.trim().split(/\s+/);
  const lastWord = words[words.length - 1] ?? lesson.title;

  return lastWord.charAt(0).toUpperCase() + lastWord.slice(1);
}

function buildLessonSteps(lesson: Lesson): LessonStep[] {
  const vocabularySteps = lesson.vocabulary.map((item) => ({
    id: item.id,
    text: item.word,
    translation: item.translation,
    phonetic: item.phonetic,
    instruction: "Listen and repeat",
  }));

  const phraseSteps = lesson.phrases.map((item) => ({
    id: item.id,
    text: item.text,
    translation: item.translation,
    instruction: "Listen and repeat",
  }));

  return [...vocabularySteps, ...phraseSteps];
}

export function getLessonScreenData(
  lesson: LessonWithLanguage,
): LessonScreenData {
  const unit = getUnitById(lesson.unitId);
  const levelLabel = getLevelLabel(unit?.number ?? 1);
  const topicLabel = getLessonTopicLabel(lesson);
  const steps = buildLessonSteps(lesson);

  return {
    headerTitle: `${levelLabel} • ${topicLabel}`,
    steps,
    todaysWords: [...lesson.vocabulary],
    totalSteps: steps.length,
  };
}

export function formatPhonetic(phonetic?: string): string | undefined {
  if (!phonetic) {
    return undefined;
  }

  return phonetic.replace(/-/g, "").toLowerCase();
}
