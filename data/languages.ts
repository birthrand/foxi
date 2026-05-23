import type { Language, LanguageCode } from "@/types/learning";

export const languages: Language[] = [
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flagEmoji: "🇪🇸",
    tagline: "Start with friendly everyday phrases.",
    learnerCountLabel: "24.3M learners",
    difficulty: "beginner",
    isAvailable: true,
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flagEmoji: "🇫🇷",
    tagline: "Learn polite greetings and introductions.",
    learnerCountLabel: "18.7M learners",
    difficulty: "beginner",
    isAvailable: true,
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flagEmoji: "🇯🇵",
    tagline: "Build confidence with simple daily expressions.",
    learnerCountLabel: "12.5M learners",
    difficulty: "beginner",
    isAvailable: true,
  },
];

export function getLanguageByCode(code: LanguageCode): Language | undefined {
  return languages.find((language) => language.code === code);
}

export function getAvailableLanguages(): Language[] {
  return languages.filter((language) => language.isAvailable);
}
