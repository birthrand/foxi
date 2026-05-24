import { getLessonWithLanguage } from "@/data/lessons";
import { getLessonScreenData } from "@/lib/lesson-screen-data";
import { useLearningProgressStore } from "@/store/learning-progress-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LessonActivityCard } from "@/components/lesson/lesson-activity-card";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { LessonFeedbackStats } from "@/components/lesson/lesson-feedback-stats";
import { LessonProgressBar } from "@/components/lesson/lesson-progress-bar";
import { TodaysWordsSection } from "@/components/lesson/todays-words-section";
import { lessonSpacing } from "@/constants/lesson-spacing";

export default function LessonDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = id ? getLessonWithLanguage(id) : undefined;
  const setLessonProgress = useLearningProgressStore(
    (state) => state.setLessonProgress,
  );
  const completeLesson = useLearningProgressStore(
    (state) => state.completeLesson,
  );

  const screenData = useMemo(
    () => (lesson ? getLessonScreenData(lesson) : null),
    [lesson],
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!lesson || !screenData || screenData.steps.length === 0) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: lessonSpacing.screenBackground }}
      >
        <View className="flex-1 items-center justify-center px-6">
          <Text
            className="text-deep-navy"
            style={{ fontFamily: "Poppins_600SemiBold", fontSize: 18 }}
          >
            Lesson not found
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            className="mt-4 active:opacity-80"
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 16,
                color: "#ff7a00",
              }}
            >
              Go back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const currentStep = screenData.steps[currentStepIndex];
  const currentStepNumber = currentStepIndex + 1;
  const isLastStep = currentStepNumber === screenData.totalSteps;

  const handleNext = () => {
    const progressPercent = Math.round(
      (currentStepNumber / screenData.totalSteps) * 100,
    );

    setLessonProgress(lesson.id, progressPercent);

    if (isLastStep) {
      completeLesson(lesson.id);
      router.back();
      return;
    }

    setCurrentStepIndex((previous) => previous + 1);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: lessonSpacing.screenBackground }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: lessonSpacing.screenPadding,
          paddingBottom: lessonSpacing.scrollBottomPadding,
        }}
      >
        <LessonHeader
          title={screenData.headerTitle}
          currentStep={currentStepNumber}
          totalSteps={screenData.totalSteps}
          onBack={handleBack}
        />

        <View style={{ marginTop: lessonSpacing.headerToCard }}>
          <LessonActivityCard
            step={currentStep}
            onNext={handleNext}
            isLastStep={isLastStep}
          />
        </View>

        <View style={{ marginTop: lessonSpacing.cardToProgress }}>
          <LessonProgressBar
            currentStep={currentStepNumber}
            totalSteps={screenData.totalSteps}
          />
        </View>

        <TodaysWordsSection words={screenData.todaysWords} />

        <LessonFeedbackStats />
      </ScrollView>
    </SafeAreaView>
  );
}
