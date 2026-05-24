import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { images } from "@/constants/images";
import {
  LESSON_CARD_SHADOW,
  LESSON_USER_BUBBLE,
  lessonSpacing,
} from "@/constants/lesson-spacing";
import type { ConversationExchange } from "@/lib/lesson-screen-data";

type LessonChatMessagesProps = {
  completedExchanges: ConversationExchange[];
  currentExchange?: ConversationExchange;
  showCurrentUserMessage: boolean;
  onHintPress?: () => void;
  onListenPress?: () => void;
};

function MascotAvatar() {
  return (
    <Image
      source={images.mascotProfile}
      accessibilityLabel="Foxi AI Teacher"
      style={{
        width: lessonSpacing.chatAvatarSize,
        height: lessonSpacing.chatAvatarSize,
        borderRadius: lessonSpacing.chatAvatarSize / 2,
      }}
      contentFit="cover"
    />
  );
}

function AiPromptCard({
  exchange,
  onHintPress,
  onListenPress,
}: {
  exchange: ConversationExchange;
  onHintPress?: () => void;
  onListenPress?: () => void;
}) {
  return (
    <View className="flex-row" style={{ gap: 10 }}>
      <MascotAvatar />
      <View
        className="flex-1"
        style={{
          borderRadius: lessonSpacing.cardRadius,
          backgroundColor: "#FFFFFF",
          padding: lessonSpacing.cardPadding,
          borderWidth: 1,
          borderColor: "#F3F4F6",
          ...LESSON_CARD_SHADOW,
        }}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center" style={{ gap: 6 }}>
            <Text
              className="text-deep-navy"
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 13,
                lineHeight: 18,
              }}
            >
              AI Teacher
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Listen to prompt"
            onPress={onListenPress}
            className="active:opacity-70"
            hitSlop={6}
          >
            <Ionicons name="volume-high-outline" size={20} color="#ff7a00" />
          </Pressable>
        </View>

        <Text
          className="text-deep-navy"
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 16,
            lineHeight: 22,
            marginTop: 10,
          }}
        >
          {exchange.aiPrompt}
        </Text>

        <Text
          className="text-secondary"
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 13,
            lineHeight: 18,
            marginTop: 4,
          }}
        >
          Try saying it out loud! I&apos;m listening.
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Need a hint"
          onPress={onHintPress}
          className="self-start active:opacity-70"
          style={{ marginTop: 12 }}
        >
          <View className="flex-row items-center" style={{ gap: 6 }}>
            {/* <Ionicons name="bulb-outline" size={16} color="#ff7a00" /> */}
            <Text
              className="text-foxi-orange"
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 13,
                lineHeight: 18,
              }}
            >
              Need a hint?
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

function UserMessageBubble({ text }: { text: string }) {
  const timestamp = new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <View className="items-end">
      <View
        style={{
          maxWidth: "82%",
          borderRadius: 18,
          borderBottomRightRadius: 6,
          backgroundColor: LESSON_USER_BUBBLE,
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <Text
          className="text-deep-navy"
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 14,
            lineHeight: 20,
          }}
        >
          {text}
        </Text>
        <View
          className="flex-row items-center justify-end"
          style={{ gap: 4, marginTop: 4 }}
        >
          <Text
            className="text-secondary"
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 11,
              lineHeight: 14,
            }}
          >
            {timestamp}
          </Text>
          <Ionicons name="checkmark-done" size={14} color="#3b82f6" />
        </View>
      </View>
    </View>
  );
}

export function LessonChatMessages({
  completedExchanges,
  currentExchange,
  showCurrentUserMessage,
  onHintPress,
  onListenPress,
}: LessonChatMessagesProps) {
  return (
    <View style={{ gap: lessonSpacing.chatGap }}>
      {completedExchanges.map((exchange) => (
        <View key={exchange.id} style={{ gap: lessonSpacing.chatGap }}>
          <AiPromptCard exchange={exchange} />
          <UserMessageBubble text={exchange.userResponse} />
        </View>
      ))}

      {currentExchange ? (
        <View style={{ gap: lessonSpacing.chatGap }}>
          <AiPromptCard
            exchange={currentExchange}
            onHintPress={onHintPress}
            onListenPress={onListenPress}
          />
          {showCurrentUserMessage ? (
            <UserMessageBubble text={currentExchange.userResponse} />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
