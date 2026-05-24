import { getLanguageByCode } from "@/data/languages";
import { getLessonsByLanguageCode, getLessonsByUnitId } from "@/data/lessons";
import { getUnitsByLanguageCode } from "@/data/units";
import type { LanguageCode, Lesson, Unit } from "@/types/learning";

export type LessonVisualStatus = "completed" | "in_progress" | "locked";

export type LessonListItem = {
  lesson: Lesson;
  status: LessonVisualStatus;
  progressPercent: number;
};

export type QuickReviewItem = {
  id: string;
  lessonId: string;
  title: string;
  wordCount: number;
  progressPercent: number;
  completed: boolean;
  imageUrl: string;
};

export type LearnUnitSection = {
  unit: Unit;
  lessons: LessonListItem[];
  completedCount: number;
};

export type LearnScreenData = {
  languageName: string;
  unit: Unit;
  completedCount: number;
  totalCount: number;
  lessons: LessonListItem[];
  unitSections: LearnUnitSection[];
  quickReview: QuickReviewItem[];
};

const DEFAULT_IN_PROGRESS_PERCENT = 65;

function getEffectiveProgress(
  languageCode: LanguageCode,
  completedLessonIds: string[],
  lessonProgressPercent: Record<string, number>,
) {
  const languageLessons = getLessonsByLanguageCode(languageCode);
  const completedForLanguage = completedLessonIds.filter((id) =>
    languageLessons.some((lesson) => lesson.id === id),
  );

  if (completedForLanguage.length > 0) {
    return { completedLessonIds, lessonProgressPercent };
  }

  const unitOneLessons = getLessonsByUnitId(`${languageCode}-unit-1`);
  const mockCompletedIds = unitOneLessons.slice(0, 2).map((lesson) => lesson.id);
  const currentLessonId = unitOneLessons[2]?.id;

  return {
    completedLessonIds: [...completedLessonIds, ...mockCompletedIds],
    lessonProgressPercent: currentLessonId
      ? {
          ...lessonProgressPercent,
          [currentLessonId]:
            lessonProgressPercent[currentLessonId] ?? DEFAULT_IN_PROGRESS_PERCENT,
        }
      : lessonProgressPercent,
  };
}

function getActiveUnit(
  languageCode: LanguageCode,
  completedLessonIds: string[],
): Unit {
  const units = getUnitsByLanguageCode(languageCode);
  const allLessons = getLessonsByLanguageCode(languageCode);

  const nextLesson = allLessons.find(
    (lesson) => !completedLessonIds.includes(lesson.id),
  );

  if (nextLesson) {
    const unit = units.find((item) => item.id === nextLesson.unitId);
    if (unit) {
      return unit;
    }
  }

  return units[units.length - 1] ?? units[0]!;
}

function getLessonVisualStatus(
  lesson: Lesson,
  completedLessonIds: string[],
  currentLessonId: string | null,
): LessonVisualStatus {
  if (completedLessonIds.includes(lesson.id)) {
    return "completed";
  }

  if (lesson.id === currentLessonId) {
    return "in_progress";
  }

  return "locked";
}

function getCurrentLessonId(
  languageCode: LanguageCode,
  completedLessonIds: string[],
): string | null {
  const lessons = getLessonsByLanguageCode(languageCode);
  const nextLesson = lessons.find(
    (lesson) => !completedLessonIds.includes(lesson.id),
  );

  return nextLesson?.id ?? null;
}

function buildQuickReview(
  languageCode: LanguageCode,
  completedLessonIds: string[],
  lessonProgressPercent: Record<string, number>,
): QuickReviewItem[] {
  const lessons = getLessonsByLanguageCode(languageCode).slice(0, 5);

  return lessons.map((lesson) => {
    const completed = completedLessonIds.includes(lesson.id);
    const progressPercent = completed
      ? 100
      : (lessonProgressPercent[lesson.id] ?? 0);

    return {
      id: `review-${lesson.id}`,
      lessonId: lesson.id,
      title: lesson.title,
      wordCount: lesson.vocabulary.length,
      progressPercent,
      completed,
      imageUrl: lesson.imageUrl,
    };
  });
}

export function getLearnScreenData(
  languageCode: LanguageCode,
  progress: {
    completedLessonIds: string[];
    lessonProgressPercent: Record<string, number>;
  },
): LearnScreenData | null {
  const language = getLanguageByCode(languageCode);
  if (!language) {
    return null;
  }

  const effectiveProgress = getEffectiveProgress(
    languageCode,
    progress.completedLessonIds,
    progress.lessonProgressPercent,
  );

  const unit = getActiveUnit(languageCode, effectiveProgress.completedLessonIds);
  const unitLessons = getLessonsByUnitId(unit.id);
  const allLessons = getLessonsByLanguageCode(languageCode);
  const currentLessonId = getCurrentLessonId(
    languageCode,
    effectiveProgress.completedLessonIds,
  );

  const buildLessonListItem = (lesson: Lesson): LessonListItem => ({
    lesson,
    status: getLessonVisualStatus(
      lesson,
      effectiveProgress.completedLessonIds,
      currentLessonId,
    ),
    progressPercent: effectiveProgress.completedLessonIds.includes(lesson.id)
      ? 100
      : (effectiveProgress.lessonProgressPercent[lesson.id] ?? 0),
  });

  const lessons: LessonListItem[] = unitLessons.map(buildLessonListItem);

  const completedCount = effectiveProgress.completedLessonIds.filter((id) =>
    allLessons.some((lesson) => lesson.id === id),
  ).length;

  const units = getUnitsByLanguageCode(languageCode);
  const unitSections: LearnUnitSection[] = units.map((unitItem) => {
    const sectionLessons = getLessonsByUnitId(unitItem.id).map(buildLessonListItem);
    const sectionCompletedCount = sectionLessons.filter(
      (item) => item.status === "completed",
    ).length;

    return {
      unit: unitItem,
      lessons: sectionLessons,
      completedCount: sectionCompletedCount,
    };
  });

  return {
    languageName: language.name,
    unit,
    completedCount,
    totalCount: allLessons.length,
    lessons,
    unitSections,
    quickReview: buildQuickReview(
      languageCode,
      effectiveProgress.completedLessonIds,
      effectiveProgress.lessonProgressPercent,
    ),
  };
}
