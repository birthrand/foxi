import { Pressable, Text } from "react-native";

type LearnHeaderProps = {
  onBack?: () => void;
};

export function LearnHeader({ onBack }: LearnHeaderProps) {
  if (!onBack) {
    return null;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={onBack}
      className="self-start active:opacity-70"
    >
      <Text
        className="text-deep-navy"
        style={{ fontFamily: "Poppins_500Medium", fontSize: 16 }}
      >
        ← Back
      </Text>
    </Pressable>
  );
}
