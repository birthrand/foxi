import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

import {
  LEARN_CARD_SHADOW,
  learnSpace,
  learnSpacing,
} from "@/constants/learn-spacing";

type LearnProgressStatsProps = {
  completedCount: number;
  totalCount: number;
  unitTitle: string;
  unitNumber: number;
};

export function LearnProgressStats({
  completedCount,
  totalCount,
  unitTitle,
  unitNumber,
}: LearnProgressStatsProps) {
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <View
      style={{
        marginTop: learnSpacing.bannerToProgress,
        borderRadius: learnSpacing.lessonCardRadius,
        backgroundColor: "#FFFFFF",
        padding: learnSpacing.lessonCardPadding,
        borderWidth: 1,
        borderColor: "#F3F4F6",
        ...LEARN_CARD_SHADOW,
      }}
    >
      <View className="flex-row items-start justify-between">
        <View className="min-w-0 flex-1">
          <Text
            className="text-secondary"
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 12,
              lineHeight: 16,
            }}
          >
            Unit {unitNumber}
          </Text>
          <Text
            className="text-deep-navy"
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 16,
              lineHeight: 22,
              marginTop: 2,
            }}
            numberOfLines={1}
          >
            {unitTitle}
          </Text>
        </View>

        <View
          className="flex-row items-center"
          style={{
            gap: 4,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 20,
            backgroundColor: "#FFF7ED",
          }}
        >
          <Ionicons name="trophy-outline" size={16} color="#ff7a00" />
          <Text
            className="text-foxi-orange"
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 13,
              lineHeight: 18,
            }}
          >
            {completedCount}/{totalCount}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: learnSpace.sm }}>
        <View className="flex-row items-center justify-between">
          <Text
            className="text-secondary"
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              lineHeight: 16,
            }}
          >
            Course progress
          </Text>
          <Text
            className="text-foxi-orange"
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 12,
              lineHeight: 16,
            }}
          >
            {progressPercent}%
          </Text>
        </View>

        <View
          style={{
            marginTop: 6,
            height: learnSpacing.progressBarHeight,
            borderRadius: learnSpacing.progressBarHeight / 2,
            backgroundColor: "#F3F4F6",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              borderRadius: learnSpacing.progressBarHeight / 2,
              backgroundColor: "#ff7a00",
            }}
          />
        </View>
      </View>
    </View>
  );
}
