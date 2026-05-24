import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { LESSON_CARD_SHADOW, lessonSpacing } from "@/constants/lesson-spacing";
import type {
  StreamAudioLessonStatus,
  VisionAgentStatus,
} from "@/types/stream";

type LessonStreamCallBannerProps = {
  status: StreamAudioLessonStatus;
  statusMessage: string;
  errorMessage: string | null;
  agentStatus?: VisionAgentStatus;
  agentStatusMessage?: string;
  agentErrorMessage?: string | null;
  onAgentRetry?: () => void;
  userDisplayName: string;
  userImageUrl: string | null;
  participantCount: number;
  isMicMuted: boolean;
  onRetry?: () => void;
};

function getAgentStatusDotColor(status: VisionAgentStatus): string {
  switch (status) {
    case "connected":
      return "#22C55E";
    case "connecting":
      return "#ff7a00";
    case "failed":
      return "#EF4444";
    default:
      return "#9CA3AF";
  }
}

function getStatusDotColor(status: StreamAudioLessonStatus): string {
  switch (status) {
    case "joined":
      return "#22C55E";
    case "muted":
      return "#F59E0B";
    case "connecting":
    case "loading":
      return "#ff7a00";
    case "error":
      return "#EF4444";
    case "ended":
      return "#9CA3AF";
    default:
      return "#9CA3AF";
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function LessonStreamCallBanner({
  status,
  statusMessage,
  errorMessage,
  agentStatus = "idle",
  agentStatusMessage,
  agentErrorMessage,
  onAgentRetry,
  userDisplayName,
  userImageUrl,
  participantCount,
  isMicMuted,
  onRetry,
}: LessonStreamCallBannerProps) {
  const showRetry = status === "error" && onRetry;
  const showAgentRetry = agentStatus === "failed" && onAgentRetry;

  return (
    <View
      style={{
        marginTop: lessonSpacing.headerToStatus,
        borderRadius: lessonSpacing.cardRadius,
        backgroundColor: "#FFFFFF",
        padding: lessonSpacing.cardPadding,
        borderWidth: 1,
        borderColor: "#F3F4F6",
        ...LESSON_CARD_SHADOW,
      }}
    >
      <View className="flex-row items-center" style={{ gap: 12 }}>
        {userImageUrl ? (
          <Image
            source={{ uri: userImageUrl }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
            }}
            contentFit="cover"
            accessibilityLabel={`${userDisplayName} profile photo`}
          />
        ) : (
          <View
            className="items-center justify-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
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
              {getInitials(userDisplayName)}
            </Text>
          </View>
        )}

        <View className="flex-1">
          <Text
            className="text-deep-navy"
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 14,
              lineHeight: 20,
            }}
            numberOfLines={1}
          >
            {userDisplayName}
          </Text>
          <Text
            className="text-secondary"
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              lineHeight: 16,
              marginTop: 2,
            }}
          >
            {participantCount} in call
            {isMicMuted ? " · Mic off" : ""}
          </Text>
        </View>

        <View className="flex-row items-center" style={{ gap: 6 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: getStatusDotColor(status),
            }}
          />
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 12,
              lineHeight: 16,
              color:
                status === "error"
                  ? "#EF4444"
                  : status === "joined" || status === "muted"
                    ? "#ff7a00"
                    : "#6B7280",
            }}
          >
            {statusMessage}
          </Text>
        </View>
      </View>

      {agentStatusMessage ? (
        <View
          className="flex-row items-center"
          style={{ gap: 6, marginTop: 10 }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: getAgentStatusDotColor(agentStatus),
            }}
          />
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 12,
              lineHeight: 16,
              color:
                agentStatus === "failed"
                  ? "#EF4444"
                  : agentStatus === "connected"
                    ? "#16A34A"
                    : "#6B7280",
            }}
          >
            {agentStatusMessage}
          </Text>
        </View>
      ) : null}

      {errorMessage ? (
        <Text
          style={{
            marginTop: 10,
            fontFamily: "Poppins_400Regular",
            fontSize: 12,
            lineHeight: 16,
            color: "#EF4444",
          }}
        >
          {errorMessage}
        </Text>
      ) : null}

      {agentErrorMessage ? (
        <Text
          style={{
            marginTop: 6,
            fontFamily: "Poppins_400Regular",
            fontSize: 12,
            lineHeight: 16,
            color: "#EF4444",
          }}
        >
          {agentErrorMessage}
        </Text>
      ) : null}

      {showAgentRetry ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retry AI teacher connection"
          onPress={onAgentRetry}
          className="self-start active:opacity-80"
          style={{ marginTop: 8 }}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 13,
              color: "#ff7a00",
            }}
          >
            Retry AI teacher
          </Text>
        </Pressable>
      ) : null}

      {showRetry ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retry audio connection"
          onPress={onRetry}
          className="self-start active:opacity-80"
          style={{ marginTop: 10 }}
        >
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 13,
              color: "#ff7a00",
            }}
          >
            Tap to retry
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
