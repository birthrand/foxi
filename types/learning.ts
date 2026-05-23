export const LANGUAGE_CODES = ["es", "fr", "ja"] as const;

export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Language = {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flagEmoji: string;
  tagline: string;
  learnerCountLabel: string;
  difficulty: Difficulty;
  isAvailable: boolean;
};

export type Unit = {
  id: string;
  languageCode: LanguageCode;
  number: number;
  title: string;
  description: string;
};

export type VocabularyItem = {
  id: string;
  word: string;
  translation: string;
  phonetic?: string;
  example?: string;
};

export type Phrase = {
  id: string;
  text: string;
  translation: string;
  usageNote?: string;
};

export type LessonGoal = {
  id: string;
  label: string;
};

export type ActivityType =
  | "vocabulary"
  | "listening"
  | "speaking"
  | "conversation"
  | "review";

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  estimatedMinutes: number;
};

export type AiTeacherPrompt = {
  role: string;
  instructions: string;
  openingLine: string;
  focusNotes: readonly string[];
};

export type Lesson = {
  id: string;
  unitId: string;
  languageCode: LanguageCode;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  goal: string;
  goals: readonly LessonGoal[];
  vocabulary: readonly VocabularyItem[];
  phrases: readonly Phrase[];
  activities: readonly Activity[];
  aiTeacher: AiTeacherPrompt;
  imageUrl: string;
  xpReward: number;
  estimatedMinutes: number;
};

export type LessonWithLanguage = Lesson & {
  language: Language;
};

export type UnitWithLessons = Unit & {
  lessons: Lesson[];
};
