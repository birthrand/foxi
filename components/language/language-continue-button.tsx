import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import { onboardingSpacing } from "@/constants/onboarding-spacing";

type LanguageContinueButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

export function LanguageContinueButton({
  onPress,
  disabled = false,
}: LanguageContinueButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Continue"
      accessibilityState={{ disabled }}
      className="w-full items-center justify-center bg-foxi-orange active:opacity-90"
      style={{
        height: onboardingSpacing.buttonHeight,
        borderRadius: onboardingSpacing.buttonRadius,
        boxShadow: disabled
          ? "none"
          : "0 6px 12px rgba(138, 61, 0, 0.2)",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <View className="flex-row items-center justify-center gap-2">
        <Text
          className="text-[17px] text-white"
          style={{ fontFamily: "Poppins_700Bold" }}
        >
          Continue
        </Text>
        <Ionicons name="arrow-forward" size={20} color="#ffffff" />
      </View>
    </Pressable>
  );
}
