import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";

import { onboardingSpace } from "@/constants/onboarding-spacing";

type OnboardingProgressCardProps = {
  compact?: boolean;
};

export function OnboardingProgressCard({
  compact = false,
}: OnboardingProgressCardProps) {
  return (
    <View
      className="w-full rounded-2xl bg-[#FFF0E6]"
      style={{
        paddingHorizontal: compact ? onboardingSpace.md : onboardingSpace.sm,
        paddingVertical: compact ? onboardingSpace.sm : 14,
      }}
    >
      <View
        className="flex-row items-center"
        style={{ gap: compact ? onboardingSpace.sm : 12 }}
      >
        <View className="h-9 w-9 items-center justify-center rounded-full bg-foxi-orange">
          <MaterialCommunityIcons
            name="star-four-points"
            size={16}
            color="#ffffff"
          />
        </View>
        <Text
          className="flex-1 text-[13px] text-deep-navy"
          style={{ fontFamily: "Poppins_500Medium" }}
        >
          Your learning journey begins now!
        </Text>
        <Text
          className="text-[14px] text-foxi-orange"
          style={{ fontFamily: "Poppins_700Bold" }}
        >
          3 / 3
        </Text>
      </View>
      <View
        className="h-2 overflow-hidden rounded-full bg-[#FFD9B8]"
        style={{ marginTop: compact ? onboardingSpace.sm : 12 }}
      >
        <View className="h-full w-full rounded-full bg-foxi-orange" />
      </View>
    </View>
  );
}
