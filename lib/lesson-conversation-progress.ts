import type { ConversationExchange } from "@/lib/lesson-screen-data";
import type { LessonTranscriptMessage } from "@/types/lesson-transcript";

const MIN_USER_RESPONSE_LENGTH = 2;

const AFFIRMATION_PATTERN =
  /\b(that's right|that is right|that sounds right|exactly right|you got it|correct|perfect|precisely|exactly)\b/i;

const RETRY_PATTERN =
  /\b(try again|give it another|not quite|almost there|listen again|one more time|let's try|repeat after|say it again|not exactly|close but|not quite right|give it another go)\b/i;

const LESSON_CLOSING_PATTERN =
  /\b(lesson (is )?complete|completed today|finished today|finished the lesson|great work today|that's all for today|you did great today)\b/i;

type ExchangeProgressOptions = {
  exchanges?: ConversationExchange[];
};

function normalizeMatchText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ");
}

function tokenizeForMatch(text: string): string[] {
  return normalizeMatchText(text).split(" ").filter(Boolean);
}

function isAffirmationMessage(text: string): boolean {
  const normalized = normalizeMatchText(text);
  if (!normalized || normalized.length < 3) {
    return false;
  }

  if (RETRY_PATTERN.test(normalized)) {
    return false;
  }

  return AFFIRMATION_PATTERN.test(normalized);
}

function isLessonClosingMessage(text: string): boolean {
  return LESSON_CLOSING_PATTERN.test(normalizeMatchText(text));
}

function phraseMatchesExchange(
  userText: string,
  exchange: ConversationExchange,
): boolean {
  const user = normalizeMatchText(userText);
  if (!user) {
    return false;
  }

  const targets = [exchange.hint, exchange.userResponse]
    .map(normalizeMatchText)
    .filter((value) => value.length >= 2);

  return targets.some((target) => {
    if (user === target || user.includes(target) || target.includes(user)) {
      return true;
    }

    const userTokens = tokenizeForMatch(user);
    const targetTokens = tokenizeForMatch(target);
    if (targetTokens.length === 0) {
      return false;
    }

    const matchedTokens = targetTokens.filter((targetToken) =>
      userTokens.some(
        (userToken) =>
          userToken === targetToken ||
          userToken.includes(targetToken) ||
          targetToken.includes(userToken),
      ),
    );

    const requiredMatches =
      targetTokens.length === 1 ? 1 : Math.ceil(targetTokens.length * 0.6);

    return matchedTokens.length >= requiredMatches;
  });
}

type ExchangeScanState = {
  completed: number;
  awaitingUserResponse: boolean;
  userSpokeSincePrompt: boolean;
  lastUserText: string | null;
};

function createExchangeScanState(): ExchangeScanState {
  return {
    completed: 0,
    awaitingUserResponse: false,
    userSpokeSincePrompt: false,
    lastUserText: null,
  };
}

function applyTranscriptMessage(
  state: ExchangeScanState,
  message: LessonTranscriptMessage,
  exchanges: ConversationExchange[] | undefined,
): ExchangeScanState {
  if (message.role === "ai") {
    if (
      state.userSpokeSincePrompt &&
      state.lastUserText &&
      isAffirmationMessage(message.text)
    ) {
      const exchange = exchanges?.[state.completed];
      const attemptMatches = exchange
        ? phraseMatchesExchange(state.lastUserText, exchange)
        : true;

      if (attemptMatches) {
        return {
          completed: state.completed + 1,
          awaitingUserResponse: true,
          userSpokeSincePrompt: false,
          lastUserText: null,
        };
      }
    }

    return {
      ...state,
      awaitingUserResponse: true,
      userSpokeSincePrompt: false,
      lastUserText: null,
    };
  }

  if (
    message.role === "user" &&
    state.awaitingUserResponse &&
    message.text.trim().length >= MIN_USER_RESPONSE_LENGTH
  ) {
    return {
      ...state,
      userSpokeSincePrompt: true,
      lastUserText: message.text,
    };
  }

  return state;
}

function scanExchangeProgress(
  messages: LessonTranscriptMessage[],
  options?: ExchangeProgressOptions,
): ExchangeScanState {
  return messages.reduce(
    (state, message) => applyTranscriptMessage(state, message, options?.exchanges),
    createExchangeScanState(),
  );
}

export function countCompletedConversationExchanges(
  messages: LessonTranscriptMessage[],
  options?: ExchangeProgressOptions,
): number {
  return scanExchangeProgress(messages, options).completed;
}

export function getConversationProgressPercent(
  completedExchanges: number,
  totalExchanges: number,
): number {
  if (totalExchanges <= 0) {
    return 0;
  }

  const ratio = Math.min(1, completedExchanges / totalExchanges);
  return Math.round(ratio * 100);
}

export function hasCompletedAllConversationExchanges(
  messages: LessonTranscriptMessage[],
  totalExchanges: number,
  options?: ExchangeProgressOptions,
): boolean {
  if (totalExchanges <= 0) {
    return false;
  }

  return (
    countCompletedConversationExchanges(messages, options) >= totalExchanges
  );
}

export function hasReceivedFinalAgentFeedback(
  messages: LessonTranscriptMessage[],
  totalExchanges: number,
  options?: ExchangeProgressOptions,
): boolean {
  if (!hasCompletedAllConversationExchanges(messages, totalExchanges, options)) {
    return false;
  }

  let state = createExchangeScanState();
  let lastCompletionAiIndex: number | null = null;

  for (let index = 0; index < messages.length; index += 1) {
    const message = messages[index];
    const previousCompleted = state.completed;
    state = applyTranscriptMessage(state, message, options?.exchanges);

    if (state.completed > previousCompleted && state.completed === totalExchanges) {
      lastCompletionAiIndex = index;
    }
  }

  if (lastCompletionAiIndex === null) {
    return false;
  }

  const completionMessage = messages[lastCompletionAiIndex];
  if (
    completionMessage?.role === "ai" &&
    isLessonClosingMessage(completionMessage.text)
  ) {
    return true;
  }

  return messages
    .slice(lastCompletionAiIndex + 1)
    .some((message) => message.role === "ai");
}

export function isConversationLessonComplete(
  messages: LessonTranscriptMessage[],
  totalExchanges: number,
  isTeacherSpeaking: boolean,
  options?: ExchangeProgressOptions,
): boolean {
  return (
    hasReceivedFinalAgentFeedback(messages, totalExchanges, options) &&
    !isTeacherSpeaking
  );
}
