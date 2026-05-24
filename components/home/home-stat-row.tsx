import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { Text, View } from "react-native";

import { homeSpace, homeSpacing } from "@/constants/home-spacing";
import type { HomeStats } from "@/lib/home-data";

type HomeStatRowProps = {
  stats: HomeStats;
};

export function HomeStatRow({ stats }: HomeStatRowProps) {
  return (
    <View
      className="flex-row items-center self-start"
      style={{
        gap: homeSpacing.statChipGap,
        marginTop: homeSpacing.headerToStats,
        maxWidth: "58%",
      }}
    >
      <View
        className="flex-row items-center bg-white"
        style={{
          paddingHorizontal: homeSpacing.statChipPaddingH,
          paddingVertical: homeSpacing.statChipPaddingV,
          borderRadius: homeSpacing.statChipRadius,
          gap: homeSpace.xs,
          shadowColor: "#0d132b",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 3,
        }}
      >
        {/* <MaterialCommunityIcons name="target" size={18} color="#ff7a00" /> */}
        <Octicons name="goal" size={28} color="#ff7a00" />

        <View>
          <Text
            className="text-secondary"
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 14,
            }}
          >
            Daily Goal
          </Text>
          <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 12 }}>
            <Text className="text-foxi-orange">
              {stats.dailyMinutesStudied}
            </Text>
            <Text className="text-secondary">
              {" "}
              / {stats.dailyGoalMinutes} min
            </Text>
          </Text>
        </View>
      </View>

      <View
        style={{ marginLeft: homeSpacing.statStreakOffset }}
        className="items-start"
      >
        <View className="flex-row items-center">
          <Ionicons name="flame" size={22} color="#ff7a00" />
          <Text
            className="text-foxi-orange"
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 18,
            }}
          >
            {stats.streakDays}
          </Text>
        </View>
        <Text
          className="text-secondary"
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 12,
            lineHeight: 16,
          }}
        >
          Day streak
        </Text>
      </View>
    </View>
  );
}
