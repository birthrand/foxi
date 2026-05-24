import { Text, View } from "react-native";

import { LESSON_BEIGE, lessonSpacing } from "@/constants/lesson-spacing";

type LessonProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

export function LessonProgressBar({
  currentStep,
  totalSteps,
}: LessonProgressBarProps) {
  const progressPercent =
    totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  return (
    <View className="flex-row items-center mt-2 ml-3" style={{ gap: 10 }}>
      <View
        className="flex-1"
        style={{
          height: lessonSpacing.progressBarHeight,
          borderRadius: lessonSpacing.progressBarHeight / 2,
          backgroundColor: LESSON_BEIGE,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${progressPercent}%`,
            height: "100%",
            borderRadius: lessonSpacing.progressBarHeight / 2,
            backgroundColor: "#ff7a00",
          }}
        />
      </View>

      <Text
        className="text-secondary"
        style={{
          fontFamily: "Poppins_400Regular",
          fontSize: 12,
          lineHeight: 16,
          minWidth: 42,
        }}
      >
        {currentStep} of {totalSteps}
      </Text>
    </View>
  );
}
