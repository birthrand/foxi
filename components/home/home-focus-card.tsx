import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, Text, View } from "react-native";

import { homeSpacing } from "@/constants/home-spacing";
import type { FocusItem, FocusPlanType } from "@/lib/home-data";

type HomeFocusCardProps = {
  item: FocusItem;
  onPress?: () => void;
};

const PLAN_PURPLE = "#ff7a00";
const PLAN_CORAL = "#ff7a00";
const CHECKBOX_BORDER = "#D1D5DB";

function getPlanIcon(planType: FocusPlanType) {
  switch (planType) {
    case "lesson":
      return {
        backgroundColor: PLAN_PURPLE,
        icon: <Ionicons name="book" size={22} color="#FFFFFF" />,
      };
    case "ai-conversation":
      return {
        backgroundColor: PLAN_PURPLE,
        icon: <Ionicons name="headset" size={22} color="#FFFFFF" />,
      };
    case "new-words":
    default:
      return {
        backgroundColor: PLAN_CORAL,
        icon: <MaterialCommunityIcons name="ghost" size={22} color="#FFFFFF" />,
      };
  }
}

function PlanCheckbox({ completed }: { completed: boolean }) {
  return (
    <View
      className="items-center justify-center"
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: completed ? 0 : 2,
        borderColor: CHECKBOX_BORDER,
        backgroundColor: completed ? PLAN_PURPLE : "transparent",
      }}
    >
      {completed ? (
        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
      ) : null}
    </View>
  );
}

export function HomeFocusCard({ item, onPress }: HomeFocusCardProps) {
  const icon = getPlanIcon(item.planType);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.category}: ${item.topic}`}
      accessibilityState={{ checked: item.completed }}
      onPress={onPress}
      className="flex-row items-center active:opacity-80"
      style={{ gap: homeSpacing.focusIconToText }}
    >
      <View
        className="items-center justify-center rounded-2xl"
        style={{
          width: homeSpacing.focusIconSize,
          height: homeSpacing.focusIconSize,
          backgroundColor: icon.backgroundColor,
          borderWidth: 1,
          borderColor: "#ff7a00",
        }}
      >
        {icon.icon}
      </View>

      <View className="min-w-0 flex-1">
        <Text
          className="text-deep-navy"
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 15,
            lineHeight: 20,
          }}
        >
          {item.category}
        </Text>
        <Text
          className="text-secondary"
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 13,
            lineHeight: 18,
            marginTop: homeSpacing.focusCategoryToTopic,
          }}
          numberOfLines={1}
        >
          {item.topic}
        </Text>
      </View>

      <PlanCheckbox completed={item.completed} />
    </Pressable>
  );
}
