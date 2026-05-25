import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

import {
  PROFILE_CARD_SHADOW,
  profileSpace,
  profileSpacing,
} from "@/constants/profile-spacing";
import type { ProfileStatCard } from "@/lib/profile-data";

type ProfileStatCardsProps = {
  stats: ProfileStatCard[];
};

function getStatIconName(
  icon: ProfileStatCard["icon"],
): keyof typeof Ionicons.glyphMap {
  switch (icon) {
    case "flame":
      return "flame";
    case "time":
      return "time-outline";
    case "star":
      return "star";
    case "book":
      return "book-outline";
    default:
      return "ellipse-outline";
  }
}

export function ProfileStatCards({ stats }: ProfileStatCardsProps) {
  return (
    <View
      className="flex-row"
      style={{
        gap: profileSpacing.statCardGap,
        marginTop: profileSpacing.headerToStats,
      }}
    >
      {stats.map((stat) => (
        <View
          key={stat.id}
          className="flex-1 items-center bg-white"
          style={{
            borderRadius: profileSpacing.statCardRadius,
            paddingHorizontal: profileSpacing.statCardPaddingH,
            paddingVertical: profileSpacing.statCardPaddingV,
            ...PROFILE_CARD_SHADOW,
          }}
        >
          <Ionicons
            name={getStatIconName(stat.icon)}
            size={profileSpacing.statIconSize}
            color="#ff7a00"
          />

          <Text
            className="text-foxi-orange"
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 18,
              lineHeight: 24,
              marginTop: profileSpace.xs / 2,
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
          >
            {stat.value}
          </Text>

          <Text
            className="text-deep-navy"
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 11,
              lineHeight: 14,
              marginTop: 2,
              textAlign: "center",
            }}
            numberOfLines={1}
          >
            {stat.label}
          </Text>

          <Text
            className="text-secondary"
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 10,
              lineHeight: 12,
              marginTop: 2,
              textAlign: "center",
            }}
            numberOfLines={1}
          >
            {stat.sublabel}
          </Text>
        </View>
      ))}
    </View>
  );
}
