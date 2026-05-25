import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileLevelCard } from "@/components/profile/profile-level-card";
import { ProfileMenuList } from "@/components/profile/profile-menu-list";
import { ProfileSignOutButton } from "@/components/profile/profile-sign-out-button";
import { ProfileStatCards } from "@/components/profile/profile-stat-cards";
import { profileSpacing } from "@/constants/profile-spacing";
import {
  getProfileDisplayName,
  getProfileScreenData,
} from "@/lib/profile-data";
import { useSelectedLanguageCode } from "@/store/language-store";
import {
  useLearningProgressHydrated,
  useLearningProgressStore,
} from "@/store/learning-progress-store";

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const selectedLanguageCode = useSelectedLanguageCode();
  const hasProgressHydrated = useLearningProgressHydrated();
  const completedLessonIds = useLearningProgressStore(
    (state) => state.completedLessonIds,
  );
  const lessonProgressPercent = useLearningProgressStore(
    (state) => state.lessonProgressPercent,
  );
  const streakDays = useLearningProgressStore((state) => state.streakDays);

  const profileData = useMemo(() => {
    if (!selectedLanguageCode) {
      return null;
    }

    return getProfileScreenData(selectedLanguageCode, {
      completedLessonIds,
      lessonProgressPercent,
      streakDays,
    });
  }, [
    completedLessonIds,
    lessonProgressPercent,
    selectedLanguageCode,
    streakDays,
  ]);

  const displayName = getProfileDisplayName(
    user?.firstName,
    user?.fullName,
    user?.username,
  );

  const handleHeaderPress = () => {
    router.push("/language-selection");
  };

  const handleMenuPress = (itemId: string) => {
    if (itemId === "settings") {
      router.push("/language-selection");
    }
  };

  const handleSignOut = () => {
    void signOut();
  };

  if (!isUserLoaded || !hasProgressHydrated || !profileData) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: profileSpacing.screenBackground }}
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
      style={{ flex: 1, backgroundColor: profileSpacing.screenBackground }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: profileSpacing.screenPadding,
          paddingBottom: profileSpacing.scrollBottomPadding,
        }}
      >
        <ProfileHeader
          displayName={displayName}
          flagEmoji={profileData.language.flagEmoji}
          learningLabel={profileData.learningLabel}
          motivationalMessage={profileData.motivationalMessage}
          onPress={handleHeaderPress}
        />

        <ProfileStatCards stats={profileData.stats} />

        <ProfileLevelCard level={profileData.level} />

        <ProfileMenuList
          items={profileData.menuItems}
          onItemPress={handleMenuPress}
        />

        <ProfileSignOutButton onPress={handleSignOut} />
      </ScrollView>
    </SafeAreaView>
  );
}
