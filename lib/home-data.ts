import { getLanguageByCode } from "@/data/languages";
import { getLessonsByLanguageCode, getLessonsByUnitId } from "@/data/lessons";
import { getUnitById } from "@/data/units";
import {
  getCompletedLessonIdsForLanguage,
  getLessonProgressForLanguage,
} from "@/lib/language-progress";
import type { LanguageCode, Lesson } from "@/types/learning";

export type FocusPlanType = "lesson" | "ai-conversation" | "new-words";

export type FocusItem = {
  id: string;
  lessonId: string;
  category: string;
  headline: string;
  subtitle: string;
  planType: FocusPlanType;
  completed: boolean;
  progressPercent: number;
  wordChips?: string[];
};

export type ContinueLearningItem = {
  lesson: Lesson;
  languageName: string;
  unitTitle: string;
  levelLabel: string;
  progressPercent: number;
  minutesLeft: number;
};

export type RecentVocabularyItem = {
  id: string;
  word: string;
  translation: string;
};

export type HomeStats = {
  dailyMinutesStudied: number;
  dailyGoalMinutes: number;
  streakDays: number;
};

const DEFAULT_LESSON_PROGRESS = 0;

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

function getMinutesLeft(lesson: Lesson, progressPercent: number): number {
  const remainingRatio = 1 - progressPercent / 100;
  return Math.max(1, Math.ceil(lesson.estimatedMinutes * remainingRatio));
}

function getCurrentLesson(
  languageCode: LanguageCode,
  completedLessonIds: string[],
): Lesson {
  const lessons = getLessonsByLanguageCode(languageCode);
  const completedForLanguage = getCompletedLessonIdsForLanguage(
    languageCode,
    completedLessonIds,
  );
  const nextLesson = lessons.find(
    (lesson) => !completedForLanguage.includes(lesson.id),
  );

  return nextLesson ?? lessons[lessons.length - 1]!;
}

function getRecentVocabulary(
  currentLesson: Lesson,
  languageCode: LanguageCode,
) {
  const lessons = getLessonsByLanguageCode(languageCode);
  const currentIndex = lessons.findIndex(
    (lesson) => lesson.id === currentLesson.id,
  );
  const vocabulary = [...currentLesson.vocabulary];

  if (vocabulary.length < 3 && currentIndex > 0) {
    const previousLessons = lessons.slice(0, currentIndex).reverse();

    for (const lesson of previousLessons) {
      vocabulary.unshift(...lesson.vocabulary);

      if (vocabulary.length >= 3) {
        break;
      }
    }
  }

  return vocabulary.slice(-3).map((item) => ({
    id: item.id,
    word: item.word,
    translation: item.translation,
  }));
}

function getPlanSegmentProgress(
  overallPercent: number,
  segmentStart: number,
  segmentEnd: number,
): number {
  if (overallPercent <= segmentStart) {
    return 0;
  }

  if (overallPercent >= segmentEnd) {
    return 100;
  }

  return Math.round(
    ((overallPercent - segmentStart) / (segmentEnd - segmentStart)) * 100,
  );
}

function buildTodaysPlan(
  lesson: Lesson,
  progressPercent: number,
  unitNumber: number,
): FocusItem[] {
  const conversationActivity =
    lesson.activities.find(
      (activity) =>
        activity.type === "conversation" || activity.type === "speaking",
    ) ?? lesson.activities.find((activity) => activity.type === "listening");

  const wordChips = lesson.vocabulary.slice(0, 3).map((item) => item.word);

  return [
    {
      id: `${lesson.id}-plan-lesson`,
      lessonId: lesson.id,
      category: "Lesson",
      headline: lesson.title,
      subtitle: `Unit ${unitNumber} • ${lesson.estimatedMinutes} min`,
      planType: "lesson",
      completed: progressPercent >= 40,
      progressPercent: getPlanSegmentProgress(progressPercent, 0, 40),
    },
    {
      id: `${lesson.id}-plan-conversation`,
      lessonId: lesson.id,
      category: "AI Conversation",
      headline: conversationActivity?.title ?? "Talk about your day",
      subtitle: "Speaking practice • Live tutor",
      planType: "ai-conversation",
      completed: progressPercent >= 80,
      progressPercent: getPlanSegmentProgress(progressPercent, 40, 80),
    },
    {
      id: `${lesson.id}-plan-words`,
      lessonId: lesson.id,
      category: "New words",
      headline: `${lesson.vocabulary.length} words`,
      subtitle: "Vocabulary review",
      planType: "new-words",
      completed: progressPercent >= 100,
      progressPercent: getPlanSegmentProgress(progressPercent, 80, 100),
      wordChips,
    },
  ];
}

export function getGreetingForTime(date = new Date()): string {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function getHomeScreenData(
  languageCode: LanguageCode,
  progress: {
    completedLessonIds: string[];
    lessonProgressPercent: Record<string, number>;
    dailyMinutesStudied: number;
    dailyGoalMinutes: number;
    streakDays: number;
  },
) {
  const language = getLanguageByCode(languageCode);
  const currentLesson = getCurrentLesson(
    languageCode,
    progress.completedLessonIds,
  );
  const currentUnit = getUnitById(currentLesson.unitId);
  const progressForLanguage = getLessonProgressForLanguage(
    languageCode,
    progress.lessonProgressPercent,
  );
  const progressPercent =
    progressForLanguage[currentLesson.id] ?? DEFAULT_LESSON_PROGRESS;
  const recentVocabulary = getRecentVocabulary(currentLesson, languageCode);

  const continueLearning: ContinueLearningItem = {
    lesson: currentLesson,
    languageName: language?.name ?? "Language",
    unitTitle: currentUnit?.title ?? currentLesson.subtitle,
    levelLabel: getLevelLabel(currentUnit?.number ?? 1),
    progressPercent,
    minutesLeft: getMinutesLeft(currentLesson, progressPercent),
  };

  const stats: HomeStats = {
    dailyMinutesStudied: progress.dailyMinutesStudied,
    dailyGoalMinutes: progress.dailyGoalMinutes,
    streakDays: progress.streakDays,
  };

  return {
    language,
    continueLearning,
    todaysFocus: buildTodaysPlan(
      currentLesson,
      progressPercent,
      currentUnit?.number ?? 1,
    ),
    recentVocabulary,
    stats,
  };
}

export function getLanguageSubtitle(languageCode: LanguageCode): string {
  const language = getLanguageByCode(languageCode);
  if (!language) {
    return "Let's keep your language journey going";
  }

  const firstUnitLessons = getLessonsByUnitId(`${languageCode}-unit-1`);
  const lessonCount = getLessonsByLanguageCode(languageCode).length;

  if (firstUnitLessons.length > 0) {
    return `Let's keep your ${language.name} journey going`;
  }

  return `${language.nativeName} · ${lessonCount} lessons ready for you.`;
}
