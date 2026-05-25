import { getAuthenticatedClerkUserId } from "@/lib/clerk-server-auth";
import {
  getVisionAgentConfigError,
  visionAgentFetch,
} from "@/lib/vision-agent-server";

type StopAgentBody = {
  callId?: string;
  sessionId?: string;
};

export async function DELETE(request: Request) {
  const userId = await getAuthenticatedClerkUserId(request);

  if (!userId) {
    return Response.json(
      { error: "Unauthorized. Sign in to stop the AI teacher." },
      { status: 401 },
    );
  }

  const configError = getVisionAgentConfigError();
  if (configError) {
    return Response.json({ error: configError }, { status: 500 });
  }

  let body: StopAgentBody;

  try {
    body = (await request.json()) as StopAgentBody;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { callId, sessionId } = body;

  if (!callId || !sessionId) {
    return Response.json(
      { error: "callId and sessionId are required." },
      { status: 400 },
    );
  }

  try {
    await visionAgentFetch({
      method: "DELETE",
      path: `/calls/${encodeURIComponent(callId)}/sessions/${encodeURIComponent(sessionId)}`,
    });

    return Response.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const isUnreachable =
      message.toLowerCase().includes("fetch failed") ||
      message.toLowerCase().includes("econnrefused");

    if (isUnreachable) {
      return Response.json({ success: true, alreadyStopped: true });
    }

    console.error("Vision Agent stop error:", error);
    return Response.json(
      {
        error: message || "Could not stop the AI teacher session.",
      },
      { status: 502 },
    );
  }
}
