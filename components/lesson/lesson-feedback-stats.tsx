import { Text, View } from "react-native";

import { LESSON_CARD_SHADOW, lessonSpacing } from "@/constants/lesson-spacing";

type FeedbackStat = {
  label: string;
  rating: string;
  color: string;
};

const FEEDBACK_STATS: FeedbackStat[] = [
  { label: "Speaking", rating: "Excellent", color: "#22c55e" },
  { label: "Pronunciation", rating: "Great", color: "#3b82f6" },
  { label: "Grammar", rating: "Good", color: "#ff7a00" },
];

function FeedbackDivider() {
  return (
    <View
      style={{
        width: 1,
        alignSelf: "center",
        height: 40,
        backgroundColor: "#E5E7EB",
      }}
    />
  );
}

function FeedbackStatColumn({ label, rating, color }: FeedbackStat) {
  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ paddingVertical: 20 }}
    >
      <Text
        className="text-deep-navy"
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 15,
          lineHeight: 20,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 14,
          lineHeight: 20,
          color,
          marginTop: 6,
        }}
      >
        {rating}
      </Text>
    </View>
  );
}

export function LessonFeedbackStats() {
  return (
    <View
      style={{
        marginTop: lessonSpacing.wordsToFeedback,
        borderRadius: lessonSpacing.feedbackCardRadius,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        ...LESSON_CARD_SHADOW,
      }}
    >
      <FeedbackStatColumn {...FEEDBACK_STATS[0]} />
      <FeedbackDivider />
      <FeedbackStatColumn {...FEEDBACK_STATS[1]} />
      <FeedbackDivider />
      <FeedbackStatColumn {...FEEDBACK_STATS[2]} />
    </View>
  );
}
