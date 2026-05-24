import { ScrollView, View } from "react-native";

import { HomeSectionHeader } from "@/components/home/home-section-header";
import { LessonWordCard } from "@/components/lesson/lesson-word-card";
import { lessonSpacing } from "@/constants/lesson-spacing";
import type { VocabularyItem } from "@/types/learning";

type TodaysWordsSectionProps = {
  words: VocabularyItem[];
  onViewAll?: () => void;
  onWordPress?: (wordId: string) => void;
};

export function TodaysWordsSection({
  words,
  onViewAll,
  onWordPress,
}: TodaysWordsSectionProps) {
  if (words.length === 0) {
    return null;
  }

  return (
    <View style={{ marginTop: lessonSpacing.progressToWords }}>
      <HomeSectionHeader title="Today's words" onSeeAll={onViewAll} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: lessonSpacing.wordCardGap,
          gap: lessonSpacing.wordCardGap,
        }}
      >
        {words.map((word) => (
          <LessonWordCard
            key={word.id}
            item={word}
            onListen={() => onWordPress?.(word.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
