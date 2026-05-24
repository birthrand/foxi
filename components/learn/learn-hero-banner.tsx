import { Image } from "expo-image";
import { Text, View } from "react-native";

import { images } from "@/constants/images";
import { LEARN_CARD_SHADOW, learnSpace, learnSpacing } from "@/constants/learn-spacing";

type LearnHeroBannerProps = {
  languageName: string;
  completedCount: number;
  totalCount: number;
};

export function LearnHeroBanner({
  languageName,
  completedCount,
  totalCount,
}: LearnHeroBannerProps) {
  return (
    <View
      style={{
        marginTop: learnSpacing.headerToBanner,
        marginBottom: learnSpace.xs,
        minHeight: learnSpacing.heroBannerHeight,
        overflow: "visible",
      }}
    >
      <View
        style={{
          borderRadius: learnSpacing.heroBannerRadius,
          minHeight: learnSpacing.heroBannerHeight,
          overflow: "hidden",
          ...LEARN_CARD_SHADOW,
        }}
      >
        <Image
          source={images.mascotLessonBanner1}
          accessibilityLabel=""
          importantForAccessibility="no-hide-descendants"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
          contentFit="cover"
        />

        <View
          style={{
            minHeight: learnSpacing.heroBannerHeight,
            paddingLeft: learnSpacing.lessonCardPadding,
            paddingRight: learnSpacing.lessonCardPadding,
            paddingVertical: learnSpacing.lessonCardPadding,
            justifyContent: "center",
          }}
        >
          <View
            className="max-w-[55%] ml-1 min-w-0"
            style={{ paddingRight: 16 }}
          >
            <Text
              className="text-deep-navy"
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 20,
                lineHeight: 24,
              }}
            >
              Let&apos;s learn {languageName}!
            </Text>
            <Text
              className="text-secondary"
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 12,
                lineHeight: 16,
                marginTop: 4,
              }}
            >
              {completedCount} of {totalCount} lessons complete
            </Text>
            <Text
              className="text-secondary"
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 11,
                lineHeight: 14,
                marginTop: 2,
              }}
            >
              Tiny steps, big progress — you&apos;ve got this!
            </Text>
          </View>
        </View>
      </View>

      <Image
        source={images.mascotLessonTable1}
        accessibilityLabel="Foxi mascot studying at a desk"
        style={{
          position: "absolute",
          right: 0,
          bottom: -28,
          width: 200,
          height: 200,
        }}
        contentFit="contain"
      />
    </View>
  );
}
