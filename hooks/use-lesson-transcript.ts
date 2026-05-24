import type { Call } from "@stream-io/video-react-native-sdk";
import { useEffect, useRef, useState } from "react";

import { FOXI_AGENT_USER_ID } from "@/lib/stream-lesson-custom";
import type { LessonTranscriptMessage } from "@/types/lesson-transcript";

type ClosedCaptionEvent = {
  closed_caption?: {
    id: string;
    speaker_id: string;
    text: string;
  };
};

const JUNK_CAPTION_PATTERN =
  /\b(participant|barged|backstage|joined the call|left the call|went live|is now live)\b/i;

function normalizeCaptionText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

function isJunkCaption(text: string): boolean {
  const normalized = normalizeCaptionText(text);
  if (!normalized || normalized.length < 2) {
    return true;
  }

  return JUNK_CAPTION_PATTERN.test(normalized);
}

function shouldMergeCaption(previous: string, next: string): boolean {
  const normalizedPrevious = normalizeCaptionText(previous);
  const normalizedNext = normalizeCaptionText(next);

  if (!normalizedPrevious || !normalizedNext) {
    return false;
  }

  return (
    normalizedNext.startsWith(normalizedPrevious) ||
    normalizedPrevious.startsWith(normalizedNext)
  );
}

function mergeCaptionText(previous: string, next: string): string {
  const normalizedPrevious = normalizeCaptionText(previous);
  const normalizedNext = normalizeCaptionText(next);

  if (normalizedNext.startsWith(normalizedPrevious)) {
    return normalizedNext;
  }

  if (normalizedPrevious.startsWith(normalizedNext)) {
    return normalizedPrevious;
  }

  return normalizedNext;
}

function isLikelyEchoOfTeacher(
  userText: string,
  lastAiText: string | null,
): boolean {
  if (!lastAiText) {
    return false;
  }

  const user = normalizeCaptionText(userText).toLowerCase();
  const ai = normalizeCaptionText(lastAiText).toLowerCase();

  if (user.length < 8 || ai.length < 8) {
    return false;
  }

  return ai.includes(user) || user.includes(ai);
}

export function useLessonTranscript(
  call: Call | null,
  userId: string | null,
  enabled: boolean,
  isLive: boolean,
): LessonTranscriptMessage[] {
  const [messages, setMessages] = useState<LessonTranscriptMessage[]>([]);
  const lastAiTextRef = useRef<string | null>(null);

  useEffect(() => {
    if (!call || !userId || !enabled) {
      setMessages([]);
      lastAiTextRef.current = null;
      return;
    }

    call.state.updateClosedCaptionSettings({
      maxVisibleCaptions: 50,
      visibilityDurationMs: 0,
    });

    void call.startClosedCaptions().catch(() => {
      // Captions may require dashboard configuration.
    });

    const handleCaption = (event: ClosedCaptionEvent) => {
      const caption = event.closed_caption;
      const text = caption?.text ? normalizeCaptionText(caption.text) : "";

      if (!caption || !text || isJunkCaption(text)) {
        return;
      }

      const role =
        caption.speaker_id === FOXI_AGENT_USER_ID
          ? "ai"
          : caption.speaker_id === userId
            ? "user"
            : null;

      if (!role) {
        return;
      }

      if (role === "user" && !isLive) {
        return;
      }

      if (role === "user" && isLikelyEchoOfTeacher(text, lastAiTextRef.current)) {
        return;
      }

      if (role === "ai") {
        lastAiTextRef.current = text;
      }

      setMessages((previous) => {
        const last = previous[previous.length - 1];

        if (last && last.role === role && shouldMergeCaption(last.text, text)) {
          return [
            ...previous.slice(0, -1),
            {
              ...last,
              text: mergeCaptionText(last.text, text),
            },
          ];
        }

        if (previous.some((message) => message.id === caption.id)) {
          return previous;
        }

        return [
          ...previous,
          {
            id: caption.id,
            role,
            text,
          },
        ];
      });
    };

    const unsubscribe = call.on(
      "call.closed_caption",
      handleCaption as (event: unknown) => void,
    );

    return () => {
      unsubscribe();
      void call.stopClosedCaptions().catch(() => {});
      setMessages([]);
      lastAiTextRef.current = null;
    };
  }, [call, enabled, isLive, userId]);

  return messages;
}
