import { getLessonWithLanguage } from "@/data/lessons";
import { getAuthenticatedClerkUserId } from "@/lib/clerk-server-auth";
import { fetchStreamCallLessonCustom } from "@/lib/stream-call-custom";
import { buildStreamLessonCallCustom } from "@/lib/stream-lesson-custom";
import { parseStreamCallId } from "@/lib/stream";
import { getStreamServerConfigError } from "@/lib/stream-server";
import {
  getVisionAgentConfigError,
  visionAgentFetch,
} from "@/lib/vision-agent-server";
import type { StreamLessonCallCustom } from "@/lib/stream-lesson-custom";

type StartAgentBody = {
  callId?: string;
  callType?: string;
  lessonCustom?: StreamLessonCallCustom;
};

type VisionAgentStartResponse = {
  session_id: string;
  call_id: string;
  session_started_at: string;
};

function resolveLessonCustomForCall(
  callId: string,
  callType: string,
  bodyLessonCustom?: StreamLessonCallCustom,
): StreamLessonCallCustom | null {
  if (bodyLessonCustom?.languageCode && bodyLessonCustom.lessonTitle) {
    return bodyLessonCustom;
  }

  const parsed = parseStreamCallId(callId);
  if (!parsed) {
    return null;
  }

  const lesson = getLessonWithLanguage(parsed.lessonId);
  if (!lesson || lesson.languageCode !== parsed.languageCode) {
    return null;
  }

  return buildStreamLessonCallCustom(lesson);
}

export async function POST(request: Request) {
  const userId = await getAuthenticatedClerkUserId(request);

  if (!userId) {
    return Response.json(
      { error: "Unauthorized. Sign in to start the AI teacher." },
      { status: 401 },
    );
  }

  const configError = getVisionAgentConfigError();
  if (configError) {
    return Response.json({ error: configError }, { status: 500 });
  }

  let body: StartAgentBody;

  try {
    body = (await request.json()) as StartAgentBody;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { callId, callType, lessonCustom: bodyLessonCustom } = body;

  if (!callId || !callType) {
    return Response.json(
      { error: "callId and callType are required." },
      { status: 400 },
    );
  }

  try {
    let lessonCustom = resolveLessonCustomForCall(
      callId,
      callType,
      bodyLessonCustom,
    );

    if (!lessonCustom && !getStreamServerConfigError()) {
      try {
        lessonCustom = await fetchStreamCallLessonCustom(callId, callType);
      } catch (error) {
        console.warn("Could not load Stream call lesson custom:", error);
      }
    }

    if (!lessonCustom) {
      lessonCustom = resolveLessonCustomForCall(callId, callType);
    }

    if (lessonCustom) {
      console.info(
        `Starting vision agent for ${callId} (${lessonCustom.languageCode} — ${lessonCustom.lessonTitle})`,
      );
    } else {
      console.warn(
        `Starting vision agent for ${callId} without lesson custom; agent will use defaults`,
      );
    }

    const session = await visionAgentFetch<VisionAgentStartResponse>({
      method: "POST",
      path: `/calls/${encodeURIComponent(callId)}/sessions`,
      body: {
        call_type: callType,
        ...(lessonCustom ? { lessonCustom } : {}),
      },
    });

    return Response.json({
      sessionId: session.session_id,
      callId: session.call_id,
      sessionStartedAt: session.session_started_at,
    });
  } catch (error) {
    console.error("Vision Agent start error:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not start the AI teacher session.",
      },
      { status: 502 },
    );
  }
}
