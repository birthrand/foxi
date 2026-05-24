/** Spacing rhythm for the Lesson unit screen. */
export const lessonSpace = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
} as const;

export const lessonSpacing = {
  screenPadding: lessonSpace.md,
  screenBackground: "#FFFBF5",
  scrollBottomPadding: lessonSpace.lg + 8,
  headerToStatus: 10,
  statusToChat: lessonSpace.sm,
  chatGap: 10,
  chatToListening: lessonSpace.sm,
  listeningToActions: lessonSpace.sm,
  actionsToProgress: lessonSpace.sm,
  progressBottomPadding: lessonSpace.md,
  headerToCard: lessonSpace.sm,
  cardToProgress: lessonSpace.sm,
  progressToWords: lessonSpace.lg,
  wordsToFeedback: lessonSpace.lg,
  cardRadius: 20,
  cardPadding: lessonSpace.md,
  activityCardMinHeight: 340,
  contentBoxRadius: 16,
  contentBoxPadding: lessonSpace.lg,
  contentBoxMinHeight: 160,
  wordCardWidth: 140,
  wordCardGap: lessonSpace.sm,
  wordCardRadius: 16,
  wordCardPadding: lessonSpace.md,
  wordCardMinHeight: 148,
  feedbackCardRadius: 20,
  progressBarHeight: 12,
  headerProgressWidth: 56,
  speakerButtonSize: 56,
  activityIconSize: 28,
  actionButtonHeight: 60,
  mascotAvatarSize: 36,
  chatAvatarSize: 40,
  listeningMicSize: 72,
  segmentGap: 4,
} as const;

export const LESSON_BEIGE = "#F5EDE0";
export const LESSON_USER_BUBBLE = "#FFF1E6";
export const LESSON_TAG_BG = "#FFF7ED";

export const LESSON_CARD_SHADOW = {
  shadowColor: "#0d132b",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
} as const;

export const LESSON_SPEAKER_SHADOW = {
  shadowColor: "#0d132b",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3,
} as const;
