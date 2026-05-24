import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProgressScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="typography--h2 text-deep-navy">Progress</Text>
        <Text className="typography--body-md mt-2 text-center text-secondary">
          Your learning stats and streaks will live here.
        </Text>
      </View>
    </SafeAreaView>
  );
}
