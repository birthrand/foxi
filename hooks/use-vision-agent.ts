import { useAuth } from "@clerk/expo";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  startVisionAgentSession,
  stopVisionAgentSession,
} from "@/lib/vision-agent-api";
import type { StreamLessonCallCustom } from "@/lib/stream-lesson-custom";
import type { VisionAgentStatus } from "@/types/stream";

type UseVisionAgentParams = {
  enabled: boolean;
  callId: string | null;
  callType: string | null;
  lessonCustom?: StreamLessonCallCustom | null;
};

type UseVisionAgentResult = {
  status: VisionAgentStatus;
  statusMessage: string;
  errorMessage: string | null;
  stopAgent: () => Promise<void>;
  retry: () => void;
};

function getStatusMessage(status: VisionAgentStatus): string {
  switch (status) {
    case "connecting":
      return "Connecting AI teacher...";
    case "connected":
      return "AI teacher connected";
    case "failed":
      return "AI teacher unavailable";
    default:
      return "AI teacher idle";
  }
}

function isStopFailureIgnorable(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("fetch failed") ||
    message.includes("econnrefused") ||
    message.includes("502")
  );
}

export function useVisionAgent({
  enabled,
  callId,
  callType,
  lessonCustom,
}: UseVisionAgentParams): UseVisionAgentResult {
  const { isLoaded: isAuthLoaded, isSignedIn, getToken } = useAuth();

  const [status, setStatus] = useState<VisionAgentStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);

  const sessionIdRef = useRef<string | null>(null);
  const activeCallIdRef = useRef<string | null>(null);
  const startInFlightRef = useRef(false);
  const getTokenRef = useRef(getToken);

  getTokenRef.current = getToken;

  const stopAgent = useCallback(async () => {
    const sessionId = sessionIdRef.current;
    const activeCallId = activeCallIdRef.current;

    sessionIdRef.current = null;
    activeCallIdRef.current = null;
    startInFlightRef.current = false;

    if (!sessionId || !activeCallId) {
      setStatus("idle");
      return;
    }

    try {
      const clerkToken = await getTokenRef.current();
      if (!clerkToken) {
        return;
      }

      await stopVisionAgentSession(clerkToken, {
        callId: activeCallId,
        sessionId,
      });
    } catch (error) {
      if (!isStopFailureIgnorable(error)) {
        console.warn("Vision Agent stop failed:", error);
      }
    } finally {
      setStatus("idle");
    }
  }, []);

  const stopAgentRef = useRef(stopAgent);
  stopAgentRef.current = stopAgent;

  const retry = useCallback(() => {
    sessionIdRef.current = null;
    activeCallIdRef.current = null;
    setRetryNonce((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!enabled || !isAuthLoaded || !isSignedIn || !callId || !callType) {
      return;
    }

    if (sessionIdRef.current && activeCallIdRef.current === callId) {
      return;
    }

    let cancelled = false;

    const connectAgent = async () => {
      if (startInFlightRef.current) {
        return;
      }

      startInFlightRef.current = true;
      setStatus("connecting");
      setErrorMessage(null);

      try {
        const clerkToken = await getTokenRef.current();
        if (!clerkToken) {
          throw new Error("Could not read your sign-in session.");
        }

        const session = await startVisionAgentSession(clerkToken, {
          callId,
          callType,
          ...(lessonCustom ? { lessonCustom } : {}),
        });

        if (cancelled) {
          try {
            await stopVisionAgentSession(clerkToken, {
              callId,
              sessionId: session.sessionId,
            });
          } catch {
            // Server may already be unavailable during cleanup.
          }
          return;
        }

        sessionIdRef.current = session.sessionId;
        activeCallIdRef.current = callId;
        setStatus("connected");
      } catch (error) {
        if (!cancelled) {
          setStatus("failed");
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Could not connect the AI teacher.",
          );
        }
      } finally {
        startInFlightRef.current = false;
      }
    };

    void connectAgent();

    return () => {
      cancelled = true;
    };
  }, [callId, callType, enabled, isAuthLoaded, isSignedIn, lessonCustom, retryNonce]);

  useEffect(() => {
    if (enabled) {
      return;
    }

    void stopAgentRef.current();
  }, [enabled]);

  useEffect(() => {
    return () => {
      void stopAgentRef.current();
    };
  }, []);

  return {
    status,
    statusMessage: getStatusMessage(status),
    errorMessage,
    stopAgent,
    retry,
  };
}
