import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

import { onboardingSpace } from "@/constants/onboarding-spacing";

export function OnboardingLessonCard() {
  return (
    <View
      className="items-center rounded-2xl bg-white"
      style={{
        paddingHorizontal: onboardingSpace.sm,
        paddingVertical: onboardingSpace.sm,
        shadowColor: "#0d132b",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        minWidth: 80,
      }}
    >
      <View className="relative" style={{ marginBottom: onboardingSpace.xs }}>
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-info">
          <Ionicons name="book" size={20} color="#ffffff" />
        </View>
        <View className="absolute -right-1 -top-1 h-4 w-4 items-center justify-center rounded-full bg-success">
          <Ionicons name="checkmark" size={10} color="#ffffff" />
        </View>
      </View>
      <Text
        className="text-center text-[14px] text-deep-navy"
        style={{ fontFamily: "Poppins_700Bold" }}
      >
        Lesson 1
      </Text>
      <Text
        className="text-center text-[14px] text-foxi-orange"
        style={{ fontFamily: "Poppins_700Bold" }}
      >
        Completed!
      </Text>
    </View>
  );
}
