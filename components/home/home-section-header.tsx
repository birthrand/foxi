import { Pressable, Text, View } from "react-native";

import { homeSpace } from "@/constants/home-spacing";

type HomeSectionHeaderProps = {
  title: string;
  onSeeAll?: () => void;
  seeAllLabel?: string;
  seeAllColor?: string;
};

export function HomeSectionHeader({
  title,
  onSeeAll,
  seeAllLabel = "View all",
  seeAllColor = "#ff7a00",
}: HomeSectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text
        className="text-deep-navy"
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 16,
          lineHeight: 22,
        }}
      >
        {title}
      </Text>

      {onSeeAll ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View all ${title}`}
          onPress={onSeeAll}
          className="active:opacity-70"
          hitSlop={homeSpace.xs}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              color: seeAllColor,
            }}
          >
            {seeAllLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
