import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

import {
  LESSON_CARD_SHADOW,
  lessonSpacing,
} from "@/constants/lesson-spacing";

type LessonConversationProgressProps = {
  completedExchanges: number;
  totalExchanges: number;
  isComplete?: boolean;
  isAwaitingFinalFeedback?: boolean;
};

export function LessonConversationProgress({
  completedExchanges,
  totalExchanges,
  isComplete = false,
  isAwaitingFinalFeedback = false,
}: LessonConversationProgressProps) {
  const safeTotal = Math.max(totalExchanges, 1);
  const progressLabel = isComplete
    ? "Lesson complete!"
    : isAwaitingFinalFeedback
      ? "Wrapping up..."
      : "Conversation Progress";

  return (
    <View
      className="flex-row items-center bg-white"
      style={{
        marginTop: lessonSpacing.actionsToProgress,
        borderRadius: lessonSpacing.cardRadius,
        paddingHorizontal: lessonSpacing.cardPadding,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: "#F3F4F6",
        gap: 12,
        ...LESSON_CARD_SHADOW,
      }}
    >
      <Ionicons name="trophy" size={22} color="#ff7a00" />

      <View className="flex-1">
        <Text
          className="text-deep-navy"
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 13,
            lineHeight: 18,
            marginBottom: 8,
            color: isComplete ? "#16a34a" : undefined,
          }}
        >
          {progressLabel}
        </Text>

        <View className="flex-row" style={{ gap: lessonSpacing.segmentGap }}>
          {Array.from({ length: safeTotal }).map((_, index) => {
            const isFilled = index < completedExchanges;

            return (
              <View
                key={index}
                className="flex-1"
                style={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: isFilled ? "#ff7a00" : "#F3F4F6",
                }}
              />
            );
          })}
        </View>
      </View>

      <View className="items-end" style={{ gap: 4 }}>
        <Text
          className="text-secondary"
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 12,
            lineHeight: 16,
          }}
        >
          {completedExchanges} / {safeTotal} exchanges
        </Text>
        <View
          className="items-center justify-center"
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            backgroundColor: "#FFF7ED",
          }}
        >
          <Ionicons name="shield" size={16} color="#ff7a00" />
        </View>
      </View>
    </View>
  );
}
