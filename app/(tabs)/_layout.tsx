import { useAuth } from "@clerk/expo";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomTabBar } from "@/components/navigation/custom-tab-bar";
import {
  useLanguageStoreHydrated,
  useSelectedLanguageCode,
} from "@/store/language-store";

export default function TabsLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const hasHydrated = useLanguageStoreHydrated();
  const selectedLanguageCode = useSelectedLanguageCode();

  if (!isLoaded || !hasHydrated) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <View className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator size="large" color="#ff7a00" />
        </View>
      </SafeAreaView>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!selectedLanguageCode) {
    return <Redirect href="/language-selection" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: "Practice",
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
