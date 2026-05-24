import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import {
  LESSON_BEIGE,
  lessonSpacing,
} from "@/constants/lesson-spacing";
import { formatPhonetic } from "@/lib/lesson-screen-data";
import type { VocabularyItem } from "@/types/learning";

type LessonWordCardProps = {
  item: VocabularyItem;
  onListen?: () => void;
};

export function LessonWordCard({ item, onListen }: LessonWordCardProps) {
  const phonetic = formatPhonetic(item.phonetic);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.word}, ${item.translation}`}
      onPress={onListen}
      className="active:opacity-90"
      style={{
        width: lessonSpacing.wordCardWidth,
        minHeight: lessonSpacing.wordCardMinHeight,
        borderRadius: lessonSpacing.wordCardRadius,
        backgroundColor: LESSON_BEIGE,
        padding: lessonSpacing.wordCardPadding,
      }}
    >
      <Text
        className="text-deep-navy"
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 18,
          lineHeight: 24,
        }}
        numberOfLines={2}
      >
        {item.word}
      </Text>

      {phonetic ? (
        <Text
          className="text-secondary"
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 13,
            lineHeight: 18,
            marginTop: 6,
          }}
          numberOfLines={1}
        >
          {phonetic}
        </Text>
      ) : null}

      <View className="mt-auto flex-row items-end justify-between">
        <Text
          className="text-deep-navy"
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 14,
            lineHeight: 20,
            flex: 1,
            paddingRight: 6,
          }}
          numberOfLines={2}
        >
          {item.translation}
        </Text>

        <Ionicons name="volume-high" size={18} color="#ff7a00" />
      </View>
    </Pressable>
  );
}
