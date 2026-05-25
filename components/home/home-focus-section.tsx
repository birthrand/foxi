import { useMemo } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";

import { HomeFocusCard } from "@/components/home/home-focus-card";
import { HomeSectionHeader } from "@/components/home/home-section-header";
import { homeSpacing } from "@/constants/home-spacing";
import type { FocusItem } from "@/lib/home-data";

type HomeFocusSectionProps = {
  items: FocusItem[];
  onItemPress?: (item: FocusItem) => void;
};

export function HomeFocusSection({
  items,
  onItemPress,
}: HomeFocusSectionProps) {
  const { width: screenWidth } = useWindowDimensions();

  const cardWidth = useMemo(
    () => Math.min(280, Math.round(screenWidth * 0.72)),
    [screenWidth],
  );

  const snapInterval =
    cardWidth + homeSpacing.focusStreamingCardGap + homeSpacing.screenPadding;

  return (
    <View style={{ marginTop: homeSpacing.continueToFocus }}>
      <HomeSectionHeader title="Today's plan" titleFontSize={16} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={snapInterval}
        snapToAlignment="start"
        contentContainerStyle={{
          paddingTop: homeSpacing.sectionHeaderToCards,
          paddingRight: homeSpacing.screenPadding,
          gap: homeSpacing.focusStreamingCardGap,
        }}
        style={{
          marginHorizontal: -homeSpacing.screenPadding,
          paddingLeft: homeSpacing.screenPadding,
        }}
      >
        {items.map((item) => (
          <HomeFocusCard
            key={item.id}
            item={item}
            width={cardWidth}
            onPress={
              onItemPress ? () => onItemPress(item) : undefined
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
