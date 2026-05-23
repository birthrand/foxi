import { useAuth, useClerk } from "@clerk/expo";
import { Link, Redirect, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthOutlineButton } from "@/components/auth/auth-outline-button";
import { getLanguageByCode } from "@/data/languages";
import {
  useLanguageStore,
  useLanguageStoreHydrated,
  useSelectedLanguageCode,
} from "@/store/language-store";

export default function Index() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const hasHydrated = useLanguageStoreHydrated();
  const selectedLanguageCode = useSelectedLanguageCode();
  const clearLanguageStorageForTesting = useLanguageStore(
    (state) => state.clearLanguageStorageForTesting,
  );

  if (!isLoaded || (isSignedIn && !hasHydrated)) {
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

  const selectedLanguage = getLanguageByCode(selectedLanguageCode);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="typography--h1 text-deep-navy">foxi</Text>
        <Text className="typography--body-md mt-2 text-secondary">
          Welcome back — you&apos;re signed in.
        </Text>
        {selectedLanguage ? (
          <Text className="typography--body-md mt-1 text-secondary">
            Learning {selectedLanguage.name}
          </Text>
        ) : null}
        <View className="mt-8 w-full max-w-[320px] gap-3">
          <Link href="/language-selection" asChild>
            <Pressable
              accessibilityRole="link"
              className="w-full items-center justify-center rounded-[19px] bg-foxi-orange py-4 active:opacity-90"
            >
              <Text
                className="text-[17px] text-white"
                style={{ fontFamily: "Poppins_700Bold" }}
              >
                Choose a language
              </Text>
            </Pressable>
          </Link>
          <AuthOutlineButton
            label="Clear language storage (test)"
            onPress={() => {
              void clearLanguageStorageForTesting().then(() => {
                router.replace("/language-selection");
              });
            }}
          />
          <AuthOutlineButton label="Sign Out" onPress={() => signOut()} />
        </View>
      </View>
    </SafeAreaView>
  );
}
