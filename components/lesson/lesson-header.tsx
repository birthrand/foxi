import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import { LESSON_BEIGE, lessonSpacing } from "@/constants/lesson-spacing";

type LessonHeaderProps = {
  title: string;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
};

function HeaderProgressBar({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const progressPercent =
    totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  return (
    <View
      style={{
        width: lessonSpacing.headerProgressWidth,
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
  );
}

export function LessonHeader({
  title,
  currentStep,
  totalSteps,
  onBack,
}: LessonHeaderProps) {
  return (
    <View className="relative flex-row items-center" style={{ minHeight: 40 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        className="active:opacity-70"
        hitSlop={8}
        style={{ width: 32, zIndex: 1 }}
      >
        <Ionicons name="arrow-back" size={24} color="#0d132b" />
      </Pressable>

      <Text
        className="text-deep-navy"
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "Poppins_600SemiBold",
          fontSize: 16,
          lineHeight: 22,
        }}
        numberOfLines={1}
      >
        {title}
      </Text>

      <View
        className="ml-auto flex-row items-center"
        style={{ gap: 6, zIndex: 1 }}
      >
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
    </View>
  );
}
