import { Pressable, Text, View } from "react-native";

import { homeSpacing, RECENT_VOCAB_SHADOW } from "@/constants/home-spacing";
import type { RecentVocabularyItem } from "@/lib/home-data";

type HomeRecentVocabularyCardProps = {
  items: RecentVocabularyItem[];
  onItemPress?: (item: RecentVocabularyItem) => void;
};

const CARD_BACKGROUND = "#FFF0E6";
const ROW_BACKGROUND = "#FFF0E6";
const FOXI_ORANGE = "#ff7a00";
const DIVIDER_COLOR = "#E5E7EB";

function VocabularyRow({
  item,
  onPress,
}: {
  item: RecentVocabularyItem;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.word}, ${item.translation}`}
      onPress={onPress}
      className="flex-row items-center active:opacity-95"
      style={{
        borderRadius: homeSpacing.vocabRowRadius,
        backgroundColor: ROW_BACKGROUND,
        paddingVertical: homeSpacing.vocabRowPaddingV,
        paddingHorizontal: homeSpacing.vocabRowPaddingH,
      }}
    >
      <Text
        className="text-deep-navy"
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 15,
          lineHeight: 20,
          minWidth: 72,
        }}
        numberOfLines={1}
      >
        {item.word}
      </Text>

      <View
        style={{
          width: 1,
          height: 20,
          backgroundColor: DIVIDER_COLOR,
          marginHorizontal: homeSpacing.vocabDividerMarginH,
        }}
      />

      <Text
        className="flex-1 text-deep-navy"
        style={{
          fontFamily: "Poppins_400Regular",
          fontSize: 15,
          lineHeight: 20,
        }}
        numberOfLines={1}
      >
        {item.translation}
      </Text>
    </Pressable>
  );
}

export function HomeRecentVocabularyCard({
  items,
  onItemPress,
}: HomeRecentVocabularyCardProps) {
  return (
    <View
      style={{
        borderRadius: homeSpacing.vocabCardRadius,
        backgroundColor: CARD_BACKGROUND,
        padding: homeSpacing.vocabCardPadding,
        ...RECENT_VOCAB_SHADOW,
      }}
    >
      <View style={{ gap: homeSpacing.vocabRowGap }}>
        {items.map((item) => (
          <VocabularyRow
            key={item.id}
            item={item}
            onPress={onItemPress ? () => onItemPress(item) : undefined}
          />
        ))}
      </View>
    </View>
  );
}
