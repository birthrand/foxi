import * as WebBrowser from "expo-web-browser";
import { ActivityIndicator, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function SSOCallbackScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#FFFBF5]">
      <ActivityIndicator size="large" color="#ff7a00" />
    </View>
  );
}
