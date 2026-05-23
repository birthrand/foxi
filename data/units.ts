import type { LanguageCode, Unit } from "@/types/learning";

export const units: Unit[] = [
  {
    id: "es-unit-1",
    languageCode: "es",
    number: 1,
    title: "Getting Started",
    description: "Greetings, manners, and your first introductions.",
  },
  {
    id: "es-unit-2",
    languageCode: "es",
    number: 2,
    title: "Everyday Basics",
    description: "Numbers, feelings, and meeting someone new.",
  },
  {
    id: "fr-unit-1",
    languageCode: "fr",
    number: 1,
    title: "Premiers Mots",
    description: "Polite greetings and simple introductions.",
  },
  {
    id: "fr-unit-2",
    languageCode: "fr",
    number: 2,
    title: "Au Quotidien",
    description: "Numbers, moods, and first conversations.",
  },
  {
    id: "ja-unit-1",
    languageCode: "ja",
    number: 1,
    title: "First Steps",
    description: "Essential greetings and polite expressions.",
  },
  {
    id: "ja-unit-2",
    languageCode: "ja",
    number: 2,
    title: "Daily Life",
    description: "Numbers, feelings, and meeting people.",
  },
];

export function getUnitById(unitId: string): Unit | undefined {
  return units.find((unit) => unit.id === unitId);
}

export function getUnitsByLanguageCode(languageCode: LanguageCode): Unit[] {
  return units
    .filter((unit) => unit.languageCode === languageCode)
    .sort((a, b) => a.number - b.number);
}
