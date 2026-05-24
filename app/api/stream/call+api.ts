import { getLessonWithLanguage } from "@/data/lessons";
import {
  getAuthenticatedClerkUserId,
  getClerkUserDisplayName,
} from "@/lib/clerk-server-auth";
import {
  buildStreamCallId,
  STREAM_AUDIO_VIDEO_SETTINGS,
} from "@/lib/stream";
import {
  buildStreamLessonCallCustom,
  FOXI_AGENT_DISPLAY_NAME,
  FOXI_AGENT_USER_ID,
} from "@/lib/stream-lesson-custom";
import {
  getStreamServerClient,
  getStreamServerConfigError,
  STREAM_AUDIO_CALL_TYPE,
} from "@/lib/stream-server";
import type { LanguageCode } from "@/types/learning";

type CreateCallBody = {
  lessonId?: string;
  languageCode?: LanguageCode;
  lessonTitle?: string;
  lessonGoal?: string;
};

export async function POST(request: Request) {
  const userId = await getAuthenticatedClerkUserId(request);

  if (!userId) {
    return Response.json(
      { error: "Unauthorized. Sign in to start an audio lesson." },
      { status: 401 },
    );
  }

  const configError = getStreamServerConfigError();
  if (configError) {
    return Response.json({ error: configError }, { status: 500 });
  }

  let body: CreateCallBody;

  try {
    body = (await request.json()) as CreateCallBody;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { lessonId, languageCode, lessonTitle, lessonGoal } = body;

  if (!lessonId || !languageCode || !lessonTitle || !lessonGoal) {
    return Response.json(
      {
        error:
          "lessonId, languageCode, lessonTitle, and lessonGoal are required.",
      },
      { status: 400 },
    );
  }

  const lesson = getLessonWithLanguage(lessonId);

  if (!lesson || lesson.languageCode !== languageCode) {
    return Response.json({ error: "Lesson not found." }, { status: 404 });
  }

  const callId = buildStreamCallId(lessonId, languageCode, userId);
  const callType = STREAM_AUDIO_CALL_TYPE;
  const lessonCustom = buildStreamLessonCallCustom(lesson);

  try {
    const streamClient = getStreamServerClient();
    const displayName = await getClerkUserDisplayName(userId);

    await streamClient.upsertUsers([
      {
        id: userId,
        name: displayName,
        role: "user",
      },
      {
        id: FOXI_AGENT_USER_ID,
        name: FOXI_AGENT_DISPLAY_NAME,
        role: "user",
      },
    ]);

    const call = streamClient.video.call(callType, callId);

    await call.getOrCreate({
      data: {
        created_by_id: userId,
        members: [
          { user_id: userId, role: "admin" },
          { user_id: FOXI_AGENT_USER_ID, role: "admin" },
        ],
        custom: lessonCustom,
        settings_override: {
          audio: {
            mic_default_on: true,
            speaker_default_on: true,
            default_device: "speaker",
          },
          video: STREAM_AUDIO_VIDEO_SETTINGS,
        },
      },
    });

    await call.update({
      custom: lessonCustom,
    });

    return Response.json({
      callType,
      callId,
      callCid: `${callType}:${callId}`,
      lessonCustom,
    });
  } catch (error) {
    console.error("Stream call creation error:", error);
    return Response.json(
      { error: "Could not create the audio lesson call." },
      { status: 500 },
    );
  }
}
