import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import { homeSpace, homeSpacing } from "@/constants/home-spacing";

type HomeHeaderProps = {
  greeting: string;
  userName: string;
  subtitle: string;
};

export function HomeHeader({ greeting, userName, subtitle }: HomeHeaderProps) {
  return (
    <View className="relative">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        className="items-center justify-center self-end bg-white active:opacity-80"
        style={{
          width: homeSpacing.notificationButtonSize,
          height: homeSpacing.notificationButtonSize,
          borderRadius: homeSpacing.notificationRadius,
          shadowColor: "#0d132b",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <Ionicons name="notifications-outline" size={22} color="#0d132b" />
        <View
          className="absolute bg-foxi-orange"
          style={{
            top: homeSpacing.notificationDotOffset + homeSpace.xs / 2,
            right: homeSpacing.notificationDotOffset + (homeSpace.xs + 2) / 2,
            width: homeSpace.xs,
            height: homeSpace.xs,
            borderRadius: homeSpace.xs / 2,
          }}
        />
      </Pressable>
      <View className="flex-row items-start justify-between">
        <View
          className="min-w-0 flex-1"
          style={{ paddingRight: homeSpacing.headerTextToActions }}
        >
          <Text
            className="text-deep-navy"
            style={{
              fontFamily: "Poppins_700",
              fontSize: 25,
              lineHeight: 28,
            }}
            numberOfLines={2}
          >
            {greeting}, {userName}!
          </Text>
          <Text
            className="text-secondary"
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              marginTop: homeSpacing.headerTitleToSubtitle,
            }}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      {/* <Image
        source={images.mascotLogo1Orange}
        accessibilityLabel="Foxi mascot"
        resizeMode="contain"
        style={{
          position: "absolute",
          right: -8,
          top: 36,
          width: homeSpacing.mascotWidth,
          height: homeSpacing.mascotWidth,
          zIndex: 1,
        }}
      /> */}
    </View>
  );
}
