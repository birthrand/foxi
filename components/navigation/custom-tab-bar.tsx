import Ionicons from "@expo/vector-icons/Ionicons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TAB_BAR, TAB_ITEMS } from "@/constants/tab-navigation";

const SPRING_CONFIG = {
  damping: 22,
  stiffness: 220,
  mass: 0.8,
};

function getTabConfig(routeName: string) {
  return TAB_ITEMS.find((item) => item.route === routeName);
}

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const tabCenters = useRef<number[]>([]);
  const circleX = useSharedValue(0);

  const handleTabLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    tabCenters.current[index] = x + width / 2;

    if (index === state.index) {
      circleX.value = tabCenters.current[index] - TAB_BAR.circleSize / 2;
    }
  };

  useEffect(() => {
    const centerX = tabCenters.current[state.index];
    if (centerX == null) {
      return;
    }

    circleX.value = withSpring(centerX - TAB_BAR.circleSize / 2, SPRING_CONFIG);
  }, [circleX, state.index]);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: circleX.value }],
  }));

  const handlePress = (routeName: string, isFocused: boolean) => {
    const event = navigation.emit({
      type: "tabPress",
      target: routeName,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      if (process.env.EXPO_OS === "ios") {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      navigation.navigate(routeName);
    }
  };

  return (
    <View
      className="bg-white"
      style={{
        paddingTop: TAB_BAR.barPaddingTop,
        paddingBottom: Math.max(insets.bottom - 36, 4),
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        boxShadow: "0 -4px 16px rgba(13, 19, 43, 0.06)",
      }}
    >
      <View className="relative flex-row">
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              width: TAB_BAR.circleSize,
              height: TAB_BAR.circleSize,
              borderRadius: TAB_BAR.circleSize / 2,
              backgroundColor: "#ff7a00",
            },
            animatedCircleStyle,
          ]}
        />

        {state.routes.map((route, index) => {
          const config = getTabConfig(route.name);
          const isFocused = state.index === index;

          if (!config) {
            return null;
          }

          const iconName = isFocused ? config.activeIcon : config.icon;
          const iconColor = isFocused ? "#ffffff" : "#0d132b";

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={config.label}
              onPress={() => handlePress(route.name, isFocused)}
              onLayout={(event) => handleTabLayout(index, event)}
              className="flex-1 items-center active:opacity-80"
              style={{
                minHeight:
                  TAB_BAR.circleSize +
                  TAB_BAR.labelLineHeight +
                  TAB_BAR.iconToLabelGap,
              }}
            >
              <View
                className="items-center justify-center"
                style={{
                  width: TAB_BAR.circleSize,
                  height: TAB_BAR.circleSize,
                }}
              >
                <Ionicons
                  name={iconName}
                  size={TAB_BAR.iconSize}
                  color={iconColor}
                />
              </View>

              {!isFocused ? (
                <Text
                  className="text-deep-navy"
                  style={{
                    marginTop: TAB_BAR.inactiveLabelMarginTop,
                    fontFamily: "Poppins_500Medium",
                    fontSize: TAB_BAR.labelFontSize,
                    lineHeight: TAB_BAR.labelLineHeight,
                  }}
                  numberOfLines={1}
                >
                  {config.label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
