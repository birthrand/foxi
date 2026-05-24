import { images } from "@/constants/images";
import { LESSON_CARD_SHADOW, lessonSpacing } from "@/constants/lesson-spacing";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

export const LESSON_COMPLETE_AUTO_DISMISS_SECONDS = 8;

type LessonCompleteModalProps = {
  visible: boolean;
  lessonTitle: string;
  xpReward: number;
  nextLessonTitle: string | null;
  hasNextLesson: boolean;
  onNextLesson: () => void;
  onBackToLearn: () => void;
};

export function LessonCompleteModal({
  visible,
  lessonTitle,
  xpReward,
  nextLessonTitle,
  hasNextLesson,
  onNextLesson,
  onBackToLearn,
}: LessonCompleteModalProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(
    LESSON_COMPLETE_AUTO_DISMISS_SECONDS,
  );
  const hasDismissedRef = useRef(false);
  const onNextLessonRef = useRef(onNextLesson);
  const onBackToLearnRef = useRef(onBackToLearn);

  onNextLessonRef.current = onNextLesson;
  onBackToLearnRef.current = onBackToLearn;

  const countdownHint = hasNextLesson
    ? `Continuing to next lesson in ${secondsRemaining}s`
    : `Returning to Learn in ${secondsRemaining}s`;

  const hasNextLessonRef = useRef(hasNextLesson);
  hasNextLessonRef.current = hasNextLesson;

  const dismissWithPrimaryRef = useRef(() => {});

  const dismissWithTimerRef = useRef(() => {});

  dismissWithTimerRef.current = () => {
    if (hasDismissedRef.current) {
      return;
    }

    hasDismissedRef.current = true;

    if (hasNextLessonRef.current) {
      onNextLessonRef.current();
      return;
    }

    onBackToLearnRef.current();
  };

  dismissWithPrimaryRef.current = () => {
    if (hasDismissedRef.current) {
      return;
    }

    hasDismissedRef.current = true;

    if (hasNextLessonRef.current) {
      onNextLessonRef.current();
    }
  };

  useEffect(() => {
    if (!visible) {
      return;
    }

    hasDismissedRef.current = false;
    setSecondsRemaining(LESSON_COMPLETE_AUTO_DISMISS_SECONDS);

    let remaining = LESSON_COMPLETE_AUTO_DISMISS_SECONDS;
    const interval = setInterval(() => {
      remaining -= 1;
      setSecondsRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        dismissWithTimerRef.current();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, hasNextLesson]);

  const handlePrimaryPress = () => {
    dismissWithPrimaryRef.current();
  };

  const handleSecondaryPress = () => {
    if (hasDismissedRef.current) {
      return;
    }

    hasDismissedRef.current = true;
    onBackToLearnRef.current();
  };

  const timerProgress =
    (LESSON_COMPLETE_AUTO_DISMISS_SECONDS - secondsRemaining) /
    LESSON_COMPLETE_AUTO_DISMISS_SECONDS;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleSecondaryPress}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: lessonSpacing.screenPadding,
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />

        <View
          style={{
            width: "100%",
            borderRadius: lessonSpacing.cardRadius,
            backgroundColor: "#FFFFFF",
            padding: lessonSpacing.cardPadding,
            borderWidth: 1,
            borderColor: "#F3F4F6",
            alignItems: "center",
            ...LESSON_CARD_SHADOW,
          }}
        >
          <Image
            source={images.mascotLogo1OrangeFist}
            accessibilityLabel="Foxi celebrating"
            style={{
              width: 140,
              height: 140,
            }}
            contentFit="contain"
          />

          <Text
            className="text-deep-navy"
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 22,
              lineHeight: 28,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Lesson complete!
          </Text>

          <Text
            className="text-secondary"
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 15,
              lineHeight: 22,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            {`You finished "${lessonTitle}". Great work practicing today.`}
          </Text>

          <View
            className="flex-row items-center"
            style={{
              marginTop: 14,
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: "#FFF7ED",
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 14,
                color: "#ff7a00",
              }}
            >
              +{xpReward} XP
            </Text>
          </View>

          {hasNextLesson && nextLessonTitle ? (
            <Text
              className="text-secondary"
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 13,
                lineHeight: 18,
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Up next: {nextLessonTitle}
            </Text>
          ) : null}

          <View
            style={{
              width: "100%",
              height: 4,
              borderRadius: 2,
              backgroundColor: "#F3F4F6",
              marginTop: lessonSpacing.cardPadding,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${Math.min(100, timerProgress * 100)}%`,
                backgroundColor: "#ff7a00",
                borderRadius: 2,
              }}
            />
          </View>

          <Text
            className="text-secondary"
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              lineHeight: 16,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            {countdownHint}
          </Text>

          {hasNextLesson ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next lesson"
              onPress={handlePrimaryPress}
              className="w-full active:opacity-90"
              style={{
                marginTop: lessonSpacing.cardPadding,
                height: lessonSpacing.actionButtonHeight,
                borderRadius: lessonSpacing.cardRadius,
                backgroundColor: "#ff7a00",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                  color: "#FFFFFF",
                }}
              >
                Next lesson
              </Text>
            </Pressable>
          ) : null}

          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Back to Learn"
            onPress={handleSecondaryPress}
            className="active:opacity-70"
            style={{
              marginTop: hasNextLesson ? 12 : lessonSpacing.cardPadding,
              paddingVertical: 8,
              backgroundColor: "transparent",
            }}
          >
            <Text
              className="text-foxi-orange"
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 15,
                lineHeight: 20,
                textDecorationLine: "underline",
              }}
            >
              Back to Learn
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
