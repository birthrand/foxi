import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="typography--h2 text-deep-navy">Home</Text>
        <Text className="typography--body-md mt-2 text-center text-secondary">
          Home screen UI coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}
