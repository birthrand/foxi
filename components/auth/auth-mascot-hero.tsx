import { Image } from "expo-image";
import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

import { authSpacing } from "@/constants/auth-spacing";

type AuthMascotHeroProps = {
  source: ImageSourcePropType;
  compact?: boolean;
  showGlow?: boolean;
  /** Hug image height and sit flush against content below (sign-up). */
  flushBottom?: boolean;
  /** Optical horizontal nudge when asset art is off-center in its canvas. */
  imageOffsetX?: number;
  style?: StyleProp<ViewStyle>;
};

export function AuthMascotHero({
  source,
  compact = false,
  showGlow = true,
  flushBottom = false,
  imageOffsetX = 0,
  style,
}: AuthMascotHeroProps) {
  const mascotHeight = compact ? 168 : authSpacing.mascotHeight;
  const glowSize = compact ? 168 : 200;
  const imageWidth = compact ? 190 : 220;

  return (
    <View
      className="items-center self-center"
      style={[
        {
          width: "100%",
          height: flushBottom ? undefined : mascotHeight,
          marginTop: authSpacing.subtitleToMascot,
          justifyContent: flushBottom ? "flex-end" : "center",
        },
        style,
      ]}
    >
      {showGlow ? (
        <View
          className="absolute rounded-full bg-[#FFF0E3]"
          style={{
            width: glowSize,
            height: glowSize,
            opacity: 0.9,
            left: "50%",
            marginLeft: -glowSize / 2,
          }}
        />
      ) : null}
      <Image
        source={source}
        contentFit="contain"
        contentPosition="center"
        style={{
          width: imageWidth,
          height: mascotHeight,
          alignSelf: "center",
          transform: imageOffsetX ? [{ translateX: imageOffsetX }] : undefined,
        }}
      />
    </View>
  );
}
