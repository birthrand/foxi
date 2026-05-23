/** 8px-grid spacing rhythm — XS/SM/MD/LG/XL map to 8/16/24/32/40. */
export const onboardingSpace = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
  ctaHeight: 56,
} as const;

/** Shared spacing for slide 1 and legacy fallbacks. */
export const onboardingSpacing = {
  screenPadding: onboardingSpace.md,
  topToBadge: onboardingSpace.lg,
  badgeToTitle: 28,
  titleLineGap: onboardingSpace.sm,
  splitTitleFontSize: 42,
  splitTitleLineHeight: 46,
  splitTitleToSubtitle: onboardingSpace.sm,
  titleToSubtitle: onboardingSpace.md,
  titleToSubtitleTight: 0,
  subtitleToMascot: onboardingSpace.xl,
  mascotToButton: onboardingSpace.xxl,
  buttonToSecondary: onboardingSpace.sm,
  secondaryToPagination: onboardingSpace.md,
  paginationToBottom: onboardingSpace.md,
  badgeHeight: 44,
  badgePaddingH: onboardingSpace.sm,
  badgeIconGap: onboardingSpace.xs,
  splitTitleLine1ToLine2: 0,
  splitTitleStarMarginLeft: 6,
  splitTitleStarDescenderOffset: 2,
  splitTitleStarSize: 20,
  textMaxWidthRatio: 0.82,
  buttonHeight: onboardingSpace.ctaHeight,
  buttonRadius: 19,
  paginationGap: onboardingSpace.xs,
  paginationActive: 10,
  paginationInactive: onboardingSpace.xs,
  secondaryMinHeight: 44,
  mascotWidthRatio: 0.88,
  celebrationMascotWidthRatio: 0.6,
  /** Offset from mascot left edge; negative places card to the left, under the raised hand. */
  celebrationLessonCardLeftRatio: -0.2,
  celebrationLessonCardTopRatio: 0.12,
  celebrationLessonCardRotateDeg: -8,
  mascotToProgressCard: onboardingSpace.sm,
  mascotUpwardNudge: 10,
} as const;

/** Slides 1–3 — 8pt rhythm with grouped sections (see ONBOARDING_SPACING.md). */
export const tightSlideSpacing = {
  screenPadding: onboardingSpace.md,
  topToBadge: onboardingSpace.xl,
  badgeToTitle: onboardingSpace.md,
  splitTitleLine1ToLine2: 0,
  titleToSubtitle: onboardingSpace.md,
  subtitleToIllustration: onboardingSpace.lg,
  illustrationToCta: onboardingSpace.xl,
} as const;

/** Slide 3 — celebration cluster + progress card. */
export const celebrationSlideSpacing = {
  ...tightSlideSpacing,
  mascotToProgressCard: onboardingSpace.md,
  progressToCta: onboardingSpace.xl,
  lessonCardVisualOffset: onboardingSpace.md,
} as const;
