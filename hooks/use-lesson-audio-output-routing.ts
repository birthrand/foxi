import { useEffect, useRef } from "react";

import {
  routeLessonAudioOutput,
  subscribeToLessonAudioOutputChanges,
} from "@/lib/lesson-audio-output";

type UseLessonAudioOutputRoutingParams = {
  enabled: boolean;
};

export function useLessonAudioOutputRouting({
  enabled,
}: UseLessonAudioOutputRoutingParams): void {
  const routeInFlightRef = useRef(false);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const applyRouting = () => {
      if (routeInFlightRef.current) {
        return;
      }

      routeInFlightRef.current = true;
      void routeLessonAudioOutput()
        .catch((error) => {
          console.error("Lesson audio routing failed:", error);
        })
        .finally(() => {
          routeInFlightRef.current = false;
        });
    };

    const scheduleRouting = () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        applyRouting();
      }, 300);
    };

    applyRouting();

    const unsubscribe = subscribeToLessonAudioOutputChanges(scheduleRouting);

    return () => {
      unsubscribe();
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [enabled]);
}
