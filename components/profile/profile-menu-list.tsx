import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import { profileSpace, profileSpacing } from "@/constants/profile-spacing";
import type { ProfileMenuItem } from "@/lib/profile-data";

type ProfileMenuListProps = {
  items: ProfileMenuItem[];
  onItemPress?: (itemId: string) => void;
};

function getMenuIconName(
  icon: ProfileMenuItem["icon"],
): keyof typeof Ionicons.glyphMap {
  switch (icon) {
    case "flag":
      return "flag-outline";
    case "bookmark":
      return "bookmark-outline";
    case "trophy":
      return "trophy-outline";
    case "notifications":
      return "notifications-outline";
    case "settings":
      return "settings-outline";
    default:
      return "ellipse-outline";
  }
}

export function ProfileMenuList({ items, onItemPress }: ProfileMenuListProps) {
  return (
    <View
      className="overflow-hidden"
      style={{
        marginTop: profileSpacing.levelToMenu,
        
      }}
    >
      {items.map((item, index) => (
        <View key={item.id}>
          <Pressable
            onPress={() => onItemPress?.(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}, ${item.subtitle}`}
            className="flex-row items-center active:opacity-80"
            style={{
              // paddingHorizontal: profileSpacing.menuItemPaddingH,
              paddingVertical: profileSpacing.menuItemPaddingV,
              // gap: profileSpace.sm,
            }}
          >
            <View
              className="items-start justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: profileSpace.xs,
                // backgroundColor: "#fff3e0",
              }}
            >
              <Ionicons
                name={getMenuIconName(item.icon)}
                size={profileSpacing.menuIconSize}
                color="#0d132b"
              />
            </View>

            <View className="min-w-0 flex-1">
              <Text
                className="text-deep-navy"
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 16,
                  lineHeight: 22,
                }}
              >
                {item.title}
              </Text>
              {/* <Text
                className="text-secondary"
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  lineHeight: 16,
                  marginTop: 2,
                }}
                numberOfLines={1}
              >
                {item.subtitle}
              </Text> */}
            </View>

            <Ionicons
              name="chevron-forward"
              size={profileSpacing.headerChevronSize}
              color="#94a3b8"
            />
          </Pressable>

          {index < items.length - 1 ? (
            <View
              style={{
                height: 1,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                
              }}
            />
          ) : null}
        </View>
      ))}
    </View>
  );
}
