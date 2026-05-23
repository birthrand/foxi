import { Pressable, Text } from "react-native";

import { onboardingSpacing } from "@/constants/onboarding-spacing";

type OnboardingAccountLinkProps = {
  label: string;
  onPress?: () => void;
  specSized?: boolean;
};

export function OnboardingAccountLink({
  label,
  onPress,
  specSized = true,
}: OnboardingAccountLinkProps) {
  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center active:opacity-70"
      accessibilityRole="button"
      style={{
        minHeight: specSized ? onboardingSpacing.secondaryMinHeight : undefined,
        marginTop: specSized ? onboardingSpacing.buttonToSecondary : 10,
      }}
    >
      <Text
        className="text-center text-[15px] text-foxi-orange"
        style={{ fontFamily: "Poppins_500Medium" }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
