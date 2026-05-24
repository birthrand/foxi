import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import { LESSON_CARD_SHADOW, lessonSpacing } from "@/constants/lesson-spacing";

type LessonListeningPanelProps = {
  isLive: boolean;
  isConnected: boolean;
  isTeacherSpeaking?: boolean;
  onToggleLivePress: () => void;
  streamStatusLabel?: string;
};

const WAVE_BAR_HEIGHTS = [14, 22, 18, 28, 16, 24, 12, 20];

const PAUSED_BG = "#F3F4F6";
const PAUSED_RING = "#E5E7EB";
const LIVE_RING = "#FFF7ED";
const LIVE_ACTIVE_RING = "#FFE4CC";

function WaveformBars({ active }: { active: boolean }) {
  return (
    <View className="flex-row items-center" style={{ gap: 3 }}>
      {WAVE_BAR_HEIGHTS.map((height, index) => (
        <View
          key={index}
          style={{
            width: 3,
            height,
            borderRadius: 2,
            backgroundColor: active ? "#FFD4A8" : "#E5E7EB",
          }}
        />
      ))}
    </View>
  );
}

function getInstructionText(
  isLive: boolean,
  isConnected: boolean,
  isTeacherSpeaking: boolean,
): string {
  if (!isConnected) {
    return "Connecting to your AI teacher…";
  }

  if (isTeacherSpeaking && isLive) {
    return "Foxi is speaking — your mic is muted so you don't interrupt";
  }

  if (isLive) {
    return "Speak naturally — tap the microphone when you need a break";
  }

  return "Tap the microphone to resume your live lesson";
}

export function LessonListeningPanel({
  isLive,
  isConnected,
  isTeacherSpeaking = false,
  onToggleLivePress,
  streamStatusLabel,
}: LessonListeningPanelProps) {
  const statusLabel =
    streamStatusLabel ??
    (isTeacherSpeaking && isLive
      ? "Foxi is speaking"
      : isLive
        ? "Live lesson"
        : "Lesson paused");
  const isStatusActive = isConnected && isLive;

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
            backgroundColor: isStatusActive ? "#22C55E" : "#9CA3AF",
          }}
        />
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 14,
            lineHeight: 20,
            color: isStatusActive ? "#16A34A" : "#6B7280",
          }}
        >
          {statusLabel}
        </Text>
      </View>

      <View
        className="flex-row items-center justify-center"
        style={{ marginTop: 20, gap: 16 }}
      >
        <WaveformBars active={isLive && isConnected} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isLive ? "Pause live conversation" : "Resume live conversation"
          }
          accessibilityState={{ selected: isLive }}
          disabled={!isConnected}
          onPress={onToggleLivePress}
          className="active:opacity-90"
        >
          <View
            className="items-center justify-center"
            style={{
              width: lessonSpacing.listeningMicSize + 24,
              height: lessonSpacing.listeningMicSize + 24,
              borderRadius: (lessonSpacing.listeningMicSize + 24) / 2,
              backgroundColor: isLive ? LIVE_ACTIVE_RING : PAUSED_RING,
            }}
          >
            <View
              className="items-center justify-center"
              style={{
                width: lessonSpacing.listeningMicSize,
                height: lessonSpacing.listeningMicSize,
                borderRadius: lessonSpacing.listeningMicSize / 2,
                borderWidth: 1,
                borderColor: isLive ? "#ff7a00" : PAUSED_RING,
                backgroundColor: isLive ? "#ff7a00" : PAUSED_BG,
                opacity: isConnected ? 1 : 0.5,
                ...LESSON_CARD_SHADOW,
              }}
            >
              <Ionicons
                name={isLive ? "mic" : "mic-off"}
                size={32}
                color={isLive ? "#FFFFFF" : "#6B7280"}
              />
            </View>
          </View>
        </Pressable>

        <WaveformBars active={isLive && isConnected} />
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
        {getInstructionText(isLive, isConnected, isTeacherSpeaking)}
      </Text>
    </View>
  );
}
