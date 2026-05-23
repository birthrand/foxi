import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="typography--h1 text-deep-navy">foxi</Text>
        <Text className="typography--body-md mt-2 text-secondary">
          Design system ready
        </Text>
        <Link href="/onboarding" asChild>
          <Pressable className="mt-8 rounded-2xl bg-foxi-orange px-6 py-3.5 active:opacity-90">
            <Text
              className="text-[16px] text-white"
              style={{ fontFamily: "Poppins_600SemiBold" }}
            >
              View Onboarding
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
