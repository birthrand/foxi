import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import { profileSpacing } from "@/constants/profile-spacing";

const SIGN_OUT_RED = "#EF4444";

type ProfileSignOutButtonProps = {
  onPress: () => void;
};

export function ProfileSignOutButton({ onPress }: ProfileSignOutButtonProps) {
  return (
    <View>
      <View
        style={{
          height: 1,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        }}
      />

      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
        className="flex-row items-center active:opacity-80"
        style={{
          paddingVertical: profileSpacing.menuItemPaddingV,
        }}
      >
        <View
          className="items-start justify-center"
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
          }}
        >
          <Ionicons
            name="log-out-outline"
            size={profileSpacing.menuIconSize}
            color={SIGN_OUT_RED}
          />
        </View>

        <Text
          style={{
            flex: 1,
            fontFamily: "Poppins_400Regular",
            fontSize: 16,
            lineHeight: 22,
            color: SIGN_OUT_RED,
          }}
        >
          Sign out
        </Text>
      </Pressable>
    </View>
  );
}
