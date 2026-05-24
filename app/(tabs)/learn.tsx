import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LearnHeader } from "@/components/learn/learn-header";
import { LearnHeroBanner } from "@/components/learn/learn-hero-banner";
import { LessonRestartConfirmModal } from "@/components/learn/lesson-restart-confirm-modal";
import { LessonTimelineList } from "@/components/learn/lesson-timeline-list";
import { QuickReviewSection } from "@/components/learn/quick-review-section";
import { learnSpacing } from "@/constants/learn-spacing";
import { getLearnScreenData } from "@/lib/learn-data";
import { getTotalConversationExchanges } from "@/lib/lesson-screen-data";
import { getLanguageByCode } from "@/data/languages";
import { getLessonById } from "@/data/lessons";
import { isLessonAccessible } from "@/lib/lesson-access";
import { useSelectedLanguageCode } from "@/store/language-store";
import {
  useLearningProgressHydrated,
  useLearningProgressStore,
} from "@/store/learning-progress-store";

export default function LearnScreen() {
  const router = useRouter();
  const selectedLanguageCode = useSelectedLanguageCode();
  const hasProgressHydrated = useLearningProgressHydrated();
  const completedLessonIds = useLearningProgressStore(
    (state) => state.completedLessonIds,
  );
  const lessonProgressPercent = useLearningProgressStore(
    (state) => state.lessonProgressPercent,
  );
  const lessonExchangeProgress = useLearningProgressStore(
    (state) => state.lessonExchangeProgress,
  );
  const restartLesson = useLearningProgressStore((state) => state.restartLesson);

  const [restartLessonId, setRestartLessonId] = useState<string | null>(null);

  const learnData = useMemo(() => {
    if (!selectedLanguageCode) {
      return null;
    }

    return getLearnScreenData(selectedLanguageCode, {
      completedLessonIds,
      lessonProgressPercent,
      lessonExchangeProgress,
    });
  }, [
    completedLessonIds,
    lessonExchangeProgress,
    lessonProgressPercent,
    selectedLanguageCode,
  ]);

  const restartLessonItem = useMemo(() => {
    if (!restartLessonId || !learnData) {
      return null;
    }

    for (const section of learnData.unitSections) {
      const match = section.lessons.find(
        (item) => item.lesson.id === restartLessonId,
      );
      if (match) {
        return match;
      }
    }

    return null;
  }, [learnData, restartLessonId]);

  const openLesson = (lessonId: string) => {
    router.push({
      pathname: "/lesson/[id]",
      params: { id: lessonId },
    });
  };

  const handleLessonPress = (lessonId: string) => {
    if (!learnData || !selectedLanguageCode) {
      return;
    }

    let pressedItem: (typeof learnData.unitSections)[number]["lessons"][number] | null =
      null;

    for (const section of learnData.unitSections) {
      const match = section.lessons.find((item) => item.lesson.id === lessonId);
      if (match) {
        pressedItem = match;
        break;
      }
    }

    if (!pressedItem) {
      const lesson = getLessonById(lessonId);
      if (!lesson) {
        return;
      }

      const progressSnapshot = {
        completedLessonIds,
        lessonProgressPercent,
        lessonExchangeProgress,
      };

      if (!isLessonAccessible(lesson, selectedLanguageCode, progressSnapshot)) {
        Alert.alert(
          "Lesson locked",
          "Complete the previous lesson or continue one you have already started.",
        );
        return;
      }

      if (completedLessonIds.includes(lessonId)) {
        setRestartLessonId(lessonId);
        return;
      }

      openLesson(lessonId);
      return;
    }

    if (pressedItem.status === "locked") {
      Alert.alert(
        "Lesson locked",
        "Complete the previous lesson or continue one you have already started.",
      );
      return;
    }

    if (pressedItem.status === "completed") {
      setRestartLessonId(lessonId);
      return;
    }

    openLesson(lessonId);
  };

  const handleConfirmRestart = () => {
    if (!restartLessonId || !selectedLanguageCode) {
      setRestartLessonId(null);
      return;
    }

    const language = getLanguageByCode(selectedLanguageCode);
    const lesson = restartLessonItem?.lesson;
    const totalExchanges = lesson
      ? getTotalConversationExchanges(lesson, language?.name ?? "Language")
      : 1;

    restartLesson(restartLessonId, totalExchanges);
    const lessonId = restartLessonId;
    setRestartLessonId(null);
    openLesson(lessonId);
  };

  const handleBack = () => {
    router.push("/");
  };

  const handleSeeAllLessons = () => {
    const firstAvailableLesson = learnData?.lessons.find(
      (item) => item.status !== "locked",
    );

    if (firstAvailableLesson) {
      handleLessonPress(firstAvailableLesson.lesson.id);
    }
  };

  const handleSeeAllQuickReview = () => {
    const firstReviewItem = learnData?.quickReview[0];

    if (firstReviewItem) {
      handleLessonPress(firstReviewItem.lessonId);
    }
  };

  if (!hasProgressHydrated || !learnData) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: learnSpacing.screenBackground }}
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ff7a00" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: learnSpacing.screenBackground }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: learnSpacing.screenPadding,
          paddingBottom: learnSpacing.scrollBottomPadding,
        }}
      >
        <LearnHeader onBack={handleBack} />

        <LearnHeroBanner
          languageName={learnData.languageName}
          completedCount={learnData.completedCount}
          totalCount={learnData.totalCount}
        />

        <LessonTimelineList
          unitSections={learnData.unitSections}
          onSeeAll={handleSeeAllLessons}
          onLessonPress={handleLessonPress}
        />

        <QuickReviewSection
          items={learnData.quickReview}
          onSeeAll={handleSeeAllQuickReview}
          onItemPress={handleLessonPress}
        />
      </ScrollView>

      <LessonRestartConfirmModal
        visible={restartLessonId !== null}
        lessonTitle={restartLessonItem?.lesson.title ?? "This lesson"}
        onConfirm={handleConfirmRestart}
        onCancel={() => setRestartLessonId(null)}
      />
    </SafeAreaView>
  );
}
