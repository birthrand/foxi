import {
  getStreamServerClient,
  STREAM_AUDIO_CALL_TYPE,
} from "@/lib/stream-server";
import type { StreamLessonCallCustom } from "@/lib/stream-lesson-custom";

function isStreamLessonCallCustom(
  value: unknown,
): value is StreamLessonCallCustom {
  if (!value || typeof value !== "object") {
    return false;
  }

  const custom = value as Record<string, unknown>;

  return (
    custom.app === "foxi" &&
    typeof custom.languageCode === "string" &&
    typeof custom.lessonTitle === "string"
  );
}

export async function fetchStreamCallLessonCustom(
  callId: string,
  callType: string = STREAM_AUDIO_CALL_TYPE,
): Promise<StreamLessonCallCustom | null> {
  const streamClient = getStreamServerClient();
  const call = streamClient.video.call(callType, callId);
  const response = await call.get();

  const callData =
    response.call ??
    (response as { data?: { call?: { custom?: unknown } } }).data?.call;

  const custom = callData?.custom;

  if (!isStreamLessonCallCustom(custom)) {
    return null;
  }

  return custom;
}
