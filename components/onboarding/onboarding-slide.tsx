import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { Text, View, useWindowDimensions } from "react-native";

import { OnboardingBadge } from "@/components/onboarding/onboarding-badge";
import { OnboardingFeatureCard } from "@/components/onboarding/onboarding-feature-card";
import { OnboardingLessonCard } from "@/components/onboarding/onboarding-lesson-card";
import { OnboardingProgressCard } from "@/components/onboarding/onboarding-progress-card";
import {
  celebrationSlideSpacing,
  onboardingSpacing,
  tightSlideSpacing,
} from "@/constants/onboarding-spacing";
import type { OnboardingSlide as OnboardingSlideData } from "@/data/onboarding";

type OnboardingSlideProps = {
  slide: OnboardingSlideData;
};

function getSubtitleLines(slide: OnboardingSlideData): string[] {
  if (slide.subtitleLines?.length) {
    return [...slide.subtitleLines];
  }
  if (!slide.subtitle) {
    return [];
  }
  return slide.subtitle.split("\n").filter((line) => line.length > 0);
}

function PrimaryOnboardingSlideContent({
  slide,
}: {
  slide: OnboardingSlideData;
}) {
  const { width } = useWindowDimensions();
  const textMaxWidth = width * onboardingSpacing.textMaxWidthRatio;
  const isCelebrationSlide = slide.illustrationVariant === "celebration";
  const isWideSlide = slide.illustrationVariant === "wide";
  const isCenteredSlide = slide.illustrationVariant === "centered";
  const mascotContainerWidth =
    width *
    (isCelebrationSlide
      ? onboardingSpacing.celebrationMascotWidthRatio
      : onboardingSpacing.mascotWidthRatio);
  const subtitleLines = getSubtitleLines(slide);
  const illustrationTopGap = tightSlideSpacing.subtitleToIllustration;
  const isSplitTitle = slide.titleLayout === "split";
  const line2Color = slide.titleLine2Orange
    ? "text-foxi-orange"
    : "text-[#2D2419]";

  return (
    <View
      className="flex-1"
      style={{
        paddingHorizontal: tightSlideSpacing.screenPadding,
        paddingBottom: isCelebrationSlide
          ? celebrationSlideSpacing.progressToCta
          : tightSlideSpacing.illustrationToCta,
      }}
    >
      <View
        className="shrink-0 items-center"
        style={{ paddingTop: tightSlideSpacing.topToBadge }}
      >
        {slide.badge ? (
          <View style={{ marginBottom: tightSlideSpacing.badgeToTitle }}>
            <OnboardingBadge
              label={slide.badge}
              icon={slide.badgeIcon}
              compact
            />
          </View>
        ) : null}

        <View style={{ maxWidth: textMaxWidth, alignItems: "center" }}>
          {isSplitTitle ? (
            <View className="items-center">
              <Text
                className="text-center text-[#2D2419]"
                style={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: onboardingSpacing.splitTitleFontSize,
                  lineHeight: onboardingSpacing.splitTitleLineHeight,
                }}
              >
                {slide.titleLine1}
              </Text>
              <View
                className="relative self-center"
                style={{
                  marginTop: tightSlideSpacing.splitTitleLine1ToLine2,
                }}
              >
                <Text
                  className={`text-center ${line2Color}`}
                  style={{
                    fontFamily: "Poppins_700Bold",
                    fontSize: onboardingSpacing.splitTitleFontSize,
                    lineHeight: onboardingSpacing.splitTitleLineHeight,
                  }}
                >
                  {slide.titleLine2}
                </Text>
              </View>
            </View>
          ) : (
            <Text
              className="text-center text-[42px] leading-[46px] text-[#2D2419]"
              style={{ fontFamily: "Poppins_700Bold" }}
            >
              {slide.titleLine1}
            </Text>
          )}

          {subtitleLines.length > 0 ? (
            <View
              className="items-center gap-0.5"
              style={{ marginTop: tightSlideSpacing.titleToSubtitle }}
            >
              {subtitleLines.map((line, index) => (
                <Text
                  key={`${slide.id}-subtitle-${index}`}
                  className="text-center text-[15px] leading-[22px] text-[#4A3F35]"
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
                  {line}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      {isCelebrationSlide && slide.showProgressCard ? (
        <>
          <View
            className="shrink-0 items-center"
            style={{ marginTop: illustrationTopGap, overflow: "visible" }}
          >
            <View
              style={{
                position: "relative",
                width: mascotContainerWidth,
                height: mascotContainerWidth * 0.92,
                overflow: "visible",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  left:
                    mascotContainerWidth *
                      onboardingSpacing.celebrationLessonCardLeftRatio -
                    celebrationSlideSpacing.lessonCardVisualOffset / 2,
                  top:
                    mascotContainerWidth *
                    onboardingSpacing.celebrationLessonCardTopRatio,
                  zIndex: 1,
                  transform: [
                    {
                      rotate: `${onboardingSpacing.celebrationLessonCardRotateDeg}deg`,
                    },
                  ],
                }}
              >
                <OnboardingLessonCard />
              </View>
              <Image
                source={slide.illustration}
                style={{
                  width: mascotContainerWidth,
                  height: mascotContainerWidth * 0.92,
                  maxWidth: "100%",
                  zIndex: 2,
                }}
                contentFit="contain"
              />
            </View>
          </View>
          <View
            style={{ marginTop: celebrationSlideSpacing.mascotToProgressCard }}
          >
            <OnboardingProgressCard compact />
          </View>
        </>
      ) : isWideSlide ? (
        <View
          className="shrink-0 items-center"
          style={{ marginTop: illustrationTopGap }}
        >
          <Image
            source={slide.illustration}
            style={{
              width: width - tightSlideSpacing.screenPadding * 2,
              height: 280,
              maxWidth: "100%",
            }}
            contentFit="contain"
          />
        </View>
      ) : isCenteredSlide ? (
        <View
          className="shrink-0 items-center"
          style={{ marginTop: illustrationTopGap }}
        >
          <Image
            source={slide.illustration}
            style={{
              width: mascotContainerWidth,
              height: mascotContainerWidth,
              maxWidth: "100%",
            }}
            contentFit="contain"
          />
        </View>
      ) : null}
    </View>
  );
}

function TitleBlock({ slide }: { slide: OnboardingSlideData }) {
  const isWelcomeSlide = slide.id === "welcome";
  const isSingleTitle = slide.titleLayout === "single";
  const line2Color = slide.titleLine2Orange
    ? "text-foxi-orange"
    : "text-deep-navy";
  const subtitleLines = getSubtitleLines(slide);

  return (
    <View className="shrink items-center px-6">
      {slide.badge ? (
        <View className={isWelcomeSlide ? "mb-3" : "mb-2"}>
          <OnboardingBadge label={slide.badge} icon={slide.badgeIcon} />
        </View>
      ) : null}
      <View className="items-center">
        {isSingleTitle ? (
          <Text
            className="text-center text-[34px] leading-[40px] text-[#2D2419]"
            style={{ fontFamily: "Poppins_700Bold" }}
          >
            {slide.titleLine1}
          </Text>
        ) : (
          <>
            <Text
              className="text-center text-[28px] leading-7 text-deep-navy"
              style={{ fontFamily: "Poppins_700Bold" }}
            >
              {slide.titleLine1}
            </Text>
            <View
              className="flex-row items-center justify-center"
              style={{ marginTop: onboardingSpacing.titleLineGap }}
            >
              <Text
                className={`text-center text-[64px] leading-[64px] ${line2Color}`}
                style={{ fontFamily: "Poppins_700Bold" }}
              >
                {slide.titleLine2}
              </Text>
              {slide.titleLine2Orange ? (
                <MaterialCommunityIcons
                  name="star-four-points"
                  size={18}
                  color="#ff7a00"
                  style={{ marginLeft: 4, marginTop: 4 }}
                />
              ) : null}
            </View>
          </>
        )}
      </View>
      {subtitleLines.length > 0 ? (
        <View
          className={`items-center ${isWelcomeSlide ? "mt-2 px-2" : "mt-2 gap-0.5"}`}
        >
          {subtitleLines.map((line, index) => (
            <Text
              key={`${slide.id}-subtitle-${index}`}
              className={`text-center leading-[22px] ${
                isWelcomeSlide
                  ? "text-[15px] text-[#4A3F35]"
                  : "text-[15px] text-secondary"
              }`}
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              {line}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function HeroRightSlideContent({ slide }: { slide: OnboardingSlideData }) {
  return (
    <View className="min-h-0 flex-1">
      <View className="z-10 px-6">
        <Text
          className="text-[32px] leading-[36px] text-deep-navy"
          style={{ fontFamily: "Poppins_700Bold" }}
        >
          {slide.titleLine1}
        </Text>
        <Text
          className="text-[38px] leading-[42px] text-foxi-orange"
          style={{ fontFamily: "Poppins_700Bold" }}
        >
          {slide.titleLine2}
        </Text>
        <Text
          className="mt-2 max-w-[240px] text-[14px] leading-5 text-secondary"
          style={{ fontFamily: "Poppins_400Regular" }}
        >
          {slide.subtitle}
        </Text>
      </View>

      <View className="relative -mt-3 min-h-[220px] flex-1">
        <View
          className="absolute -bottom-4 right-0"
          style={{ width: 228, height: 272 }}
        >
          <Image
            source={slide.illustration}
            style={{ width: 228, height: 272 }}
            contentFit="contain"
          />
          <MaterialCommunityIcons
            name="star-four-points"
            size={22}
            color="#FFD54F"
            style={{ position: "absolute", right: 52, top: 36 }}
          />
        </View>
      </View>
    </View>
  );
}

function IllustrationBlock({ slide }: { slide: OnboardingSlideData }) {
  if (slide.illustrationVariant === "hero-right") {
    return <HeroRightSlideContent slide={slide} />;
  }

  if (slide.illustrationVariant === "celebration") {
    return (
      <View className="min-h-0 flex-1 items-center justify-start px-4">
        <View
          className="relative h-full w-full max-h-[280px] max-w-[340px] items-center justify-start"
          style={{ overflow: "visible" }}
        >
          <View
            className="absolute"
            style={{
              left: -60,
              top: 28,
              zIndex: 1,
              transform: [{ rotate: "-8deg" }],
            }}
          >
            <OnboardingLessonCard />
          </View>
          <Image
            source={slide.illustration}
            style={{
              width: 300,
              height: 280,
              maxWidth: "100%",
              maxHeight: "100%",
              zIndex: 2,
            }}
            contentFit="contain"
          />
        </View>
      </View>
    );
  }

  if (slide.illustrationVariant === "wide") {
    return (
      <View className="min-h-0 flex-1 items-center justify-start px-6">
        <Image
          source={slide.illustration}
          style={{
            width: 340,
            height: 280,
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          contentFit="contain"
        />
      </View>
    );
  }

  return (
    <View className="min-h-0 flex-1 items-center justify-center px-4 pb-2">
      <Image
        source={slide.illustration}
        style={{
          width: 320,
          height: slide.id === "welcome" ? 300 : 280,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        contentFit="contain"
      />
    </View>
  );
}

function usesPrimaryLayout(slide: OnboardingSlideData) {
  return slide.titleLayout === "single" || slide.titleLayout === "split";
}

export function OnboardingSlide({ slide }: OnboardingSlideProps) {
  const isHeroLayout = slide.illustrationVariant === "hero-right";

  if (usesPrimaryLayout(slide)) {
    return (
      <View className="flex-1">
        <PrimaryOnboardingSlideContent slide={slide} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      {!isHeroLayout ? (
        <View className="min-h-0 flex-1">
          <TitleBlock slide={slide} />
          <IllustrationBlock slide={slide} />
        </View>
      ) : (
        <IllustrationBlock slide={slide} />
      )}

      {slide.showFeatureCard ? (
        <View className="z-10 shrink px-6 pb-1">
          <OnboardingFeatureCard />
        </View>
      ) : null}

      {slide.showProgressCard && !usesPrimaryLayout(slide) ? (
        <View className="shrink px-6 pb-2">
          <OnboardingProgressCard />
        </View>
      ) : null}
    </View>
  );
}
