import { getLanguageByCode } from "@/data/languages";
import {
  getFirstLessonForLanguage,
  getLessonsByLanguageCode,
  getLessonsByUnitId,
} from "@/data/lessons";
import { getUnitById } from "@/data/units";
import type { LanguageCode, Lesson } from "@/types/learning";

export type FocusPlanType = "lesson" | "ai-conversation" | "new-words";

export type FocusItem = {
  id: string;
  category: string;
  topic: string;
  planType: FocusPlanType;
  completed: boolean;
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

const DEFAULT_LESSON_PROGRESS = 65;

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
  const nextLesson = lessons.find(
    (lesson) => !completedLessonIds.includes(lesson.id),
  );

  return (
    nextLesson ??
    lessons[lessons.length - 1] ??
    getFirstLessonForLanguage(languageCode)!
  );
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

function buildTodaysPlan(lesson: Lesson, progressPercent: number): FocusItem[] {
  const conversationActivity =
    lesson.activities.find(
      (activity) =>
        activity.type === "conversation" || activity.type === "speaking",
    ) ?? lesson.activities.find((activity) => activity.type === "listening");

  return [
    {
      id: `${lesson.id}-plan-lesson`,
      category: "Lesson",
      topic: lesson.subtitle,
      planType: "lesson",
      completed: progressPercent >= 40,
    },
    {
      id: `${lesson.id}-plan-conversation`,
      category: "AI Conversation",
      topic: conversationActivity?.title ?? "Talk about your day",
      planType: "ai-conversation",
      completed: progressPercent >= 80,
    },
    {
      id: `${lesson.id}-plan-words`,
      category: "New words",
      topic: `${lesson.vocabulary.length} words`,
      planType: "new-words",
      completed: progressPercent >= 100,
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
  const progressPercent =
    progress.lessonProgressPercent[currentLesson.id] ?? DEFAULT_LESSON_PROGRESS;
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
    todaysFocus: buildTodaysPlan(currentLesson, progressPercent),
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
