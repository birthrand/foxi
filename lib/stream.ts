import type { StreamLessonCallCustom } from "@/lib/stream-lesson-custom";
import type { LanguageCode } from "@/types/learning";

export const STREAM_AUDIO_CALL_TYPE = "audio_room";

/** Minimum valid video resolution required by Stream when overriding call settings. */
export const STREAM_AUDIO_VIDEO_SETTINGS = {
  enabled: false,
  camera_default_on: false,
  target_resolution: {
    width: 640,
    height: 480,
    bitrate: 750_000,
  },
} as const;

export type StreamTokenResponse = {
  apiKey: string;
  userId: string;
  token: string;
};

export type StreamCallSessionResponse = {
  callType: string;
  callId: string;
  callCid: string;
  lessonCustom?: StreamLessonCallCustom;
};

export type CreateStreamCallPayload = {
  lessonId: string;
  languageCode: LanguageCode;
  lessonTitle: string;
  lessonGoal: string;
};

export function buildStreamCallId(
  lessonId: string,
  languageCode: LanguageCode,
  userId: string,
): string {
  const safeLessonId = lessonId.replace(/[^a-zA-Z0-9-_]/g, "-");
  const safeUserId = userId.replace(/[^a-zA-Z0-9-_]/g, "-");

  return `foxi-v2-${languageCode}-${safeLessonId}-${safeUserId}`;
}

export function parseStreamCallId(callId: string): {
  languageCode: LanguageCode;
  lessonId: string;
} | null {
  const parts = callId.split("-");

  if (parts.length < 6 || parts[0] !== "foxi" || parts[1] !== "v2") {
    return null;
  }

  const languageCode = parts[2];
  const lessonId = parts.slice(3, -1).join("-");

  if (!lessonId) {
    return null;
  }

  return { languageCode: languageCode as LanguageCode, lessonId };
}
