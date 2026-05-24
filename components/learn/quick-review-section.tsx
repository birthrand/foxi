import { ScrollView, View } from "react-native";

import { HomeSectionHeader } from "@/components/home/home-section-header";
import { QuickReviewCard } from "@/components/learn/quick-review-card";
import { learnSpacing } from "@/constants/learn-spacing";
import type { QuickReviewItem } from "@/lib/learn-data";

type QuickReviewSectionProps = {
  items: QuickReviewItem[];
  onSeeAll?: () => void;
  onItemPress?: (lessonId: string) => void;
};

export function QuickReviewSection({
  items,
  onSeeAll,
  onItemPress,
}: QuickReviewSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={{ marginTop: learnSpacing.lessonsToReview }}>
      <HomeSectionHeader
        title="Quick Review"
        seeAllLabel="View all"
        onSeeAll={onSeeAll}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: learnSpacing.sectionHeaderToContent,
          gap: learnSpacing.reviewCardGap,
        }}
      >
        {items.map((item) => (
          <QuickReviewCard
            key={item.id}
            item={item}
            onPress={() => onItemPress?.(item.lessonId)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
