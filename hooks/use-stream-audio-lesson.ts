import { useAuth, useUser } from "@clerk/expo";
import {
  callManager,
  StreamVideoClient,
  type Call,
} from "@stream-io/video-react-native-sdk";
import { useCallback, useEffect, useRef, useState } from "react";

import { useTeacherSpeakingMicGuard } from "@/hooks/use-teacher-speaking-mic-guard";
import { routeLessonAudioToSpeaker } from "@/lib/lesson-audio-output";
import { createStreamAudioCall, fetchStreamToken } from "@/lib/stream-api";
import type { CreateStreamCallPayload, StreamCallSessionResponse } from "@/lib/stream";
import type { StreamAudioLessonStatus } from "@/types/stream";

type UseStreamAudioLessonParams = CreateStreamCallPayload & {
  enabled: boolean;
};

type UseStreamAudioLessonResult = {
  status: StreamAudioLessonStatus;
  statusMessage: string;
  errorMessage: string | null;
  streamClient: StreamVideoClient | null;
  call: Call | null;
  callSession: StreamCallSessionResponse | null;
  isMicMuted: boolean;
  isTeacherSpeaking: boolean;
  participantCount: number;
  userDisplayName: string;
  userImageUrl: string | null;
  userId: string | null;
  isLive: boolean;
  toggleLiveConversation: () => Promise<void>;
  endCall: () => Promise<void>;
  retry: () => void;
};

function getStatusMessage(status: StreamAudioLessonStatus): string {
  switch (status) {
    case "loading":
      return "Preparing audio lesson...";
    case "connecting":
      return "Connecting to your AI teacher...";
    case "joined":
      return "Live with your AI teacher";
    case "muted":
      return "Conversation paused";
    case "error":
      return "Could not connect";
    case "ended":
      return "Call ended";
    default:
      return "Starting audio lesson...";
  }
}

export function useStreamAudioLesson({
  enabled,
  lessonId,
  languageCode,
  lessonTitle,
  lessonGoal,
}: UseStreamAudioLessonParams): UseStreamAudioLessonResult {
  const { isLoaded: isAuthLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const [status, setStatus] = useState<StreamAudioLessonStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [streamClient, setStreamClient] = useState<StreamVideoClient | null>(
    null,
  );
  const [call, setCall] = useState<Call | null>(null);
  const [callSession, setCallSession] = useState<StreamCallSessionResponse | null>(
    null,
  );
  const [participantCount, setParticipantCount] = useState(0);
  const [streamUserId, setStreamUserId] = useState<string | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);

  const activeCallRef = useRef<Call | null>(null);
  const activeClientRef = useRef<StreamVideoClient | null>(null);
  const connectInFlightRef = useRef(false);
  const getTokenRef = useRef(getToken);

  getTokenRef.current = getToken;

  const userDisplayName =
    user?.fullName?.trim() ||
    user?.firstName?.trim() ||
    user?.username ||
    "You";
  const userImageUrl = user?.imageUrl ?? null;
  const userDisplayNameRef = useRef(userDisplayName);
  const userImageUrlRef = useRef(userImageUrl);

  userDisplayNameRef.current = userDisplayName;
  userImageUrlRef.current = userImageUrl;

  const cleanupCall = useCallback(async () => {
    const activeCall = activeCallRef.current;
    activeCallRef.current = null;
    setCall(null);
    setParticipantCount(0);

    if (activeCall) {
      try {
        await activeCall.leave();
      } catch {
        // Call may already be left.
      }
    }
  }, []);

  const cleanupClient = useCallback(async () => {
    const activeClient = activeClientRef.current;
    activeClientRef.current = null;
    setStreamClient(null);

    if (activeClient) {
      try {
        await activeClient.disconnectUser();
      } catch {
        // Client may already be disconnected.
      }
    }
  }, []);

  const cleanupCallRef = useRef(cleanupCall);
  const cleanupClientRef = useRef(cleanupClient);
  cleanupCallRef.current = cleanupCall;
  cleanupClientRef.current = cleanupClient;

  const endCall = useCallback(async () => {
    setStatus("ended");
    setCallSession(null);
    setStreamUserId(null);
    connectInFlightRef.current = false;
    await cleanupCall();
    await cleanupClient();
  }, [cleanupCall, cleanupClient]);

  const toggleLiveConversation = useCallback(async () => {
    const activeCall = activeCallRef.current;
    if (!activeCall || status === "ended" || status === "error") {
      return;
    }

    try {
      if (status === "muted") {
        routeLessonAudioToSpeaker();
        setStatus("joined");
      } else {
        await activeCall.microphone.disable();
        setStatus("muted");
      }
    } catch (error) {
      console.error("Live conversation toggle failed:", error);
      setErrorMessage("Could not update the live lesson.");
      setStatus("error");
    }
  }, [status]);

  const isLive = status === "joined";
  const isMicMuted = status === "muted";

  const { isTeacherSpeaking } = useTeacherSpeakingMicGuard({
    call,
    enabled: isLive || status === "muted",
    isLive,
  });

  const retry = useCallback(() => {
    setRetryNonce((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!call) {
      return;
    }

    const updateCount = () => {
      setParticipantCount(call.state.participants.length + 1);
    };

    updateCount();
    const unsubscribe = call.state.participants$.subscribe(() => {
      updateCount();
    });

    return () => {
      unsubscribe.unsubscribe();
    };
  }, [call]);

  const connectionKey = `${lessonId}-${languageCode}-${retryNonce}`;

  useEffect(() => {
    if (!enabled || !isAuthLoaded) {
      return;
    }

    if (!isSignedIn) {
      setStatus("error");
      setErrorMessage("Sign in to join the audio lesson call.");
      return;
    }

    let cancelled = false;

    const connect = async () => {
      if (connectInFlightRef.current) {
        return;
      }

      connectInFlightRef.current = true;
      setStatus("loading");
      setErrorMessage(null);
      try {
        const clerkToken = await getTokenRef.current();
        if (!clerkToken) {
          throw new Error("Could not read your sign-in session.");
        }

        const [tokenResponse, createdCallSession] = await Promise.all([
          fetchStreamToken(clerkToken),
          createStreamAudioCall(clerkToken, {
            lessonId,
            languageCode,
            lessonTitle,
            lessonGoal,
          }),
        ]);

        if (cancelled) {
          return;
        }

        setCallSession(createdCallSession);
        setStreamUserId(tokenResponse.userId);
        setStatus("connecting");

        const client = StreamVideoClient.getOrCreateInstance({
          apiKey: tokenResponse.apiKey,
          user: {
            id: tokenResponse.userId,
            name: userDisplayNameRef.current,
            image: userImageUrlRef.current ?? undefined,
          },
          token: tokenResponse.token,
          options: {
            maxConnectUserRetries: 3,
          },
        });

        activeClientRef.current = client;
        setStreamClient(client);

        const nextCall = client.call(
          createdCallSession.callType,
          createdCallSession.callId,
        );
        activeCallRef.current = nextCall;

        await nextCall.join({ create: false });

        if (cancelled) {
          await nextCall.leave();
          await client.disconnectUser();
          return;
        }

        try {
          await nextCall.camera.disable();
        } catch {
          // Audio-only lessons can continue without camera.
        }

        let joinedMuted = false;

        try {
          await nextCall.microphone.enable();
        } catch {
          joinedMuted = true;
        }

        routeLessonAudioToSpeaker();

        setCall(nextCall);
        setStatus(joinedMuted ? "muted" : "joined");
      } catch (error) {
        console.error("Stream audio lesson connect failed:", error);
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Could not connect to the audio lesson.",
          );
          await cleanupCallRef.current();
          await cleanupClientRef.current();
        }
      } finally {
        connectInFlightRef.current = false;
      }
    };

    void connect();

    return () => {
      cancelled = true;
      connectInFlightRef.current = false;
      void cleanupCallRef.current();
      void cleanupClientRef.current();
    };
  }, [
    connectionKey,
    enabled,
    isAuthLoaded,
    isSignedIn,
    languageCode,
    lessonGoal,
    lessonId,
    lessonTitle,
  ]);

  return {
    status,
    statusMessage: getStatusMessage(status),
    errorMessage,
    streamClient,
    call,
    callSession,
    isMicMuted,
    isTeacherSpeaking,
    participantCount,
    userDisplayName,
    userImageUrl,
    userId: streamUserId,
    isLive,
    toggleLiveConversation,
    endCall,
    retry,
  };
}
