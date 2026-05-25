import type {
  Lesson,
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

function buildVocabularyExchange(
  item: VocabularyItem,
  languageName: string,
): ConversationExchange {
  return {
    id: item.id,
    aiPrompt: `Say "${item.translation}" in ${languageName}.`,
    userResponse: item.translation,
    hint: item.word,
  };
}

function buildConversationExchanges(
  lesson: Pick<Lesson, "phrases" | "vocabulary">,
  languageName: string,
): ConversationExchange[] {
  const phraseExchanges = lesson.phrases.map((phrase) => ({
    id: phrase.id,
    aiPrompt: getAiPrompt(phrase, languageName),
    userResponse: phrase.translation,
    hint: phrase.text,
  }));

  if (phraseExchanges.length >= MAX_CONVERSATION_EXCHANGES) {
    return phraseExchanges.slice(0, MAX_CONVERSATION_EXCHANGES);
  }

  const remainingSlots = MAX_CONVERSATION_EXCHANGES - phraseExchanges.length;
  const vocabularyExchanges = lesson.vocabulary
    .slice(0, remainingSlots)
    .map((item) => buildVocabularyExchange(item, languageName));

  const combined = [...phraseExchanges, ...vocabularyExchanges];

  if (combined.length > 0) {
    return combined;
  }

  return lesson.vocabulary
    .slice(0, MAX_CONVERSATION_EXCHANGES)
    .map((item) => buildVocabularyExchange(item, languageName));
}

export function getTotalConversationExchanges(
  lesson: Pick<Lesson, "phrases" | "vocabulary">,
  languageName: string,
): number {
  return buildConversationExchanges(lesson, languageName).length;
}

export function getLessonScreenData(
  lesson: LessonWithLanguage,
): LessonScreenData {
  const exchanges = buildConversationExchanges(lesson, lesson.language.name);

  return {
    headerTitle: "AI Teacher",
    tagLabel: "Online",
    languageName: lesson.language.name,
    getStreakModalContent: (streakDays) => ({
      title: `You're on a ${streakDays} day streak!`,
      description:
        "Keep practicing a little every day and you'll be speaking with confidence!",
    }),
    speakInstruction: `Tap the microphone to pause your live lesson`,
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
