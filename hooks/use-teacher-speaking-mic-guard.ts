import type { Call } from "@stream-io/video-react-native-sdk";
import { useEffect, useRef, useState, type MutableRefObject } from "react";

import { FOXI_AGENT_USER_ID } from "@/lib/stream-lesson-custom";

const UNMUTE_DELAY_MS = 450;

type UseTeacherSpeakingMicGuardParams = {
  call: Call | null;
  enabled: boolean;
  isLive: boolean;
};

type UseTeacherSpeakingMicGuardResult = {
  isTeacherSpeaking: boolean;
};

function clearTimer(
  timerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>,
) {
  if (timerRef.current) {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }
}

export function useTeacherSpeakingMicGuard({
  call,
  enabled,
  isLive,
}: UseTeacherSpeakingMicGuardParams): UseTeacherSpeakingMicGuardResult {
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false);

  const isTeacherSpeakingRef = useRef(false);
  const isLiveRef = useRef(isLive);
  const autoMutedByTeacherRef = useRef(false);
  const unmuteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  isLiveRef.current = isLive;

  useEffect(() => {
    if (!call || !enabled) {
      setIsTeacherSpeaking(false);
      isTeacherSpeakingRef.current = false;
      autoMutedByTeacherRef.current = false;
      clearTimer(unmuteTimerRef);
      return;
    }

    const muteForTeacher = async () => {
      clearTimer(unmuteTimerRef);

      try {
        await call.microphone.disable();
        autoMutedByTeacherRef.current = true;
      } catch (error) {
        console.warn("Could not mute mic while teacher is speaking:", error);
      }
    };

    const enableAfterTeacher = async () => {
      clearTimer(unmuteTimerRef);

      try {
        await call.microphone.enable();
        autoMutedByTeacherRef.current = false;
      } catch (error) {
        console.warn("Could not restore mic after teacher speech:", error);
      }
    };

    const scheduleUnmuteAfterTeacher = () => {
      clearTimer(unmuteTimerRef);

      unmuteTimerRef.current = setTimeout(() => {
        unmuteTimerRef.current = null;

        if (
          !isLiveRef.current ||
          isTeacherSpeakingRef.current ||
          !autoMutedByTeacherRef.current
        ) {
          return;
        }

        void enableAfterTeacher();
      }, UNMUTE_DELAY_MS);
    };

    const handleParticipants = (
      participants: typeof call.state.participants,
    ) => {
      const agent = participants.find(
        (participant) => participant.userId === FOXI_AGENT_USER_ID,
      );
      const speaking = Boolean(agent?.isSpeaking);

      if (speaking === isTeacherSpeakingRef.current) {
        return;
      }

      isTeacherSpeakingRef.current = speaking;
      setIsTeacherSpeaking(speaking);

      if (!isLiveRef.current) {
        return;
      }

      if (speaking) {
        void muteForTeacher();
      } else if (autoMutedByTeacherRef.current) {
        scheduleUnmuteAfterTeacher();
      }
    };

    handleParticipants(call.state.participants);
    const subscription = call.state.participants$.subscribe(handleParticipants);

    return () => {
      subscription.unsubscribe();
      clearTimer(unmuteTimerRef);
    };
  }, [call, enabled]);

  useEffect(() => {
    if (!call || !enabled) {
      return;
    }

    if (!isLive) {
      clearTimer(unmuteTimerRef);
      autoMutedByTeacherRef.current = false;
      return;
    }

    if (isTeacherSpeakingRef.current) {
      void call.microphone.disable().catch((error) => {
        console.warn("Could not keep mic muted while teacher is speaking:", error);
      });
      autoMutedByTeacherRef.current = true;
      return;
    }

    void call.microphone.enable().catch((error) => {
      console.warn("Could not enable mic for live lesson:", error);
    });
    autoMutedByTeacherRef.current = false;
  }, [call, enabled, isLive]);

  return { isTeacherSpeaking };
}
