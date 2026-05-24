import { Pressable, Text, View } from "react-native";

type LessonAiHeaderProps = {
  title: string;
  onBack: () => void;
};

const HEADER_LINE_HEIGHT = 24;

export function LessonAiHeader({ title, onBack }: LessonAiHeaderProps) {
  return (
    <View
      className="flex-row items-center"
      style={{ minHeight: HEADER_LINE_HEIGHT }}
    >
      <View className="flex-1">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          className="self-start active:opacity-70"
        >
          <Text
            className="text-deep-navy"
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 16,
              lineHeight: HEADER_LINE_HEIGHT,
            }}
          >
            ← Back
          </Text>
        </Pressable>
      </View>

      <Text
        className="text-deep-navy"
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 17,
          lineHeight: HEADER_LINE_HEIGHT,
        }}
        numberOfLines={1}
      >
        {title}
      </Text>

      <View className="flex-1" />
    </View>
  );
}
