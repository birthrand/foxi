import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import {
  onboardingSpace,
  onboardingSpacing,
} from "@/constants/onboarding-spacing";

type OnboardingPrimaryButtonProps = {
  label: string;
  onPress: () => void;
  specSized?: boolean;
};

export function OnboardingPrimaryButton({
  label,
  onPress,
  specSized = true,
}: OnboardingPrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full items-center justify-center bg-foxi-orange active:opacity-90"
      style={{
        height: specSized ? onboardingSpacing.buttonHeight : undefined,
        borderRadius: specSized ? onboardingSpacing.buttonRadius : 16,
        paddingHorizontal: specSized ? 16 : 16,
        shadowColor: "#8a3d00",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
      }}
    >
      <View
        className="flex-row items-center justify-center"
        style={{ gap: onboardingSpace.sm }}
      >
        <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
          <Ionicons name="arrow-forward" size={22} color="#ff7a00" />
        </View>
        <Text
          className="text-[17px] text-white"
          style={{ fontFamily: "Poppins_700Bold" }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
