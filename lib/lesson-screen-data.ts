import type {
  LessonWithLanguage,
  Phrase,
  VocabularyItem,
} from "@/types/learning";

export type LessonStep = {
  id: string;
  text: string;
  translation: string;
  phonetic?: string;
  instruction: string;
};

export type ConversationExchange = {
  id: string;
  aiPrompt: string;
  userResponse: string;
  hint: string;
};

export type StreakModalContent = {
  title: string;
  description: string;
};

export type LessonScreenData = {
  headerTitle: string;
  tagLabel: string;
  languageName: string;
  getStreakModalContent: (streakDays: number) => StreakModalContent;
  speakInstruction: string;
  exchanges: ConversationExchange[];
  totalExchanges: number;
  todaysWords: VocabularyItem[];
};

const MAX_CONVERSATION_EXCHANGES = 5;

function getAiPrompt(phrase: Phrase, languageName: string): string {
  const trimmed = phrase.translation.replace(/\.$/, "");

  return `Say "${trimmed}" in ${languageName}.`;
}

function buildConversationExchanges(
  lesson: LessonWithLanguage,
): ConversationExchange[] {
  const phraseExchanges = lesson.phrases
    .slice(0, MAX_CONVERSATION_EXCHANGES)
    .map((phrase) => ({
      id: phrase.id,
      aiPrompt: getAiPrompt(phrase, lesson.language.name),
      userResponse: phrase.translation,
      hint: phrase.text,
    }));

  if (phraseExchanges.length > 0) {
    return phraseExchanges;
  }

  return lesson.vocabulary.slice(0, MAX_CONVERSATION_EXCHANGES).map((item) => ({
    id: item.id,
    aiPrompt: `Say "${item.translation}" in ${lesson.language.name}.`,
    userResponse: item.translation,
    hint: item.word,
  }));
}

export function getLessonScreenData(
  lesson: LessonWithLanguage,
): LessonScreenData {
  const exchanges = buildConversationExchanges(lesson);

  return {
    headerTitle: "AI Teacher",
    tagLabel: "Online",
    languageName: lesson.language.name,
    getStreakModalContent: (streakDays) => ({
      title: `You're on a ${streakDays} day streak!`,
      description:
        "Keep practicing a little every day and you'll be speaking with confidence!",
    }),
    speakInstruction: `Hold to talk`,
    exchanges,
    totalExchanges: exchanges.length,
    todaysWords: [...lesson.vocabulary],
  };
}

export function formatPhonetic(phonetic?: string): string | undefined {
  if (!phonetic) {
    return undefined;
  }

  return phonetic.replace(/-/g, "").toLowerCase();
}
