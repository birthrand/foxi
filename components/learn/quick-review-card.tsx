import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { LEARN_CARD_SHADOW, learnSpacing } from "@/constants/learn-spacing";
import type { QuickReviewItem } from "@/lib/learn-data";

type QuickReviewCardProps = {
  item: QuickReviewItem;
  onPress?: () => void;
};

function ProgressRing({ percent }: { percent: number }) {
  return (
    <View
      className="items-center justify-center"
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: "#ff7a00",
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: percent > 0 ? "#ff7a00" : "transparent",
        }}
      />
    </View>
  );
}

export function QuickReviewCard({ item, onPress }: QuickReviewCardProps) {
  const subtitle = item.completed
    ? `${item.wordCount} words`
    : item.progressPercent > 0
      ? `${item.progressPercent}%`
      : "0%";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Review ${item.title}, ${subtitle}`}
      onPress={onPress}
      className="active:opacity-90"
      style={{
        width: learnSpacing.reviewCardWidth,
        borderRadius: learnSpacing.reviewCardRadius,
        backgroundColor: "#FFFFFF",
        padding: learnSpacing.reviewCardPadding,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        ...LEARN_CARD_SHADOW,
      }}
    >
      <Image
        source={{ uri: item.imageUrl }}
        accessibilityLabel={`${item.title} review thumbnail`}
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          backgroundColor: "#F3F4F6",
        }}
        contentFit="cover"
      />

      <Text
        className="text-deep-navy"
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 13,
          lineHeight: 18,
          marginTop: 8,
        }}
        numberOfLines={2}
      >
        {item.title}
      </Text>

      <View className="mt-1 flex-row items-center justify-between">
        <Text
          className="text-secondary"
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 12,
            lineHeight: 16,
          }}
        >
          {subtitle}
        </Text>

        {item.completed ? (
          <View
            className="items-center justify-center"
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: "#22c55e",
            }}
          >
            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
          </View>
        ) : (
          <ProgressRing percent={item.progressPercent} />
        )}
      </View>
    </Pressable>
  );
}
