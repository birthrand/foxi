import { onboardingSpace } from "@/constants/onboarding-spacing";

/** Auth screens — 8pt rhythm aligned with ONBOARDING_SPACING.md */
export const authSpacing = {
  screenPadding: onboardingSpace.md,
  /** Safe area to headline (badge removed). */
  topToTitle: onboardingSpace.xl,
  splitTitleFontSize: 38,
  /** Room for ascenders; pair with splitTitleLine2Overlap for tight line stack. */
  splitTitleLineHeight: 42,
  splitTitleLine2Overlap: -4,
  titleToSubtitle: onboardingSpace.sm,
  subtitleLineGap: onboardingSpace.xs,
  subtitleToMascot: onboardingSpace.lg,
  mascotHeight: 200,
  /** Nudge sign-in mascot right so the fox body looks centered in the canvas. */
  signInMascotOffsetX: 12,
  mascotToCard: onboardingSpace.sm,
  cardMarginHorizontal: onboardingSpace.sm,
  cardMarginBottom: onboardingSpace.sm,
  cardPadding: onboardingSpace.md,
  cardRadius: onboardingSpace.md,
  fieldGap: onboardingSpace.sm,
  fieldHeight: 52,
  fieldRadius: 14,
  hintToCheckbox: onboardingSpace.sm,
  checkboxToButton: onboardingSpace.md,
  buttonToFooter: onboardingSpace.md,
  dividerVertical: onboardingSpace.md,
} as const;

export const AUTH_BACKGROUND = "#FFFBF5";
