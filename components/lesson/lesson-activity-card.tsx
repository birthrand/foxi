import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import {
  LESSON_BEIGE,
  LESSON_CARD_SHADOW,
  LESSON_SPEAKER_SHADOW,
  lessonSpacing,
} from "@/constants/lesson-spacing";
import type { LessonStep } from "@/lib/lesson-screen-data";

type LessonActivityCardProps = {
  step: LessonStep;
  onSpeak?: () => void;
  onListen?: () => void;
  onNext?: () => void;
  isLastStep?: boolean;
};

export function LessonActivityCard({
  step,
  onSpeak,
  onListen,
  onNext,
  isLastStep = false,
}: LessonActivityCardProps) {
  return (
    <View
      style={{
        minHeight: lessonSpacing.activityCardMinHeight,
        borderRadius: lessonSpacing.cardRadius,
        backgroundColor: "#FFFFFF",
        padding: lessonSpacing.cardPadding,
        ...LESSON_CARD_SHADOW,
      }}
    >
      <View className="flex-row items-center" style={{ gap: 8 }}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#22c55e",
          }}
        />
        <Text
          className="text-secondary"
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 14,
            lineHeight: 20,
          }}
        >
          Online
        </Text>
      </View>

      <Text
        className="text-deep-navy"
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 20,
          lineHeight: 28,
          marginTop: 12,
        }}
      >
        {step.instruction}
      </Text>

      <View
        style={{
          marginTop: 16,
          minHeight: lessonSpacing.contentBoxMinHeight,
          borderRadius: lessonSpacing.contentBoxRadius,
          backgroundColor: LESSON_BEIGE,
          padding: lessonSpacing.contentBoxPadding,
          justifyContent: "center",
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="min-w-0 flex-1" style={{ paddingRight: 12 }}>
            <Text
              className="text-deep-navy"
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 28,
                lineHeight: 36,
              }}
            >
              {step.text}
            </Text>
            <Text
              className="text-secondary"
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 15,
                lineHeight: 22,
                marginTop: 4,
              }}
            >
              {step.translation}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Listen to pronunciation"
            onPress={onListen}
            className="active:opacity-80"
          >
            <View
              className="items-center justify-center"
              style={{
                width: lessonSpacing.speakerButtonSize,
                height: lessonSpacing.speakerButtonSize,
                borderRadius: lessonSpacing.speakerButtonSize / 2,
                backgroundColor: "#FFFFFF",
                ...LESSON_SPEAKER_SHADOW,
              }}
            >
              <Ionicons name="volume-high" size={24} color="#ff7a00" />
            </View>
          </Pressable>
        </View>
      </View>

      <View className="flex-row" style={{ gap: 12, marginTop: 20 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Speak phrase"
          onPress={onSpeak}
          className="flex-1 active:opacity-80"
        >
          <View
            className="flex-row items-center justify-center"
            style={{
              height: lessonSpacing.actionButtonHeight,
              borderRadius: lessonSpacing.actionButtonHeight / 2,
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#ff7a00",
              gap: 8,
            }}
          >
            <Ionicons name="mic" size={18} color="#ff7a00" />
            <Text
              className="text-foxi-orange"
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 15,
                lineHeight: 20,
              }}
            >
              Speak
            </Text>
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isLastStep ? "Finish lesson" : "Next step"}
          onPress={onNext}
          className="flex-1 active:opacity-80"
        >
          <View
            className="items-center justify-center"
            style={{
              height: lessonSpacing.actionButtonHeight,
              borderRadius: lessonSpacing.actionButtonHeight / 2,
              backgroundColor: "#ff7a00",
            }}
          >
            <Text
              className="text-white"
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 15,
                lineHeight: 20,
              }}
            >
              {isLastStep ? "Finish" : "Next"}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
