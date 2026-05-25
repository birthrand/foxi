import { Text, View } from "react-native";

import { LessonCard } from "@/components/learn/lesson-card";
import { LessonTimelineNode } from "@/components/learn/lesson-timeline-node";
import { getLessonRowMinHeight, learnSpace, learnSpacing } from "@/constants/learn-spacing";
import type { LearnUnitSection as LearnUnitSectionData } from "@/lib/learn-data";

type LearnUnitSectionProps = {
  section: LearnUnitSectionData;
  onLessonPress?: (lessonId: string) => void;
};

export function LearnUnitSection({
  section,
  onLessonPress,
}: LearnUnitSectionProps) {
  const { unit, lessons, completedCount } = section;
  const isUnitComplete = completedCount === lessons.length && lessons.length > 0;

  return (
    <View>
      <View
        className="flex-row items-center justify-between"
        style={{ marginBottom: learnSpacing.unitHeaderToLessons }}
      >
        <View className="min-w-0 flex-1">
          <Text
            className="text-deep-navy"
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 15,
              lineHeight: 20,
            }}
          >
            Unit {unit.number} · {unit.title}
          </Text>
          {/* <Text
            className="text-secondary"
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              lineHeight: 16,
              marginTop: 2,
            }}
            numberOfLines={2}
          >
            {unit.description}
          </Text> */}
        </View>

        <View
          className="items-center justify-center"
          style={{
            marginLeft: learnSpace.sm,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: isUnitComplete ? "#DCFCE7" : "#FFF7ED",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 11,
              lineHeight: 14,
              color: isUnitComplete ? "#16A34A" : "#64748B",
            }}
          >
            {completedCount}/{lessons.length}
          </Text>
        </View>
      </View>

      <View style={{ gap: learnSpacing.lessonRowGap }}>
        {lessons.map((item, index) => {
          const nextItem = lessons[index + 1];
          const rowMinHeight = getLessonRowMinHeight(item.status);

          return (
            <View
              key={item.lesson.id}
              className="flex-row items-start"
              style={{
                gap: learnSpacing.timelineToCardGap,
                minHeight: rowMinHeight,
              }}
            >
              <LessonTimelineNode
                number={item.lesson.number}
                status={item.status}
                isLast={index === lessons.length - 1}
                nextStatus={nextItem?.status}
                rowMinHeight={rowMinHeight}
              />

              <View className="flex-1">
                <LessonCard
                  item={item}
                  onPress={() => onLessonPress?.(item.lesson.id)}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
