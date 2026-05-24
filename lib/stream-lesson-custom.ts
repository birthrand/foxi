import type { LessonWithLanguage } from "@/types/learning";

export const FOXI_AGENT_USER_ID = "foxi-ai-teacher";
export const FOXI_AGENT_DISPLAY_NAME = "Foxi";

export type StreamLessonCallCustom = {
  lessonId: string;
  languageCode: string;
  lessonTitle: string;
  lessonGoal: string;
  openingLine: string;
  goals: string[];
  vocabulary: { word: string; translation: string }[];
  phrases: { text: string; translation: string }[];
  aiTeacherPrompt: string;
  app: "foxi";
};

export function buildStreamLessonCallCustom(
  lesson: LessonWithLanguage,
): StreamLessonCallCustom {
  return {
    lessonId: lesson.id,
    languageCode: lesson.languageCode,
    lessonTitle: lesson.title,
    lessonGoal: lesson.goal,
    openingLine: lesson.aiTeacher.openingLine,
    goals: lesson.goals.map((goal) => goal.label),
    vocabulary: lesson.vocabulary.map((item) => ({
      word: item.word,
      translation: item.translation,
    })),
    phrases: lesson.phrases.map((phrase) => ({
      text: phrase.text,
      translation: phrase.translation,
    })),
    aiTeacherPrompt: lesson.aiTeacher.instructions,
    app: "foxi",
  };
}
