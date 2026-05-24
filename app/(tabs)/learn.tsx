import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LearnHeader } from "@/components/learn/learn-header";
import { LearnHeroBanner } from "@/components/learn/learn-hero-banner";
import { LessonTimelineList } from "@/components/learn/lesson-timeline-list";
import { QuickReviewSection } from "@/components/learn/quick-review-section";
import { learnSpacing } from "@/constants/learn-spacing";
import { getLearnScreenData } from "@/lib/learn-data";
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

  const learnData = useMemo(() => {
    if (!selectedLanguageCode) {
      return null;
    }

    return getLearnScreenData(selectedLanguageCode, {
      completedLessonIds,
      lessonProgressPercent,
    });
  }, [completedLessonIds, lessonProgressPercent, selectedLanguageCode]);

  const handleLessonPress = (lessonId: string) => {
    router.push({
      pathname: "/lesson/[id]",
      params: { id: lessonId },
    });
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

        {/* <LearnProgressStats
          completedCount={learnData.completedCount}
          totalCount={learnData.totalCount}
          unitTitle={learnData.unit.title}
          unitNumber={learnData.unit.number}
        /> */}

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
    </SafeAreaView>
  );
}
