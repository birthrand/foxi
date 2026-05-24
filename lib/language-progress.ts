import {
  getFirstLessonForLanguage,
  getLessonWithLanguage,
  getLessonsByLanguageCode,
} from "@/data/lessons";
import type { LanguageCode, LessonWithLanguage } from "@/types/learning";

export function getCompletedLessonIdsForLanguage(
  languageCode: LanguageCode,
  completedLessonIds: string[],
): string[] {
  const languageLessonIds = new Set(
    getLessonsByLanguageCode(languageCode).map((lesson) => lesson.id),
  );

  return completedLessonIds.filter((id) => languageLessonIds.has(id));
}

export function getLessonProgressForLanguage(
  languageCode: LanguageCode,
  lessonProgressPercent: Record<string, number>,
): Record<string, number> {
  const languageLessonIds = new Set(
    getLessonsByLanguageCode(languageCode).map((lesson) => lesson.id),
  );

  return Object.fromEntries(
    Object.entries(lessonProgressPercent).filter(([lessonId]) =>
      languageLessonIds.has(lessonId),
    ),
  );
}

export function getLessonExchangeProgressForLanguage(
  languageCode: LanguageCode,
  lessonExchangeProgress: Record<
    string,
    { completedExchanges: number; totalExchanges: number }
  >,
) {
  const languageLessonIds = new Set(
    getLessonsByLanguageCode(languageCode).map((lesson) => lesson.id),
  );

  return Object.fromEntries(
    Object.entries(lessonExchangeProgress).filter(([lessonId]) =>
      languageLessonIds.has(lessonId),
    ),
  );
}

export function getEffectiveProgressForLanguage(
  languageCode: LanguageCode,
  completedLessonIds: string[],
  lessonProgressPercent: Record<string, number>,
  lessonExchangeProgress: Record<
    string,
    { completedExchanges: number; totalExchanges: number }
  > = {},
) {
  return {
    completedLessonIds: getCompletedLessonIdsForLanguage(
      languageCode,
      completedLessonIds,
    ),
    lessonProgressPercent: getLessonProgressForLanguage(
      languageCode,
      lessonProgressPercent,
    ),
    lessonExchangeProgress: getLessonExchangeProgressForLanguage(
      languageCode,
      lessonExchangeProgress,
    ),
  };
}

export function getNextLessonInPath(
  languageCode: LanguageCode,
  currentLessonId: string,
): string | null {
  const lessons = getLessonsByLanguageCode(languageCode);
  const currentIndex = lessons.findIndex((item) => item.id === currentLessonId);

  if (currentIndex < 0 || currentIndex >= lessons.length - 1) {
    return null;
  }

  return lessons[currentIndex + 1]?.id ?? null;
}

export function getCurrentLessonIdForLanguage(
  languageCode: LanguageCode,
  completedLessonIds: string[],
): string | null {
  const scopedCompleted = getCompletedLessonIdsForLanguage(
    languageCode,
    completedLessonIds,
  );
  const lessons = getLessonsByLanguageCode(languageCode);
  const nextLesson = lessons.find(
    (lesson) => !scopedCompleted.includes(lesson.id),
  );

  return nextLesson?.id ?? null;
}

export function resolveLessonForLanguage(
  lessonId: string,
  languageCode: LanguageCode,
): LessonWithLanguage | undefined {
  const requestedLesson = getLessonWithLanguage(lessonId);

  if (requestedLesson?.languageCode === languageCode) {
    return requestedLesson;
  }

  const firstLesson = getFirstLessonForLanguage(languageCode);
  return firstLesson ? getLessonWithLanguage(firstLesson.id) : undefined;
}
