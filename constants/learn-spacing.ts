/** Spacing rhythm for the Learn / Lessons screen. */
export const learnSpace = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
} as const;

export const learnSpacing = {
  screenPadding: learnSpace.md,
  screenBackground: "#FFFBF5",
  headerToBanner: learnSpace.sm,
  bannerToProgress: learnSpace.sm,
  progressToLessons: learnSpace.sm,
  lessonsToReview: learnSpace.lg,
  scrollBottomPadding: learnSpace.lg + 8,
  sectionHeaderToContent: learnSpace.sm,
  unitSectionGap: learnSpace.lg,
  unitHeaderToLessons: learnSpace.sm,
  lessonRowGap: learnSpace.sm,
  lessonRowMinHeight: 92,
  lessonRowMinHeightCompact: 76,
  timelineNodeSize: 32,
  timelineLineWidth: 3,
  timelineConnectorGap: 4,
  timelineToCardGap: learnSpace.sm,
  lessonCardRadius: 16,
  lessonCardPadding: learnSpace.sm,
  lessonIconSize: 44,
  lessonIconRadius: 8,
  heroBannerHeight: 140,
  heroBannerRadius: 20,
  reviewCardWidth: 132,
  reviewCardGap: learnSpace.sm,
  reviewCardRadius: learnSpace.xs,
  reviewCardPadding: learnSpace.sm,
  statusIconSize: 28,
  progressBarHeight: 6,
} as const;

export const LEARN_CARD_SHADOW = {
  shadowColor: "#ff7a00",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
} as const;

export function getLessonRowMinHeight(
  status: "completed" | "in_progress" | "locked",
): number {
  return status === "in_progress"
    ? learnSpacing.lessonRowMinHeight
    : learnSpacing.lessonRowMinHeightCompact;
}

export function getTimelineConnectorHeight(rowMinHeight: number): number {
  return (
    rowMinHeight +
    learnSpacing.lessonRowGap -
    learnSpacing.timelineNodeSize -
    learnSpacing.timelineConnectorGap * 2
  );
}
