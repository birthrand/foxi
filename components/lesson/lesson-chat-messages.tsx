import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { images } from "@/constants/images";
import {
  LESSON_CARD_SHADOW,
  LESSON_USER_BUBBLE,
  lessonSpacing,
} from "@/constants/lesson-spacing";
import type { LessonTranscriptMessage } from "@/types/lesson-transcript";

type LessonChatMessagesProps = {
  transcriptMessages: LessonTranscriptMessage[];
  isTeacherSpeaking: boolean;
};

const SPEAKING_LINE_WIDTHS = ["72%", "58%", "64%"] as const;

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

function AiTeacherBubbleShell({ children }: { children: ReactNode }) {
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
        {children}
      </View>
    </View>
  );
}

function AiSpeakingIndicator() {
  return (
    <AiTeacherBubbleShell>
      <View
        accessibilityLabel="Foxi is speaking"
        style={{ gap: 6, marginTop: 10 }}
      >
        {SPEAKING_LINE_WIDTHS.map((width) => (
          <View
            key={width}
            style={{
              width,
              height: 3,
              borderRadius: 999,
              backgroundColor: "#D1D5DB",
            }}
          />
        ))}
      </View>
    </AiTeacherBubbleShell>
  );
}

function AiTranscriptBubble({ text }: { text: string }) {
  return (
    <AiTeacherBubbleShell>
      <Text
        className="text-deep-navy"
        style={{
          fontFamily: "Poppins_400Regular",
          fontSize: 15,
          lineHeight: 22,
          marginTop: 8,
        }}
      >
        {text}
      </Text>
    </AiTeacherBubbleShell>
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

function getVisibleMessages(
  transcriptMessages: LessonTranscriptMessage[],
  isTeacherSpeaking: boolean,
): LessonTranscriptMessage[] {
  if (!isTeacherSpeaking || transcriptMessages.length === 0) {
    return transcriptMessages;
  }

  const lastMessage = transcriptMessages[transcriptMessages.length - 1];
  if (lastMessage.role !== "ai") {
    return transcriptMessages;
  }

  return transcriptMessages.slice(0, -1);
}

export function LessonChatMessages({
  transcriptMessages,
  isTeacherSpeaking,
}: LessonChatMessagesProps) {
  const visibleMessages = getVisibleMessages(
    transcriptMessages,
    isTeacherSpeaking,
  );

  return (
    <View style={{ gap: lessonSpacing.chatGap }}>
      {visibleMessages.map((message) =>
        message.role === "ai" ? (
          <AiTranscriptBubble key={message.id} text={message.text} />
        ) : (
          <UserMessageBubble key={message.id} text={message.text} />
        ),
      )}

      {isTeacherSpeaking ? <AiSpeakingIndicator /> : null}
    </View>
  );
}
