import { getLanguageByCode } from "@/data/languages";
import {
  getLessonsByLanguageCode,
  getLessonsByUnitId,
} from "@/data/lessons";
import { getUnitsByLanguageCode } from "@/data/units";
import { getEffectiveProgressForLanguage } from "@/lib/language-progress";
import type { Language, LanguageCode } from "@/types/learning";

export type ProfileStatCard = {
  id: string;
  icon: "flame" | "time" | "star" | "book";
  value: string;
  label: string;
  sublabel: string;
};

export type ProfileMenuItem = {
  id: string;
  icon: "flag" | "bookmark" | "trophy" | "notifications" | "settings";
  title: string;
  subtitle: string;
};

export type ProfileLevelInfo = {
  levelTitle: string;
  levelCode: string;
  description: string;
  progressPercent: number;
  xpToNextLabel: string;
};

export type ProfileScreenData = {
  language: Language;
  learningLabel: string;
  motivationalMessage: string;
  stats: ProfileStatCard[];
  level: ProfileLevelInfo;
  menuItems: ProfileMenuItem[];
  lessonsCompleted: number;
  totalLessons: number;
};

const LEVEL_TITLES: Record<number, string> = {
  1: "Beginner A1",
  2: "Elementary A2",
  3: "Intermediate B1",
};

const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: "You're building a strong foundation.",
  2: "You're growing everyday confidence.",
  3: "You're connecting ideas with ease.",
};

function getLevelCode(unitNumber: number): string {
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

function formatStudyTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

function formatXp(value: number): string {
  return value.toLocaleString("en-US");
}

function getTotalStudyMinutes(
  languageCode: LanguageCode,
  completedLessonIds: string[],
  lessonProgressPercent: Record<string, number>,
): number {
  return getLessonsByLanguageCode(languageCode).reduce((total, lesson) => {
    if (completedLessonIds.includes(lesson.id)) {
      return total + lesson.estimatedMinutes;
    }

    const progress = lessonProgressPercent[lesson.id] ?? 0;
    if (progress > 0) {
      return total + Math.round((lesson.estimatedMinutes * progress) / 100);
    }

    return total;
  }, 0);
}

function getTotalXp(
  languageCode: LanguageCode,
  completedLessonIds: string[],
  lessonProgressPercent: Record<string, number>,
): number {
  return getLessonsByLanguageCode(languageCode).reduce((total, lesson) => {
    if (completedLessonIds.includes(lesson.id)) {
      return total + lesson.xpReward;
    }

    const progress = lessonProgressPercent[lesson.id] ?? 0;
    if (progress > 0) {
      return total + Math.round((lesson.xpReward * progress) / 100);
    }

    return total;
  }, 0);
}

function getActiveUnitNumber(
  languageCode: LanguageCode,
  completedLessonIds: string[],
): number {
  const lessons = getLessonsByLanguageCode(languageCode);
  const nextLesson = lessons.find(
    (lesson) => !completedLessonIds.includes(lesson.id),
  );

  if (!nextLesson) {
    const units = getUnitsByLanguageCode(languageCode);
    return units[units.length - 1]?.number ?? 1;
  }

  const unit = getUnitsByLanguageCode(languageCode).find(
    (item) => item.id === nextLesson.unitId,
  );

  return unit?.number ?? 1;
}

function getUnitProgressPercent(
  unitId: string,
  completedLessonIds: string[],
  lessonProgressPercent: Record<string, number>,
): number {
  const unitLessons = getLessonsByUnitId(unitId);

  if (unitLessons.length === 0) {
    return 0;
  }

  const progressSum = unitLessons.reduce((sum, lesson) => {
    if (completedLessonIds.includes(lesson.id)) {
      return sum + 100;
    }

    return sum + (lessonProgressPercent[lesson.id] ?? 0);
  }, 0);

  return Math.round(progressSum / unitLessons.length);
}

function getXpToNextLevelLabel(
  languageCode: LanguageCode,
  unitNumber: number,
  currentXp: number,
): string {
  const units = getUnitsByLanguageCode(languageCode);
  const nextUnit = units.find((unit) => unit.number === unitNumber + 1);

  if (!nextUnit) {
    return "Max level reached";
  }

  const nextUnitLessons = getLessonsByUnitId(nextUnit.id);
  const nextLevelXp = nextUnitLessons.reduce(
    (total, lesson) => total + lesson.xpReward,
    0,
  );
  const remainingXp = Math.max(0, nextLevelXp - (currentXp % nextLevelXp));

  return `To ${getLevelCode(nextUnit.number)}: ${formatXp(remainingXp)} XP`;
}

function getMotivationalMessage(streakDays: number): string {
  if (streakDays >= 7) {
    return "Every day, a little better. You're doing great! 🧡";
  }

  if (streakDays >= 3) {
    return "Nice momentum — keep showing up! 🧡";
  }

  return "Small steps add up. You've got this! 🧡";
}

export function getProfileDisplayName(
  firstName: string | null | undefined,
  fullName: string | null | undefined,
  username: string | null | undefined,
): string {
  if (username?.trim()) {
    return username.trim();
  }

  if (firstName?.trim()) {
    return firstName.trim();
  }

  if (fullName?.trim()) {
    return fullName.trim().split(" ")[0] ?? fullName.trim();
  }

  return "Learner";
}

export function getProfileScreenData(
  languageCode: LanguageCode,
  progress: {
    completedLessonIds: string[];
    lessonProgressPercent: Record<string, number>;
    streakDays: number;
  },
): ProfileScreenData | null {
  const language = getLanguageByCode(languageCode);
  if (!language) {
    return null;
  }

  const effectiveProgress = getEffectiveProgressForLanguage(
    languageCode,
    progress.completedLessonIds,
    progress.lessonProgressPercent,
  );

  const allLessons = getLessonsByLanguageCode(languageCode);
  const lessonsCompleted = effectiveProgress.completedLessonIds.filter((id) =>
    allLessons.some((lesson) => lesson.id === id),
  ).length;

  const studyMinutes = getTotalStudyMinutes(
    languageCode,
    effectiveProgress.completedLessonIds,
    effectiveProgress.lessonProgressPercent,
  );
  const totalXp = getTotalXp(
    languageCode,
    effectiveProgress.completedLessonIds,
    effectiveProgress.lessonProgressPercent,
  );

  const activeUnitNumber = getActiveUnitNumber(
    languageCode,
    effectiveProgress.completedLessonIds,
  );
  const units = getUnitsByLanguageCode(languageCode);
  const activeUnit =
    units.find((unit) => unit.number === activeUnitNumber) ?? units[0]!;
  const unitProgressPercent = getUnitProgressPercent(
    activeUnit.id,
    effectiveProgress.completedLessonIds,
    effectiveProgress.lessonProgressPercent,
  );

  const stats: ProfileStatCard[] = [
    {
      id: "streak",
      icon: "flame",
      value: String(progress.streakDays),
      label: "Day Streak",
      sublabel: "Keep it up!",
    },
    {
      id: "study-time",
      icon: "time",
      value: formatStudyTime(studyMinutes),
      label: "Study Time",
      sublabel: "Total time",
    },
    {
      id: "xp",
      icon: "star",
      value: formatXp(totalXp),
      label: "XP",
      sublabel: "Total earned",
    },
    {
      id: "lessons",
      icon: "book",
      value: String(lessonsCompleted),
      label: "Lessons",
      sublabel: "Completed",
    },
  ];

  const level: ProfileLevelInfo = {
    levelTitle: LEVEL_TITLES[activeUnitNumber] ?? `Level ${activeUnitNumber}`,
    levelCode: getLevelCode(activeUnitNumber),
    description:
      LEVEL_DESCRIPTIONS[activeUnitNumber] ??
      "Keep learning to unlock the next level.",
    progressPercent: unitProgressPercent,
    xpToNextLabel: getXpToNextLevelLabel(
      languageCode,
      activeUnitNumber,
      totalXp,
    ),
  };

  const menuItems: ProfileMenuItem[] = [
    {
      id: "saved-words",
      icon: "bookmark",
      title: "Saved Words",
      subtitle: "Review vocabulary you've saved",
    },
    {
      id: "achievements",
      icon: "trophy",
      title: "Achievements",
      subtitle: "See badges and milestones",
    },
    {
      id: "notifications",
      icon: "notifications",
      title: "Notifications",
      subtitle: "Manage reminders and alerts",
    },
    {
      id: "settings",
      icon: "settings",
      title: "Settings",
      subtitle: "Account, language, and app preferences",
    },
  ];

  return {
    language,
    learningLabel: `Learning ${language.name}`,
    motivationalMessage: getMotivationalMessage(progress.streakDays),
    stats,
    level,
    menuItems,
    lessonsCompleted,
    totalLessons: allLessons.length,
  };
}
