import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

type AuthTermsCheckboxProps = {
  checked: boolean;
  onToggle: () => void;
};

export function AuthTermsCheckbox({
  checked,
  onToggle,
}: AuthTermsCheckboxProps) {
  return (
    <Pressable
      onPress={onToggle}
      className="flex-row items-start gap-2.5 active:opacity-80"
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View
        className="mt-0.5 items-center justify-center rounded-md border-2"
        style={{
          width: 22,
          height: 22,
          borderColor: checked ? "#ff7a00" : "#D6D3D1",
          backgroundColor: checked ? "#ff7a00" : "#ffffff",
        }}
      >
        {checked ? <Ionicons name="checkmark" size={14} color="#ffffff" /> : null}
      </View>
      <Text
        className="flex-1 text-[13px] leading-5 text-[#78716C]"
        style={{ fontFamily: "Poppins_400Regular" }}
      >
        I agree to the{" "}
        <Text className="text-foxi-orange" style={{ fontFamily: "Poppins_600SemiBold" }}>
          Terms of Service
        </Text>{" "}
        and{" "}
        <Text className="text-foxi-orange" style={{ fontFamily: "Poppins_600SemiBold" }}>
          Privacy Policy
        </Text>
      </Text>
    </Pressable>
  );
}
