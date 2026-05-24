import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { LESSON_CARD_SHADOW, lessonSpacing } from "@/constants/lesson-spacing";

type LessonListeningPanelProps = {
  speakInstruction: string;
  isTeacherSpeaking: boolean;
  canSpeak: boolean;
  onSpeakPress: () => void;
};

const WAVE_BAR_HEIGHTS = [14, 22, 18, 28, 16, 24, 12, 20];

function WaveformBars() {
  return (
    <View className="flex-row items-center" style={{ gap: 3 }}>
      {WAVE_BAR_HEIGHTS.map((height, index) => (
        <View
          key={index}
          style={{
            width: 3,
            height,
            borderRadius: 2,
            backgroundColor: "#FFD4A8",
          }}
        />
      ))}
    </View>
  );
}

function getStatusLabel(isHolding: boolean, isTeacherSpeaking: boolean): string {
  if (isHolding) {
    return "AI is listening...";
  }

  if (isTeacherSpeaking) {
    return "AI is speaking...";
  }

  return "Ready for your turn";
}

export function LessonListeningPanel({
  speakInstruction,
  isTeacherSpeaking,
  canSpeak,
  onSpeakPress,
}: LessonListeningPanelProps) {
  const [isHolding, setIsHolding] = useState(false);
  const statusLabel = getStatusLabel(isHolding, isTeacherSpeaking);
  const isStatusActive = isHolding || isTeacherSpeaking;

  return (
    <View
      style={{
        borderRadius: lessonSpacing.cardRadius,
        backgroundColor: "#FFFFFF",
        padding: lessonSpacing.cardPadding,
        borderWidth: 1,
        borderColor: "#F3F4F6",
        ...LESSON_CARD_SHADOW,
      }}
    >
        <View
          className="flex-row items-center justify-center"
          style={{ gap: 6 }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: isStatusActive ? "#ff7a00" : "#9CA3AF",
            }}
          />
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              lineHeight: 20,
              color: isStatusActive ? "#ff7a00" : "#9CA3AF",
            }}
          >
            {statusLabel}
          </Text>
        </View>

        <View
          className="flex-row items-center justify-center"
          style={{ marginTop: 20, gap: 16 }}
        >
          <WaveformBars />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Hold to speak"
            disabled={!canSpeak}
            onPressIn={() => setIsHolding(true)}
            onPressOut={() => {
              setIsHolding(false);
              if (canSpeak) {
                onSpeakPress();
              }
            }}
          >
            <View
              className="items-center justify-center"
              style={{
                width: lessonSpacing.listeningMicSize + 24,
                height: lessonSpacing.listeningMicSize + 24,
                borderRadius: (lessonSpacing.listeningMicSize + 24) / 2,
                backgroundColor: isHolding ? "#FFE4CC" : "#FFF7ED",
              }}
            >
              <View
                className="items-center justify-center"
                style={{
                  width: lessonSpacing.listeningMicSize,
                  height: lessonSpacing.listeningMicSize,
                  borderRadius: lessonSpacing.listeningMicSize / 2,
                  borderWidth: 1,
                  borderColor: isHolding ? "#ff7a00" : "#F3F4F6",
                  backgroundColor: isHolding ? "#ff7a00" : "#FFFFFF",
                  ...LESSON_CARD_SHADOW,
                }}
              >
                <Ionicons
                  name="mic"
                  size={32}
                  color={isHolding ? "#FFFFFF" : "#ff7a00"}
                />
              </View>
            </View>
          </Pressable>

          <WaveformBars />
        </View>

        <Text
          className="text-secondary text-center"
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 13,
            lineHeight: 18,
            marginTop: 16,
          }}
        >
          {isHolding ? "Speaking" : speakInstruction}
        </Text>
    </View>
  );
}
