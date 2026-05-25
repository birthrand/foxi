import { getApiBaseUrl } from "@/lib/api-base-url";
import type { StreamLessonCallCustom } from "@/lib/stream-lesson-custom";

export type VisionAgentSessionResponse = {
  sessionId: string;
  callId: string;
  sessionStartedAt: string;
};

type AuthorizedFetchOptions = {
  clerkToken: string;
  method?: "POST" | "DELETE";
  body?: unknown;
};

async function authorizedFetch<T>(
  path: string,
  { clerkToken, method = "POST", body }: AuthorizedFetchOptions,
): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${clerkToken}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const responseText = await response.text();
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      response.ok
        ? "Server returned an unexpected response."
        : `Request failed (${response.status}). Check API route logs.`,
    );
  }

  const payload = JSON.parse(responseText) as T & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? `Request failed (${response.status})`);
  }

  return payload;
}

export function startVisionAgentSession(
  clerkToken: string,
  payload: {
    callId: string;
    callType: string;
    lessonCustom?: StreamLessonCallCustom;
  },
): Promise<VisionAgentSessionResponse> {
  return authorizedFetch<VisionAgentSessionResponse>("/api/agent/start", {
    clerkToken,
    method: "POST",
    body: payload,
  });
}

export function stopVisionAgentSession(
  clerkToken: string,
  payload: { callId: string; sessionId: string },
): Promise<void> {
  return authorizedFetch<{ success: boolean }>("/api/agent/stop", {
    clerkToken,
    method: "DELETE",
    body: payload,
  }).then(() => undefined);
}
