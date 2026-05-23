import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

export function OnboardingFeatureCard() {
  return (
    <View
      className="w-full flex-row items-center gap-4 rounded-3xl bg-white px-5 py-4"
      style={{
        shadowColor: "#0d132b",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 3,
      }}
    >
      <View className="relative h-[60px] w-[60px] items-center justify-center rounded-full bg-[#FFE8D1]">
        <Ionicons name="clipboard-outline" size={30} color="#c46a2b" />
        <View className="absolute -bottom-0.5 -right-0.5 h-5 w-5 items-center justify-center rounded-full bg-foxi-orange">
          <Ionicons name="checkmark" size={12} color="#ffffff" />
        </View>
      </View>
      <View className="flex-1 pr-1">
        <Text
          className="text-[17px] leading-6 text-deep-navy"
          style={{ fontFamily: "Poppins_700Bold" }}
        >
          Personalized for you
        </Text>
        <Text
          className="mt-0.5 text-[13px] leading-[18px] text-secondary"
          style={{ fontFamily: "Poppins_400Regular" }}
        >
          Lessons that match your level, goals, and interests.
        </Text>
      </View>
    </View>
  );
}
