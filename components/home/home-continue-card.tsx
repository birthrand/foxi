import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import {
  HOME_CARD_SHADOW,
  homeSpace,
  homeSpacing,
} from "@/constants/home-spacing";
import { images } from "@/constants/images";
import type { ContinueLearningItem } from "@/lib/home-data";

type HomeContinueCardProps = {
  item: ContinueLearningItem;
  onPress?: () => void;
};

const CONTINUE_BEIGE = "#F5EDE0";

export function HomeContinueCard({ item, onPress }: HomeContinueCardProps) {
  const { languageName, unitTitle, levelLabel } = item;

  return (
    <View style={{ borderRadius: homeSpacing.cardRadius, ...HOME_CARD_SHADOW }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Continue learning ${languageName}, ${levelLabel} ${unitTitle}`}
        onPress={onPress}
        className="active:opacity-95"
        style={{
          marginTop: homeSpacing.statsToContinue,
          borderRadius: homeSpacing.cardRadius,
          backgroundColor: "#ff7a00",
          minHeight: homeSpacing.continueCardMinHeight,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            right: -homeSpace.lg,
            top: homeSpace.lg + homeSpace.xl,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: CONTINUE_BEIGE,
          }}
        />

        <View
          style={{
            paddingTop: homeSpacing.continueContentPaddingTop,
            paddingBottom: homeSpacing.continueContentPaddingBottom,
            paddingLeft: homeSpacing.continueContentPaddingLeft,
            paddingRight: homeSpacing.continueContentPaddingRight,
          }}
        >
          {/* <Text
            className="mt-2 text-white"
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 13,
              lineHeight: 16,
            }}
          >
            Continue learning
          </Text> */}

          <Text
            className="text-white"
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 24,
              lineHeight: 32,
              marginTop: homeSpacing.continueLanguageNameMarginTop,
            }}
            numberOfLines={1}
          >
            {languageName}
          </Text>

          <Text
            className="text-white"
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 16,
              lineHeight: 20,
              marginTop: homeSpacing.continueTitleToSubtitle,
            }}
            numberOfLines={2}
          >
            {levelLabel} • {unitTitle}
          </Text>
        </View>
        <View
          className="items-center justify-center max-w-[180px]"
          style={{
            marginLeft: homeSpacing.continueButtonMarginLeft,
            marginBottom: homeSpacing.continueButtonMarginBottom,
            width: "100%",
            height: homeSpacing.continueButtonHeight,
            borderRadius: homeSpacing.continueButtonHeight / 2,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#FFFFFF",
            ...HOME_CARD_SHADOW,
          }}
        >
          <Text className="text-[#ff7a00] font-poppins-semibold text-md">
            Continue Learning
          </Text>
        </View>
        <Image
          source={images.mascotOnboarding2}
          accessibilityLabel="Foxi mascot studying"
          style={{
            position: "absolute",
            right: -36,
            bottom: -40,
            width: 240,
            height: 240,
          }}
          contentFit="contain"
        />
      </Pressable>
    </View>
  );
}
