import { onboardingSpace } from "@/constants/onboarding-spacing";

export const languageSelectionSpacing = {
  screenPadding: onboardingSpace.md,
  headerTop: onboardingSpace.sm,
  headerToSearch: onboardingSpace.md,
  searchToList: onboardingSpace.md,
  sectionToCards: onboardingSpace.sm,
  cardGap: onboardingSpace.sm,
  listToButton: onboardingSpace.md,
  backButtonSize: 40,
  flagSize: 48,
  selectionIndicatorSize: 24,
  searchHeight: 52,
  searchRadius: 26,
  cardRadius: 16,
  cardPadding: onboardingSpace.sm,
} as const;

export const LANGUAGE_SELECTION_BACKGROUND = "#FFFBF5";
