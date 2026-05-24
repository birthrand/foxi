import { Modal, Pressable, Text, View } from "react-native";

import { LESSON_CARD_SHADOW, lessonSpacing } from "@/constants/lesson-spacing";

type LessonEndConfirmModalProps = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function LessonEndConfirmModal({
  visible,
  onConfirm,
  onCancel,
}: LessonEndConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
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
          <Text
            className="text-deep-navy"
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 20,
              lineHeight: 26,
              textAlign: "center",
            }}
          >
            End your lesson?
          </Text>

          <Text
            className="text-secondary"
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 15,
              lineHeight: 22,
              marginTop: 10,
              textAlign: "center",
            }}
          >
            Your progress is saved. You can pick up this lesson again anytime
            from Learn.
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="End lesson"
            onPress={onConfirm}
            className="w-full active:opacity-90"
            style={{
              marginTop: lessonSpacing.cardPadding,
              height: lessonSpacing.actionButtonHeight,
              borderRadius: lessonSpacing.cardRadius,
              backgroundColor: "#EF4444",
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
              End lesson
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Keep practicing"
            onPress={onCancel}
            className="active:opacity-70"
            style={{
              marginTop: 12,
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
              Keep practicing
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
