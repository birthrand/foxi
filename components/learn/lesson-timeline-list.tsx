import { View } from "react-native";

import { HomeSectionHeader } from "@/components/home/home-section-header";
import { LearnUnitSection } from "@/components/learn/learn-unit-section";
import { learnSpacing } from "@/constants/learn-spacing";
import type { LearnUnitSection as LearnUnitSectionData } from "@/lib/learn-data";

type LessonTimelineListProps = {
  unitSections: LearnUnitSectionData[];
  onSeeAll?: () => void;
  onLessonPress?: (lessonId: string) => void;
};

export function LessonTimelineList({
  unitSections,
  onSeeAll,
  onLessonPress,
}: LessonTimelineListProps) {
  return (
    <View style={{ marginTop: learnSpacing.progressToLessons }}>
      <HomeSectionHeader
        title="Your Path"
        seeAllLabel="View all"
        onSeeAll={onSeeAll}
      />

      <View
        style={{
          gap: learnSpacing.unitSectionGap,
          marginTop: learnSpacing.sectionHeaderToContent,
        }}
      >
        {unitSections.map((section) => (
          <LearnUnitSection
            key={section.unit.id}
            section={section}
            onLessonPress={onLessonPress}
          />
        ))}
      </View>
    </View>
  );
}
