import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

import { profileSpace, profileSpacing } from "@/constants/profile-spacing";
import type { ProfileLevelInfo } from "@/lib/profile-data";

type ProfileLevelCardProps = {
  level: ProfileLevelInfo;
};

export function ProfileLevelCard({ level }: ProfileLevelCardProps) {
  const safeProgress = Math.min(100, Math.max(0, level.progressPercent));

  return (
    <View
      style={{
        marginTop: profileSpacing.statsToLevel,
        borderRadius: profileSpacing.levelCardRadius,
        backgroundColor: "#ff7a00",
        padding: profileSpacing.levelCardPadding,
        overflow: "hidden",
      }}
    >
      <View className="flex-row items-start justify-between">
        <View className="min-w-0 flex-1" style={{ paddingRight: profileSpace.sm }}>
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 12,
              lineHeight: 16,
              color: "rgba(255, 255, 255, 0.9)",
            }}
          >
            Current Level
          </Text>

          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 24,
              lineHeight: 30,
              color: "#ffffff",
              marginTop: 2,
            }}
          >
            {level.levelTitle}
          </Text>

          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 13,
              lineHeight: 18,
              color: "rgba(255, 255, 255, 0.92)",
              marginTop: profileSpace.xs / 2,
            }}
          >
            {level.description}
          </Text>
        </View>

        <View
          className="items-center justify-center"
          style={{
            width: profileSpacing.levelBadgeSize,
            height: profileSpacing.levelBadgeSize,
          }}
        >
          <View
            className="absolute items-center justify-center"
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.18)",
              transform: [{ rotate: "45deg" }],
            }}
          />
          <View
            className="items-center justify-center"
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              backgroundColor: "rgba(255, 255, 255, 0.24)",
              borderWidth: 2,
              borderColor: "rgba(255, 255, 255, 0.45)",
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_700Bold",
                fontSize: 22,
                color: "#ffffff",
              }}
            >
              {level.levelCode}
            </Text>
          </View>
          <Ionicons
            name="sparkles"
            size={14}
            color="rgba(255, 255, 255, 0.85)"
            style={{ position: "absolute", top: 4, right: 8 }}
          />
        </View>
      </View>

      <View style={{ marginTop: profileSpace.sm }}>
        <View
          className="flex-row overflow-hidden"
          style={{
            height: profileSpacing.progressBarHeight,
            borderRadius: profileSpacing.progressBarHeight / 2,
            backgroundColor: "rgba(255, 255, 255, 0.28)",
          }}
        >
          <View
            style={{
              flex: safeProgress,
              height: profileSpacing.progressBarHeight,
              backgroundColor: "#ffffff",
            }}
          />
          <View style={{ flex: 100 - safeProgress }} />
        </View>

        <View
          className="flex-row items-center justify-between"
          style={{ marginTop: profileSpace.xs / 2 }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 12,
              lineHeight: 16,
              color: "#ffffff",
            }}
          >
            {level.progressPercent}%
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 12,
              lineHeight: 16,
              color: "rgba(255, 255, 255, 0.92)",
            }}
          >
            {level.xpToNextLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}
