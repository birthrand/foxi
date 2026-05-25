/** 8px-grid spacing rhythm for the Profile screen. */
export const profileSpace = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
} as const;

export const profileSpacing = {
  screenPadding: profileSpace.sm,
  screenBackground: "#FFFBF5",
  scrollBottomPadding: profileSpace.xl,
  headerToStats: profileSpace.sm,
  statsToLevel: profileSpace.sm,
  levelToMenu: profileSpace.sm,
  statCardGap: profileSpace.xs,
  statCardRadius: profileSpace.xs,
  statCardPaddingV: profileSpace.sm,
  statCardPaddingH: profileSpace.xs,
  levelCardRadius: profileSpace.sm,
  levelCardPadding: profileSpace.sm,
  menuCardRadius: profileSpace.sm,
  menuItemPaddingV: profileSpace.sm,
  menuItemPaddingH: profileSpace.sm,
  avatarSize: 96,
  avatarToText: profileSpace.sm,
  headerChevronSize: 20,
  statIconSize: 22,
  menuIconSize: 22,
  levelBadgeSize: 88,
  progressBarHeight: profileSpace.xs,
} as const;

export const PROFILE_CARD_SHADOW = {
  shadowColor: "#0d132b",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
} as const;
