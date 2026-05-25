import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { PlanProgressRing } from "@/components/home/plan-progress-ring";
import { HOME_CARD_SHADOW, homeSpacing } from "@/constants/home-spacing";
import { images } from "@/constants/images";
import type { FocusItem, FocusPlanType } from "@/lib/home-data";

type HomeFocusCardProps = {
  item: FocusItem;
  width: number;
  onPress?: () => void;
};

const FOXI_ORANGE = "#ff7a00";
const DEEP_NAVY = "#0d132b";
const CONTINUE_BEIGE = "#F5EDE0";

type CardTheme = {
  gradientId: string;
  gradientColors: [string, string];
  textColor: string;
  subtitleColor: string;
  badgeBackground: string;
  badgeTextColor: string;
  iconBackground: string;
  iconColor: string;
  progressColor: string;
  progressLabelColor: string;
  showLiveBadge: boolean;
  showProgressRing: boolean;
  showMascot: boolean;
  showWordChips: boolean;
};

function getCardTheme(planType: FocusPlanType, itemId: string): CardTheme {
  const gradientId = `plan-gradient-${itemId.replace(/[^a-zA-Z0-9]/g, "")}`;

  switch (planType) {
    case "lesson":
      return {
        gradientId,
        gradientColors: ["#ff7a00", "#ff9a3d"],
        textColor: "#FFFFFF",
        subtitleColor: "rgba(255,255,255,0.92)",
        badgeBackground: "rgba(255,255,255,0.1)",
        badgeTextColor: "#FFFFFF",
        iconBackground: "rgba(255,255,255,0.1)",
        iconColor: "#FFFFFF",
        progressColor: "#FFFFFF",
        progressLabelColor: "#FFFFFF",
        showLiveBadge: false,
        showProgressRing: true,
        showMascot: false,
        showWordChips: false,
      };
    case "ai-conversation":
      return {
        gradientId,
        gradientColors: ["#1e3a8a", "#3b82f6"],
        textColor: "#FFFFFF",
        subtitleColor: "rgba(255,255,255,0.9)",
        badgeBackground: "rgba(255,255,255,0.1)",
        badgeTextColor: "#FFFFFF",
        iconBackground: "rgba(255,255,255,0.1)",
        iconColor: "#FFFFFF",
        progressColor: "#FFFFFF",
        progressLabelColor: "#FFFFFF",
        showLiveBadge: true,
        showProgressRing: false,
        showMascot: false,
        showWordChips: false,
      };
    case "new-words":
    default:
      return {
        gradientId,
        gradientColors: ["#fff3e0", "#ffd8b8"],
        textColor: DEEP_NAVY,
        subtitleColor: "#475569",
        badgeBackground: "rgba(252, 148, 28, 0.1)"  ,
        badgeTextColor: FOXI_ORANGE,
        iconBackground: "rgba(255,122,0,0.1)",
        iconColor: "#FFFFFF",
        progressColor: FOXI_ORANGE,
        progressLabelColor: DEEP_NAVY,
        showLiveBadge: false,
        showProgressRing: false,
        showMascot: false,
        showWordChips: true,
      };
  }
}

function getPlanIcon(planType: FocusPlanType, color: string) {
  switch (planType) {
    case "lesson":
      return <Ionicons name="headset" size={20} color={color} />;
    case "ai-conversation":
      return <Ionicons name="headset" size={20} color={color} />;
    case "new-words":
    default:
      return <Ionicons name="headset" size={20} color={color} />;
  }
}

function PlanBadge({
  label,
  backgroundColor,
  textColor,
}: {
  label: string;
  backgroundColor: string;
  textColor: string;
}) {
  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor,
      }}
    >
      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 12,
          lineHeight: 16,
          color: textColor,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function LiveBadge() {
  return (
    <View className="flex-row items-center" style={{ gap: 6 }}>
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: "#22c55e",
        }}
      />
      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 11,
          lineHeight: 14,
          color: "#22c55e",
          letterSpacing: 0.6,
        }}
      >
        LIVE
      </Text>
    </View>
  );
}

function WordChips({ words }: { words: string[] }) {
  const offsets = [
    { top: 108, left: 18 },
    { top: 118, left: 102 },
    { top: 158, left: 24 },
  ];

  return (
    <>
      {words.map((word, index) => (
        <View
          key={word}
          style={{
            position: "absolute",
            top: offsets[index]?.top ?? 90,
            left: offsets[index]?.left ?? 20,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
            backgroundColor: "#FFFFFF",
            ...HOME_CARD_SHADOW,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 12,
              lineHeight: 16,
              color: DEEP_NAVY,
            }}
          >
            {word}
          </Text>
        </View>
      ))}
    </>
  );
}

export function HomeFocusCard({ item, width, onPress }: HomeFocusCardProps) {
  const theme = getCardTheme(item.planType, item.id);
  const displayProgress = item.completed ? 100 : item.progressPercent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.category}: ${item.headline}`}
      accessibilityState={{ checked: item.completed }}
      onPress={onPress}
      className="active:opacity-85"
      style={{
        width,
        height: homeSpacing.focusStreamingCardHeight,
        // marginBottom: 2,
        // paddingVertical: homeSpacing.focusStreamingCardPadding,
        borderRadius: homeSpacing.focusStreamingCardRadius,
        ...HOME_CARD_SHADOW,
      }}
    >
      <View
        style={{
          flex: 1,
          borderRadius: homeSpacing.focusStreamingCardRadius,
          overflow: "hidden",
        }}
      >
        <Svg
          width={width}
          height={homeSpacing.focusStreamingCardHeight}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <Defs>
            <LinearGradient id={theme.gradientId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={theme.gradientColors[0]} />
              <Stop offset="1" stopColor={theme.gradientColors[1]} />
            </LinearGradient>
          </Defs>
          <Rect
            width={width}
            height={homeSpacing.focusStreamingCardHeight}
            fill={`url(#${theme.gradientId})`}
          />
        </Svg>

        {item.planType === "lesson" ? (
          <View
            style={{
              position: "absolute",
              right: -28,
              bottom: -36,
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "rgba(255, 232, 212, 0.2)",
              opacity: 0.85,
            }}
          />
        ) : null}

        {item.planType === "ai-conversation" ? (
          <View
            style={{
              position: "absolute",
              left: -20,
              right: -20,
              bottom: -4,
              height: 72,
              borderTopLeftRadius: 120,
              borderTopRightRadius: 120,
              backgroundColor: "rgba(96, 165, 250, 0.35)",
            }}
          />
        ) : null}

        {item.planType === "new-words" ? (
          <View
            style={{
              position: "absolute",
              right: -28,
              bottom: -36,
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "rgba(235, 165, 122, 0.09)",
              opacity: 0.85,
            }}
          />
        ) : null}

        <View
          style={{
            flex: 1,
            padding: homeSpacing.focusStreamingCardPadding,
            justifyContent: "space-between",
          }}
        >
          <View>
            <View className="flex-row items-start justify-between">
              <PlanBadge
                label={item.category}
                backgroundColor={theme.badgeBackground}
                textColor={theme.badgeTextColor}
              />
              {theme.showLiveBadge ? <LiveBadge /> : null}
            </View>

            <Text
              style={{
                marginTop: 12,
                fontFamily: "Poppins_600SemiBold",
                fontSize: 22,
                lineHeight: 28,
                color: theme.textColor,
              }}
              numberOfLines={2}
            >
              {item.headline}
            </Text>
            <Text
              style={{
                marginTop: 4,
                fontFamily: "Poppins_400Regular",
                fontSize: 13,
                lineHeight: 18,
                color: theme.subtitleColor,
              }}
              numberOfLines={2}
            >
              {item.subtitle}
            </Text>
          </View>

          <View className="flex-row items-end justify-between">
            {theme.showProgressRing ? (
              <PlanProgressRing
                percent={displayProgress}
                color={theme.progressColor}
                labelColor={theme.progressLabelColor}
              />
            ) : (
              <View />
            )}

            <View
              className="items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: theme.iconBackground,
                borderWidth: item.planType === "new-words" ? 0 : 0,
                borderColor:
                  item.planType === "new-words" ? FOXI_ORANGE : "transparent",
              }}
            >
              {getPlanIcon(item.planType, theme.iconColor)}
            </View>
          </View>
        </View>

        {theme.showMascot ? (
          <Image
            source={images.mascotOnboarding2}
            accessibilityLabel="Foxi mascot"
            style={{
              position: "absolute",
              right: 36,
              bottom: 8,
              width: 72,
              height: 72,
            }}
            contentFit="contain"
          />
        ) : null}

        {theme.showWordChips && item.wordChips?.length ? (
          <WordChips words={item.wordChips} />
        ) : null}
      </View>
    </Pressable>
  );
}
