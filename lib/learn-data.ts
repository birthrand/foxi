import { getLanguageByCode } from "@/data/languages";
import { getLessonsByLanguageCode, getLessonsByUnitId } from "@/data/lessons";
import { getUnitsByLanguageCode } from "@/data/units";
import { getEffectiveProgressForLanguage } from "@/lib/language-progress";
import {
  getLessonVisualStatus,
  isLessonCompleted,
  type LessonProgressSnapshot,
  type LessonVisualStatus,
} from "@/lib/lesson-access";
import { getTotalConversationExchanges } from "@/lib/lesson-screen-data";
import type { LanguageCode, Lesson, Unit } from "@/types/learning";
import type { LessonExchangeProgress } from "@/store/learning-progress-store";

export type { LessonVisualStatus };

export type LessonListItem = {
  lesson: Lesson;
  status: LessonVisualStatus;
  progressPercent: number;
  completedExchanges: number;
  totalExchanges: number;
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

function getExchangeCountsForLesson(
  lesson: Lesson,
  languageName: string,
  progress: LessonProgressSnapshot,
): { completedExchanges: number; totalExchanges: number } {
  const totalExchanges = getTotalConversationExchanges(lesson, languageName);

  if (isLessonCompleted(lesson.id, progress)) {
    return { completedExchanges: totalExchanges, totalExchanges };
  }

  const saved = progress.lessonExchangeProgress[lesson.id];
  if (saved) {
    return {
      completedExchanges: Math.min(saved.completedExchanges, totalExchanges),
      totalExchanges,
    };
  }

  return { completedExchanges: 0, totalExchanges };
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
    lessonExchangeProgress: Record<string, LessonExchangeProgress>;
  },
): LearnScreenData | null {
  const language = getLanguageByCode(languageCode);
  if (!language) {
    return null;
  }

  const effectiveProgress = getEffectiveProgressForLanguage(
    languageCode,
    progress.completedLessonIds,
    progress.lessonProgressPercent,
    progress.lessonExchangeProgress,
  );

  const unit = getActiveUnit(languageCode, effectiveProgress.completedLessonIds);
  const unitLessons = getLessonsByUnitId(unit.id);
  const allLessons = getLessonsByLanguageCode(languageCode);

  const progressSnapshot: LessonProgressSnapshot = {
    completedLessonIds: effectiveProgress.completedLessonIds,
    lessonProgressPercent: effectiveProgress.lessonProgressPercent,
    lessonExchangeProgress: effectiveProgress.lessonExchangeProgress,
  };

  const buildLessonListItem = (lesson: Lesson): LessonListItem => {
    const exchangeCounts = getExchangeCountsForLesson(
      lesson,
      language.name,
      progressSnapshot,
    );

    return {
      lesson,
      status: getLessonVisualStatus(lesson, languageCode, progressSnapshot),
      progressPercent: isLessonCompleted(lesson.id, progressSnapshot)
        ? 100
        : (effectiveProgress.lessonProgressPercent[lesson.id] ?? 0),
      completedExchanges: exchangeCounts.completedExchanges,
      totalExchanges: exchangeCounts.totalExchanges,
    };
  };

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
