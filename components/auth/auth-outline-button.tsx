import { Pressable, Text } from "react-native";

import { onboardingSpacing } from "@/constants/onboarding-spacing";

type AuthOutlineButtonProps = {
  label: string;
  onPress: () => void;
};

export function AuthOutlineButton({ label, onPress }: AuthOutlineButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full items-center justify-center border-2 border-foxi-orange bg-white active:opacity-90"
      style={{
        height: onboardingSpacing.buttonHeight,
        borderRadius: onboardingSpacing.buttonRadius,
      }}
    >
      <Text
        className="text-[17px] text-foxi-orange"
        style={{ fontFamily: "Poppins_700Bold" }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
