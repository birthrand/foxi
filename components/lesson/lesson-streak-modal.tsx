import { Image } from "expo-image";
import { Modal, Pressable, Text, View } from "react-native";

import { images } from "@/constants/images";
import { LESSON_CARD_SHADOW, lessonSpacing } from "@/constants/lesson-spacing";

type LessonStreakModalProps = {
  visible: boolean;
  title: string;
  description: string;
  onClose: () => void;
};

export function LessonStreakModal({
  visible,
  title,
  description,
  onClose,
}: LessonStreakModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: lessonSpacing.screenPadding,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close streak message"
          onPress={onClose}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
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
            ...LESSON_CARD_SHADOW,
          }}
        >
          <View className="flex-row" style={{ gap: 10 }}>
            <Image
              source={images.mascotProfile}
              accessibilityLabel="Foxi mascot"
              style={{
                width: lessonSpacing.chatAvatarSize * 2.5,
                height: lessonSpacing.chatAvatarSize * 2.5,
                borderRadius: lessonSpacing.chatAvatarSize / 2,
              }}
              contentFit="cover"
            />
            <View className="min-w-0 flex-1">
              <Text
                className="text-deep-navy"
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                  lineHeight: 22,
                }}
              >
                {title}
              </Text>
              <Text
                className="text-secondary"
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: 6,
                }}
              >
                {description}
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Got it"
            onPress={onClose}
            className="self-center active:opacity-70"
            style={{ marginTop: lessonSpacing.cardPadding }}
          >
            <Text
              className="text-foxi-orange"
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 15,
                lineHeight: 20,
              }}
            >
              Got it
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
