import { Text, View } from "react-native";

export function AuthOrDivider() {
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-px flex-1 bg-[#E8E2DA]" />
      <Text
        className="text-[13px] text-[#A8A29E]"
        style={{ fontFamily: "Poppins_500Medium" }}
      >
        OR
      </Text>
      <View className="h-px flex-1 bg-[#E8E2DA]" />
    </View>
  );
}
