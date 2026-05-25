import { Modal, Pressable, Text, View } from "react-native";

import { LEARN_CARD_SHADOW, learnSpacing } from "@/constants/learn-spacing";

type LessonRestartConfirmModalProps = {
  visible: boolean;
  lessonTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function LessonRestartConfirmModal({
  visible,
  lessonTitle,
  onConfirm,
  onCancel,
}: LessonRestartConfirmModalProps) {
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
          paddingHorizontal: learnSpacing.screenPadding,
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
            borderRadius: learnSpacing.lessonCardRadius,
            backgroundColor: "#FFFFFF",
            padding: learnSpacing.lessonCardPadding,
            borderWidth: 1,
            borderColor: "#F3F4F6",
            alignItems: "center",
            ...LEARN_CARD_SHADOW,
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
            Restart this lesson?
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
            {lessonTitle} will reset to 0% progress. You can practice it again
            from the beginning.
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Restart lesson"
            onPress={onConfirm}
            className="w-full active:opacity-90"
            style={{
              marginTop: learnSpacing.lessonCardPadding,
              height: 48,
              borderRadius: learnSpacing.lessonCardRadius,
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
              Restart lesson
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel"
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
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
