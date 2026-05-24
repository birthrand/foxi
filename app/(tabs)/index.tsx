import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HomeContinueCard } from "@/components/home/home-continue-card";
import { HomeFocusSection } from "@/components/home/home-focus-section";
import { HomeHeader } from "@/components/home/home-header";
import { HomeRecentVocabularySection } from "@/components/home/home-recent-vocabulary-section";
import { HomeStatRow } from "@/components/home/home-stat-row";
import { homeSpacing } from "@/constants/home-spacing";
import { getLanguageByCode } from "@/data/languages";
import {
  getGreetingForTime,
  getHomeScreenData,
  getLanguageSubtitle,
} from "@/lib/home-data";
import { getCurrentLessonIdForLanguage } from "@/lib/language-progress";
import { useSelectedLanguageCode } from "@/store/language-store";
import {
  useLearningProgressHydrated,
  useLearningProgressStore,
} from "@/store/learning-progress-store";

function getDisplayName(
  firstName: string | null | undefined,
  fullName: string | null | undefined,
  username: string | null | undefined,
): string {
  if (firstName?.trim()) {
    return firstName.trim();
  }

  if (fullName?.trim()) {
    return fullName.trim().split(" ")[0] ?? fullName.trim();
  }

  if (username?.trim()) {
    return username.trim();
  }

  return "Learner";
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();
  const selectedLanguageCode = useSelectedLanguageCode();
  const hasProgressHydrated = useLearningProgressHydrated();
  const completedLessonIds = useLearningProgressStore(
    (state) => state.completedLessonIds,
  );
  const lessonProgressPercent = useLearningProgressStore(
    (state) => state.lessonProgressPercent,
  );
  const dailyMinutesStudied = useLearningProgressStore(
    (state) => state.dailyMinutesStudied,
  );
  const dailyGoalMinutes = useLearningProgressStore(
    (state) => state.dailyGoalMinutes,
  );
  const streakDays = useLearningProgressStore((state) => state.streakDays);

  const homeData = useMemo(() => {
    if (!selectedLanguageCode) {
      return null;
    }

    return getHomeScreenData(selectedLanguageCode, {
      completedLessonIds,
      lessonProgressPercent,
      dailyMinutesStudied,
      dailyGoalMinutes,
      streakDays,
    });
  }, [
    completedLessonIds,
    dailyGoalMinutes,
    dailyMinutesStudied,
    lessonProgressPercent,
    selectedLanguageCode,
    streakDays,
  ]);

  const greeting = getGreetingForTime();
  const userName = getDisplayName(
    user?.firstName,
    user?.fullName,
    user?.username,
  );
  const subtitle = selectedLanguageCode
    ? getLanguageSubtitle(selectedLanguageCode)
    : "Let's keep your language journey going";
  const selectedLanguageName = selectedLanguageCode
    ? getLanguageByCode(selectedLanguageCode)?.name
    : undefined;

  const handleContinueLearning = () => {
    if (!selectedLanguageCode) {
      router.push("/learn");
      return;
    }

    const lessonId = getCurrentLessonIdForLanguage(
      selectedLanguageCode,
      completedLessonIds,
    );

    if (lessonId) {
      router.push({
        pathname: "/lesson/[id]",
        params: { id: lessonId },
      });
      return;
    }

    router.push("/learn");
  };

  const handleSeeAllFocus = () => {
    router.push("/learn");
  };

  const handleSeeAllVocabulary = () => {
    router.push("/learn");
  };

  const handleChangeLanguage = () => {
    router.push("/language-selection");
  };

  if (!isUserLoaded || !hasProgressHydrated || !homeData) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: homeSpacing.screenBackground }}
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
      style={{ flex: 1, backgroundColor: homeSpacing.screenBackground }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: homeSpacing.screenPadding,
          paddingBottom: homeSpacing.recommendedToBottom,
        }}
      >
        <HomeHeader
          greeting={greeting}
          userName={userName}
          subtitle={subtitle}
          languageName={selectedLanguageName}
          onChangeLanguage={handleChangeLanguage}
        />
        <HomeStatRow stats={homeData.stats} />
        <HomeContinueCard
          item={homeData.continueLearning}
          onPress={handleContinueLearning}
        />
        <HomeFocusSection
          items={homeData.todaysFocus}
          onSeeAll={handleSeeAllFocus}
        />

        {homeData.recentVocabulary.length > 0 ? (
          <View style={{ marginTop: homeSpacing.focusToRecommended }}>
            <HomeRecentVocabularySection
              items={homeData.recentVocabulary}
              onSeeAll={handleSeeAllVocabulary}
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
