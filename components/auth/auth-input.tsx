import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, TextInput, View } from "react-native";

import { authSpacing } from "@/constants/auth-spacing";

type AuthInputIcon = "person" | "mail" | "lock-closed";

type AuthInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: AuthInputIcon;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  onToggleSecureEntry?: () => void;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "words";
};

const iconMap: Record<AuthInputIcon, keyof typeof Ionicons.glyphMap> = {
  person: "person-outline",
  mail: "mail-outline",
  "lock-closed": "lock-closed-outline",
};

export function AuthInput({
  placeholder,
  value,
  onChangeText,
  icon = "mail",
  secureTextEntry = false,
  showPasswordToggle = false,
  onToggleSecureEntry,
  keyboardType = "default",
  autoCapitalize = "none",
}: AuthInputProps) {
  return (
    <View
      className="flex-row items-center border border-[#E8E2DA] bg-white px-3.5"
      style={{
        height: authSpacing.fieldHeight,
        borderRadius: authSpacing.fieldRadius,
      }}
    >
      <Ionicons name={iconMap[icon]} size={20} color="#ff7a00" />
      <TextInput
        className="ml-2.5 flex-1 text-[15px] text-[#2D2419]"
        style={{ fontFamily: "Poppins_400Regular" }}
        placeholder={placeholder}
        placeholderTextColor="#A8A29E"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
      {showPasswordToggle ? (
        <Pressable
          onPress={onToggleSecureEntry}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Toggle password visibility"
        >
          <Ionicons
            name={secureTextEntry ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#A8A29E"
          />
        </Pressable>
      ) : null}
    </View>
  );
}
