import { getLessonsByLanguageCode } from "@/data/lessons";
import type { LessonExchangeProgress } from "@/store/learning-progress-store";
import type { LanguageCode, Lesson } from "@/types/learning";

export type LessonVisualStatus = "completed" | "in_progress" | "locked";

export type LessonProgressSnapshot = {
  completedLessonIds: string[];
  lessonProgressPercent: Record<string, number>;
  lessonExchangeProgress: Record<string, LessonExchangeProgress>;
};

export function isLessonCompleted(
  lessonId: string,
  progress: LessonProgressSnapshot,
): boolean {
  return progress.completedLessonIds.includes(lessonId);
}

export function hasLessonStarted(
  lessonId: string,
  progress: LessonProgressSnapshot,
): boolean {
  if (isLessonCompleted(lessonId, progress)) {
    return false;
  }

  const percent = progress.lessonProgressPercent[lessonId] ?? 0;
  const exchanges =
    progress.lessonExchangeProgress[lessonId]?.completedExchanges ?? 0;

  return percent > 0 || exchanges > 0;
}

export function isLessonAccessible(
  lesson: Lesson,
  languageCode: LanguageCode,
  progress: LessonProgressSnapshot,
): boolean {
  const lessons = getLessonsByLanguageCode(languageCode);
  const lessonIndex = lessons.findIndex((item) => item.id === lesson.id);

  if (lessonIndex < 0) {
    return false;
  }

  if (lessonIndex === 0) {
    return true;
  }

  if (isLessonCompleted(lesson.id, progress)) {
    return true;
  }

  if (hasLessonStarted(lesson.id, progress)) {
    return true;
  }

  const previousLesson = lessons[lessonIndex - 1];
  return previousLesson
    ? isLessonCompleted(previousLesson.id, progress)
    : false;
}

export function getLessonVisualStatus(
  lesson: Lesson,
  languageCode: LanguageCode,
  progress: LessonProgressSnapshot,
): LessonVisualStatus {
  if (isLessonCompleted(lesson.id, progress)) {
    return "completed";
  }

  if (!isLessonAccessible(lesson, languageCode, progress)) {
    return "locked";
  }

  return "in_progress";
}

export function getInProgressLessonIds(
  languageCode: LanguageCode,
  progress: LessonProgressSnapshot,
): string[] {
  return getLessonsByLanguageCode(languageCode)
    .filter(
      (lesson) =>
        getLessonVisualStatus(lesson, languageCode, progress) === "in_progress",
    )
    .map((lesson) => lesson.id);
}
