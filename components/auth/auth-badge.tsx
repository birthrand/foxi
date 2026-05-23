import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";

type AuthBadgeIcon = "account-plus" | "check-circle";

type AuthBadgeProps = {
  label: string;
  icon?: AuthBadgeIcon;
};

export function AuthBadge({ label, icon = "account-plus" }: AuthBadgeProps) {
  const iconName = icon === "check-circle" ? "check-circle" : "account-plus";

  return (
    <View
      className="flex-row items-center self-center rounded-full border border-[#FFF0E3] bg-[#FFF0E3]"
      style={{
        height: 36,
        paddingHorizontal: 14,
        gap: 6,
      }}
    >
      <MaterialCommunityIcons name={iconName} size={16} color="#ff7a00" />
      <Text
        className="text-[12px] text-foxi-orange"
        style={{ fontFamily: "Poppins_600SemiBold" }}
      >
        {label}
      </Text>
    </View>
  );
}
