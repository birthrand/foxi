import type { ImageSourcePropType } from "react-native";

import { images } from "@/constants/images";

export type OnboardingBadgeIcon = "shield";

export type OnboardingSlide = {
  id: string;
  badge?: string;
  badgeIcon?: OnboardingBadgeIcon;
  titleLayout?: "split" | "single";
  titleLine1: string;
  titleLine2: string;
  titleLine2Orange?: boolean;
  subtitle?: string;
  subtitleLines?: readonly string[];
  illustration: ImageSourcePropType;
  illustrationVariant: "centered" | "hero-right" | "wide" | "celebration";
  showFeatureCard?: boolean;
  showProgressCard?: boolean;
  primaryButtonLabel?: string;
  secondaryLinkLabel?: string;
};

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: "welcome",
    badge: "Privacy First",
    badgeIcon: "shield",
    titleLayout: "single",
    titleLine1: "Meet Foxi",
    titleLine2: "",
    subtitleLines: [
      "Your smart, private AI companion",
      "that's always by your side",
    ],
    illustration: images.mascotLogo1Orange,
    illustrationVariant: "centered",
    primaryButtonLabel: "Let's Get Started",
    secondaryLinkLabel: "I already have an account",
  },
  {
    id: "personalize",
    badge: "Tailored For You",
    titleLayout: "split",
    titleLine1: "Personalize",
    titleLine2: "Your Learning",
    titleLine2Orange: true,
    subtitleLines: [
      "We'll create a learning path that's",
      "just right for you",
    ],
    illustration: images.mascotOnboarding3,
    illustrationVariant: "wide",
    primaryButtonLabel: "Let's Get Started",
    secondaryLinkLabel: "I already have an account",
  },
  {
    id: "ready",
    badge: "You're All Set!",
    titleLayout: "split",
    titleLine1: "Ready to",
    titleLine2: "start?",
    titleLine2Orange: true,
    subtitleLines: ["Let's begin!"],
    illustration: images.mascotLogo1OrangeFist,
    illustrationVariant: "celebration",
    showProgressCard: true,
    primaryButtonLabel: "Let's Get Started",
    secondaryLinkLabel: "I already have an account",
  },
];
