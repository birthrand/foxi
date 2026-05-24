import { getLessonById, getLessonWithLanguage } from "@/data/lessons";
import {
  countCompletedConversationExchanges,
  hasCompletedAllConversationExchanges,
  isConversationLessonComplete,
} from "@/lib/lesson-conversation-progress";
import { getLessonScreenData } from "@/lib/lesson-screen-data";
import { isLessonAccessible } from "@/lib/lesson-access";
import { getNextLessonInPath } from "@/lib/language-progress";
import { useSelectedLanguageCode } from "@/store/language-store";
import { useLearningProgressStore } from "@/store/learning-progress-store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LessonAiHeader } from "@/components/lesson/lesson-ai-header";
import { LessonAiStatusBar } from "@/components/lesson/lesson-ai-status-bar";
import { LessonChatMessages } from "@/components/lesson/lesson-chat-messages";
import { LessonCompleteModal } from "@/components/lesson/lesson-complete-modal";
import { LessonConversationProgress } from "@/components/lesson/lesson-conversation-progress";
import { LessonEndConfirmModal } from "@/components/lesson/lesson-end-confirm-modal";
import { LessonListeningPanel } from "@/components/lesson/lesson-listening-panel";
import { LessonStreakModal } from "@/components/lesson/lesson-streak-modal";
import { LessonStreamCallBanner } from "@/components/lesson/lesson-stream-call-banner";
import { LessonStreamSession } from "@/components/lesson/lesson-stream-session";
import { lessonSpace, lessonSpacing } from "@/constants/lesson-spacing";
import { useLessonTranscript } from "@/hooks/use-lesson-transcript";
import { useStreamAudioLesson } from "@/hooks/use-stream-audio-lesson";
import { useVisionAgent } from "@/hooks/use-vision-agent";

function exitLesson(router: ReturnType<typeof useRouter>) {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace("/(tabs)/learn");
}

export default function LessonDetailScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const selectedLanguageCode = useSelectedLanguageCode();
  const completedLessonIds = useLearningProgressStore(
    (state) => state.completedLessonIds,
  );
  const lessonProgressPercent = useLearningProgressStore(
    (state) => state.lessonProgressPercent,
  );
  const lessonExchangeProgress = useLearningProgressStore(
    (state) => state.lessonExchangeProgress,
  );

  const lesson = useMemo(() => {
    if (!id || !selectedLanguageCode) {
      return undefined;
    }

    const requestedLesson = getLessonWithLanguage(id);
    if (
      !requestedLesson ||
      requestedLesson.languageCode !== selectedLanguageCode
    ) {
      return undefined;
    }

    return requestedLesson;
  }, [id, selectedLanguageCode]);

  const isLessonLocked = useMemo(() => {
    if (!lesson || !selectedLanguageCode) {
      return false;
    }

    return !isLessonAccessible(lesson, selectedLanguageCode, {
      completedLessonIds,
      lessonProgressPercent,
      lessonExchangeProgress,
    });
  }, [
    completedLessonIds,
    lesson,
    lessonExchangeProgress,
    lessonProgressPercent,
    selectedLanguageCode,
  ]);

  const streakDays = useLearningProgressStore((state) => state.streakDays);
  const setLessonExchangeProgress = useLearningProgressStore(
    (state) => state.setLessonExchangeProgress,
  );
  const completeLesson = useLearningProgressStore(
    (state) => state.completeLesson,
  );

  const screenData = useMemo(
    () => (lesson ? getLessonScreenData(lesson) : null),
    [lesson],
  );

  const streamLesson = useStreamAudioLesson({
    enabled: Boolean(lesson),
    lessonId: lesson?.id ?? "",
    languageCode: lesson?.languageCode ?? selectedLanguageCode ?? "es",
    lessonTitle: lesson?.title ?? "",
    lessonGoal: lesson?.goal ?? "",
  });

  const visionAgent = useVisionAgent({
    enabled: Boolean(streamLesson.callSession),
    callId: streamLesson.callSession?.callId ?? null,
    callType: streamLesson.callSession?.callType ?? null,
    lessonCustom: streamLesson.callSession?.lessonCustom ?? null,
  });

  const [isStreakModalVisible, setIsStreakModalVisible] = useState(false);
  const [isCompletionModalVisible, setIsCompletionModalVisible] =
    useState(false);
  const [isEndConfirmModalVisible, setIsEndConfirmModalVisible] =
    useState(false);
  const hasMarkedLessonCompleteRef = useRef(false);
  const isOpeningCompletionModalRef = useRef(false);

  const totalXp = useMemo(() => {
    const baseXp = completedLessonIds.length * 50;
    const lessonBonus = lesson?.xpReward ?? 0;

    return baseXp + lessonBonus + 500;
  }, [completedLessonIds.length, lesson?.xpReward]);

  const streakModalContent = useMemo(
    () => screenData?.getStreakModalContent(streakDays),
    [screenData, streakDays],
  );

  const isStreamConnected =
    streamLesson.status === "joined" || streamLesson.status === "muted";

  const transcriptMessages = useLessonTranscript(
    streamLesson.call,
    streamLesson.userId,
    Boolean(lesson) && isStreamConnected,
    streamLesson.isLive,
  );

  useEffect(() => {
    if (!id || !lesson || !selectedLanguageCode) {
      return;
    }

    const requestedLesson = getLessonById(id);

    if (
      requestedLesson &&
      requestedLesson.languageCode !== selectedLanguageCode &&
      lesson.id !== id
    ) {
      router.replace({
        pathname: "/lesson/[id]",
        params: { id: lesson.id },
      });
    }
  }, [id, lesson, router, selectedLanguageCode]);

  useEffect(() => {
    if (transcriptMessages.length === 0 && !streamLesson.isTeacherSpeaking) {
      return;
    }

    scrollRef.current?.scrollToEnd({ animated: true });
  }, [streamLesson.isTeacherSpeaking, transcriptMessages.length]);

  const conversationProgressOptions = useMemo(
    () =>
      screenData
        ? { exchanges: screenData.exchanges }
        : undefined,
    [screenData],
  );

  const liveConversationProgress = useMemo(() => {
    if (!screenData || !isStreamConnected) {
      return 0;
    }

    return Math.min(
      screenData.totalExchanges,
      countCompletedConversationExchanges(
        transcriptMessages,
        conversationProgressOptions,
      ),
    );
  }, [
    conversationProgressOptions,
    isStreamConnected,
    screenData,
    transcriptMessages,
  ]);

  const isConversationComplete = Boolean(
    screenData &&
      isConversationLessonComplete(
        transcriptMessages,
        screenData.totalExchanges,
        streamLesson.isTeacherSpeaking,
        conversationProgressOptions,
      ),
  );

  const isAwaitingFinalFeedback = Boolean(
    screenData &&
      hasCompletedAllConversationExchanges(
        transcriptMessages,
        screenData.totalExchanges,
        conversationProgressOptions,
      ) &&
      !isConversationComplete,
  );

  const nextLessonInPathId = useMemo(() => {
    if (!lesson || !selectedLanguageCode) {
      return null;
    }

    return getNextLessonInPath(selectedLanguageCode, lesson.id);
  }, [lesson, selectedLanguageCode]);

  const nextLesson = useMemo(
    () =>
      nextLessonInPathId ? getLessonWithLanguage(nextLessonInPathId) : undefined,
    [nextLessonInPathId],
  );

  const hasNextLesson = Boolean(nextLessonInPathId);

  const markLessonComplete = useCallback(() => {
    if (!lesson || hasMarkedLessonCompleteRef.current) {
      return;
    }

    hasMarkedLessonCompleteRef.current = true;
    completeLesson(lesson.id);
  }, [completeLesson, lesson]);

  const openCompletionModal = useCallback(async () => {
    if (isOpeningCompletionModalRef.current) {
      return;
    }

    isOpeningCompletionModalRef.current = true;
    markLessonComplete();
    await streamLesson.endCall();
    setIsCompletionModalVisible(true);
    isOpeningCompletionModalRef.current = false;
  }, [markLessonComplete, streamLesson]);

  const handleBackToLearn = useCallback(() => {
    setIsCompletionModalVisible(false);
    exitLesson(router);
  }, [router]);

  const handleNextLesson = useCallback(() => {
    setIsCompletionModalVisible(false);

    if (!nextLessonInPathId) {
      handleBackToLearn();
      return;
    }

    hasMarkedLessonCompleteRef.current = false;
    router.replace({
      pathname: "/lesson/[id]",
      params: { id: nextLessonInPathId },
    });
  }, [handleBackToLearn, nextLessonInPathId, router]);

  const handleConfirmEndLesson = useCallback(async () => {
    setIsEndConfirmModalVisible(false);
    await streamLesson.endCall();
    exitLesson(router);
  }, [router, streamLesson]);

  useEffect(() => {
    hasMarkedLessonCompleteRef.current = false;
    isOpeningCompletionModalRef.current = false;
    setIsCompletionModalVisible(false);
    setIsEndConfirmModalVisible(false);
  }, [lesson?.id]);

  useEffect(() => {
    if (!lesson || !screenData || screenData.totalExchanges === 0) {
      return;
    }

    if (completedLessonIds.includes(lesson.id)) {
      return;
    }

    if (!isStreamConnected && liveConversationProgress === 0) {
      return;
    }

    setLessonExchangeProgress(
      lesson.id,
      liveConversationProgress,
      screenData.totalExchanges,
    );
  }, [
    completedLessonIds,
    isStreamConnected,
    lesson,
    liveConversationProgress,
    screenData,
    setLessonExchangeProgress,
  ]);

  useEffect(() => {
    if (
      !isConversationComplete ||
      isCompletionModalVisible ||
      isEndConfirmModalVisible
    ) {
      return;
    }

    void openCompletionModal();
  }, [
    isConversationComplete,
    isCompletionModalVisible,
    isEndConfirmModalVisible,
    openCompletionModal,
    streamLesson.isTeacherSpeaking,
    transcriptMessages,
  ]);

  if (!lesson) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: lessonSpacing.screenBackground }}
      >
        <View className="flex-1 items-center justify-center px-6">
          <Text
            className="text-deep-navy"
            style={{ fontFamily: "Poppins_600SemiBold", fontSize: 18 }}
          >
            Lesson not found
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => exitLesson(router)}
            className="mt-4 active:opacity-80"
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 16,
                color: "#ff7a00",
              }}
            >
              Go back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (isLessonLocked || !screenData) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: lessonSpacing.screenBackground }}
      >
        <View className="flex-1 items-center justify-center px-6">
          <Text
            className="text-deep-navy"
            style={{ fontFamily: "Poppins_600SemiBold", fontSize: 18 }}
          >
            {isLessonLocked
              ? "Finish the previous lesson to unlock this one."
              : "Lesson not found"}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => exitLesson(router)}
            className="mt-4 active:opacity-80"
          >
            <Text
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 16,
                color: "#ff7a00",
              }}
            >
              Go back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleEnd = () => {
    if (isConversationComplete || isCompletionModalVisible) {
      return;
    }

    setIsEndConfirmModalVisible(true);
  };

  const handleBack = async () => {
    await streamLesson.endCall();
    exitLesson(router);
  };

  const sessionTagLabel = streamLesson.isLive ? "Live" : "Paused";

  return (
    <LessonStreamSession
      client={streamLesson.streamClient}
      call={streamLesson.call}
    >
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, backgroundColor: lessonSpacing.screenBackground }}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: lessonSpacing.screenPadding,
          }}
        >
          <LessonAiHeader title={screenData.headerTitle} onBack={handleBack} />

          <LessonStreamCallBanner
            status={streamLesson.status}
            statusMessage={streamLesson.statusMessage}
            errorMessage={streamLesson.errorMessage}
            agentStatus={visionAgent.status}
            agentStatusMessage={visionAgent.statusMessage}
            agentErrorMessage={visionAgent.errorMessage}
            onAgentRetry={visionAgent.retry}
            userDisplayName={streamLesson.userDisplayName}
            userImageUrl={streamLesson.userImageUrl}
            participantCount={streamLesson.participantCount}
            isMicMuted={streamLesson.isMicMuted}
            onRetry={streamLesson.retry}
          />

          <LessonAiStatusBar
            tagLabel={sessionTagLabel}
            streakDays={streakDays}
            totalXp={totalXp}
            onStreakPress={() =>
              setIsStreakModalVisible((previous) => !previous)
            }
          />

          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: lessonSpacing.statusToChat,
              paddingBottom: lessonSpace.sm,
            }}
          >
            <LessonChatMessages
              transcriptMessages={transcriptMessages}
              isTeacherSpeaking={streamLesson.isTeacherSpeaking}
            />
          </ScrollView>

          <View
            style={{
              marginTop: lessonSpacing.statusToChat,
              paddingBottom: lessonSpacing.progressBottomPadding,
            }}
          >
            <LessonListeningPanel
              isLive={streamLesson.isLive}
              isConnected={isStreamConnected}
              isTeacherSpeaking={streamLesson.isTeacherSpeaking}
              onToggleLivePress={streamLesson.toggleLiveConversation}
              streamStatusLabel={
                isStreamConnected ? streamLesson.statusMessage : undefined
              }
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="End conversation"
              onPress={handleEnd}
              className="active:opacity-80"
              style={{ marginTop: lessonSpacing.actionsToProgress }}
            >
              <View
                className="items-center justify-center"
                style={{
                  height: lessonSpacing.actionButtonHeight + 12,
                  borderRadius: lessonSpacing.cardRadius,
                  backgroundColor: "#EF4444",
                }}
              >
                <Ionicons
                  name="call"
                  size={32}
                  color="#FFFFFF"
                  style={{ transform: [{ rotate: "135deg" }] }}
                />
              </View>
            </Pressable>

            <LessonConversationProgress
              completedExchanges={liveConversationProgress}
              totalExchanges={screenData.totalExchanges}
              isComplete={isConversationComplete}
              isAwaitingFinalFeedback={isAwaitingFinalFeedback}
            />
          </View>
        </View>

        {streakModalContent ? (
          <LessonStreakModal
            visible={isStreakModalVisible}
            title={streakModalContent.title}
            description={streakModalContent.description}
            onClose={() => setIsStreakModalVisible(false)}
          />
        ) : null}

        <LessonEndConfirmModal
          visible={isEndConfirmModalVisible}
          onConfirm={() => {
            void handleConfirmEndLesson();
          }}
          onCancel={() => setIsEndConfirmModalVisible(false)}
        />

        <LessonCompleteModal
          visible={isCompletionModalVisible}
          lessonTitle={lesson.title}
          xpReward={lesson.xpReward}
          nextLessonTitle={nextLesson?.title ?? null}
          hasNextLesson={hasNextLesson}
          onNextLesson={handleNextLesson}
          onBackToLearn={handleBackToLearn}
        />
      </SafeAreaView>
    </LessonStreamSession>
  );
}
