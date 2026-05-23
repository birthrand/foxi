import { Pressable, Text } from "react-native";

import { GoogleLogo } from "@/components/auth/google-logo";
import { authSpacing } from "@/constants/auth-spacing";

type AuthGoogleButtonProps = {
  onPress?: () => void;
  disabled?: boolean;
};

export function AuthGoogleButton({
  onPress,
  disabled = false,
}: AuthGoogleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="w-full flex-row items-center justify-center border border-[#E8E2DA] bg-white active:opacity-90"
      style={{
        height: authSpacing.fieldHeight,
        borderRadius: authSpacing.fieldRadius,
        gap: 10,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <GoogleLogo size={22} />
      <Text
        className="text-[15px] text-[#2D2419]"
        style={{ fontFamily: "Poppins_600SemiBold" }}
      >
        Continue with Google
      </Text>
    </Pressable>
  );
}
