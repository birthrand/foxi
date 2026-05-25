import { getApiBaseUrl } from "@/lib/api-base-url";
import type {
  CreateStreamCallPayload,
  StreamCallSessionResponse,
  StreamTokenResponse,
} from "@/lib/stream";

type AuthorizedFetchOptions = {
  clerkToken: string;
  method?: "GET" | "POST";
  body?: unknown;
};

async function authorizedFetch<T>(
  path: string,
  { clerkToken, method = "GET", body }: AuthorizedFetchOptions,
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

export function fetchStreamToken(clerkToken: string): Promise<StreamTokenResponse> {
  return authorizedFetch<StreamTokenResponse>("/api/stream/token", {
    clerkToken,
  });
}

export function createStreamAudioCall(
  clerkToken: string,
  payload: CreateStreamCallPayload,
): Promise<StreamCallSessionResponse> {
  return authorizedFetch<StreamCallSessionResponse>("/api/stream/call", {
    clerkToken,
    method: "POST",
    body: payload,
  });
}
