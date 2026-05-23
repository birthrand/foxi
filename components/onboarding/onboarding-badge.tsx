import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";

import { onboardingSpacing } from "@/constants/onboarding-spacing";
import type { OnboardingBadgeIcon } from "@/data/onboarding";

type OnboardingBadgeProps = {
  label: string;
  icon?: OnboardingBadgeIcon;
  compact?: boolean;
};

export function OnboardingBadge({
  label,
  icon = "star",
  compact = false,
}: OnboardingBadgeProps) {
  const iconName = icon === "shield" ? "shield-check" : "star-four-points";

  if (compact) {
    return (
      <View
        className="flex-row items-center self-center rounded-full border border-[#FFF0E3] bg-[#fff0e3cb]"
        style={{
          height: onboardingSpacing.badgeHeight,
          paddingHorizontal: onboardingSpacing.badgePaddingH,
          gap: onboardingSpacing.badgeIconGap,
        }}
      >
        <MaterialCommunityIcons name={iconName} size={16} color="#ff7a00" />
        <Text
          className="text-[12px] text-foxi-orange"
          style={{ fontFamily: "Poppins_600SemiBold" }}
        >
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-1.5 self-center rounded-full border border-[#FFC98A] bg-[#FFF0E3] px-3.5 py-1.5">
      <MaterialCommunityIcons name={iconName} size={14} color="#ff7a00" />
      <Text
        className="text-[12px] text-foxi-orange"
        style={{ fontFamily: "Poppins_600SemiBold" }}
      >
        {label}
      </Text>
    </View>
  );
}
