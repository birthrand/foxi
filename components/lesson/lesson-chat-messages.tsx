import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { images } from "@/constants/images";
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
      className="size-10 rounded-full"
      contentFit="cover"
    />
  );
}

function AiTeacherBubbleShell({ children }: { children: ReactNode }) {
  return (
    <View className="flex-row gap-2.5">
      <MascotAvatar />
      <View className="flex-1 rounded-[20px] border border-gray-100 bg-white p-4 shadow-[0px_2px_8px_rgba(13,19,43,0.08)]">
        <Text className="font-poppins-medium text-[13px] leading-[18px] text-deep-navy">
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
        className="mt-2.5 gap-1.5"
      >
        {SPEAKING_LINE_WIDTHS.map((width) => (
          <View
            key={width}
            className="h-[3px] rounded-full bg-gray-300"
            style={{ width }}
          />
        ))}
      </View>
    </AiTeacherBubbleShell>
  );
}

function AiTranscriptBubble({ text }: { text: string }) {
  return (
    <AiTeacherBubbleShell>
      <Text className="mt-2 font-poppins text-[15px] leading-[22px] text-deep-navy">
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
      <View className="max-w-[82%] rounded-[18px] rounded-br-[6px] bg-[#FFF1E6] px-3.5 py-2.5">
        <Text className="font-poppins text-[14px] leading-[20px] text-deep-navy">
          {text}
        </Text>
        <View className="mt-1 flex-row items-center justify-end gap-1">
          <Text className="font-poppins text-[11px] leading-[14px] text-secondary">
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
    <View className="gap-2.5">
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
