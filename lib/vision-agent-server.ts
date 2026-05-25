const DEFAULT_VISION_AGENT_URL = "http://127.0.0.1:8000";

export function getVisionAgentBaseUrl(): string {
  const configured = process.env.VISION_AGENT_URL?.trim();
  return (configured || DEFAULT_VISION_AGENT_URL).replace(/\/$/, "");
}

export function getVisionAgentConfigError(): string | null {
  if (!getVisionAgentBaseUrl()) {
    return "Vision Agent server URL is not configured.";
  }

  return null;
}

type VisionAgentFetchOptions = {
  method: "POST" | "DELETE";
  path: string;
  body?: unknown;
};

function isVisionAgentUnreachable(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  const cause = (error as Error & { cause?: { code?: string } }).cause;

  return (
    message.includes("fetch failed") ||
    message.includes("econnrefused") ||
    cause?.code === "ECONNREFUSED"
  );
}

export async function visionAgentFetch<T>({
  method,
  path,
  body,
}: VisionAgentFetchOptions): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${getVisionAgentBaseUrl()}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (method === "DELETE" && isVisionAgentUnreachable(error)) {
      return {} as T;
    }

    throw error;
  }

  const responseText = await response.text();
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    if (contentType.includes("application/json") && responseText) {
      const payload = JSON.parse(responseText) as {
        detail?: string;
        error?: string;
      };
      throw new Error(
        payload.detail ??
          payload.error ??
          `Vision Agent request failed (${response.status}).`,
      );
    }

    throw new Error(`Vision Agent request failed (${response.status}).`);
  }

  if (!responseText || !contentType.includes("application/json")) {
    return {} as T;
  }

  return JSON.parse(responseText) as T;
}
