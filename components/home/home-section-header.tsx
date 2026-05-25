import { Pressable, Text, View } from "react-native";

import { homeSpace } from "@/constants/home-spacing";

type HomeSectionHeaderProps = {
  title: string;
  onSeeAll?: () => void;
  seeAllLabel?: string;
  seeAllColor?: string;
  titleFontSize?: number;
  seeAllFontSize?: number;
};

export function HomeSectionHeader({
  title,
  onSeeAll,
  seeAllLabel = "View all",
  seeAllColor = "#ff7a00",
  titleFontSize = 16,
  seeAllFontSize = 14,
}: HomeSectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between -mb-2">
      <Text
        className="text-secondary"
        style={{
          fontFamily:
            titleFontSize >= 20
              ? "Poppins_600SemiBold"
              : "Poppins_500Medium",
          fontSize: titleFontSize,
          lineHeight: titleFontSize + 6,
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
              fontSize: seeAllFontSize,
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
