import { getLessonWithLanguage } from "@/data/lessons";
import { getLessonScreenData } from "@/lib/lesson-screen-data";
import { useLearningProgressStore } from "@/store/learning-progress-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LessonAiHeader } from "@/components/lesson/lesson-ai-header";
import { LessonAiStatusBar } from "@/components/lesson/lesson-ai-status-bar";
import { LessonChatMessages } from "@/components/lesson/lesson-chat-messages";
import { LessonConversationProgress } from "@/components/lesson/lesson-conversation-progress";
import { LessonListeningPanel } from "@/components/lesson/lesson-listening-panel";
import { LessonStreakModal } from "@/components/lesson/lesson-streak-modal";
import { lessonSpace, lessonSpacing } from "@/constants/lesson-spacing";

type ConversationPhase = "ai-speaking" | "ready";

function getTeacherSpeakingDuration(prompt: string): number {
  return Math.min(4000, Math.max(1500, prompt.length * 50));
}

export default function LessonDetailScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = id ? getLessonWithLanguage(id) : undefined;

  const streakDays = useLearningProgressStore((state) => state.streakDays);
  const completedLessonIds = useLearningProgressStore(
    (state) => state.completedLessonIds,
  );
  const setLessonProgress = useLearningProgressStore(
    (state) => state.setLessonProgress,
  );
  const completeLesson = useLearningProgressStore(
    (state) => state.completeLesson,
  );

  const screenData = useMemo(
    () => (lesson ? getLessonScreenData(lesson) : null),
    [lesson],
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showCurrentUserMessage, setShowCurrentUserMessage] = useState(false);
  const [conversationPhase, setConversationPhase] =
    useState<ConversationPhase>("ai-speaking");
  const [isStreakModalVisible, setIsStreakModalVisible] = useState(false);

  const totalXp = useMemo(() => {
    const baseXp = completedLessonIds.length * 50;
    const lessonBonus = lesson?.xpReward ?? 0;
    const stepBonus = currentStepIndex * 10;

    return baseXp + lessonBonus + stepBonus + 500;
  }, [completedLessonIds.length, currentStepIndex, lesson?.xpReward]);

  const streakModalContent = useMemo(
    () => screenData?.getStreakModalContent(streakDays),
    [screenData, streakDays],
  );

  const currentExchange = screenData?.exchanges[currentStepIndex];

  useEffect(() => {
    if (!currentExchange) {
      return;
    }

    setConversationPhase("ai-speaking");

    const timer = setTimeout(
      () => setConversationPhase("ready"),
      getTeacherSpeakingDuration(currentExchange.aiPrompt),
    );

    return () => clearTimeout(timer);
  }, [currentExchange]);

  if (!lesson || !screenData || screenData.exchanges.length === 0) {
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
            onPress={() => router.back()}
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

  const completedExchanges = screenData.exchanges.slice(0, currentStepIndex);
  const isLastStep = currentStepIndex === screenData.totalExchanges - 1;
  const completedCount = showCurrentUserMessage
    ? currentStepIndex + 1
    : currentStepIndex;

  const canSpeak =
    conversationPhase === "ready" && !showCurrentUserMessage;

  const handleSpeak = () => {
    if (!canSpeak) {
      return;
    }

    setShowCurrentUserMessage(true);
    setConversationPhase("ai-speaking");

    setTimeout(() => {
      const nextIndex = currentStepIndex + 1;
      const progressPercent = Math.round(
        (nextIndex / screenData.totalExchanges) * 100,
      );

      setLessonProgress(lesson.id, progressPercent);

      if (isLastStep) {
        completeLesson(lesson.id);
        router.back();
        return;
      }

      setCurrentStepIndex(nextIndex);
      setShowCurrentUserMessage(false);
    }, 900);
  };

  const handleEnd = () => {
    const progressPercent = Math.round(
      (completedCount / screenData.totalExchanges) * 100,
    );

    setLessonProgress(lesson.id, progressPercent);
    router.back();
  };

  const handleHint = () => {
    if (!currentExchange) {
      return;
    }

    Alert.alert("Hint", currentExchange.hint);
  };

  const handleBack = () => {
    router.back();
  };

  return (
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

        <LessonAiStatusBar
          tagLabel={screenData.tagLabel}
          streakDays={streakDays}
          totalXp={totalXp}
          onStreakPress={() => setIsStreakModalVisible((previous) => !previous)}
        />

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: lessonSpacing.statusToChat,
            paddingBottom: lessonSpace.sm,
          }}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          <LessonChatMessages
            completedExchanges={completedExchanges}
            currentExchange={currentExchange}
            showCurrentUserMessage={showCurrentUserMessage}
            onHintPress={handleHint}
          />
        </ScrollView>

        <View
          style={{
            marginTop: lessonSpacing.statusToChat,
            paddingBottom: lessonSpacing.progressBottomPadding,
          }}
        >
          <LessonListeningPanel
            speakInstruction={screenData.speakInstruction}
            isTeacherSpeaking={conversationPhase === "ai-speaking"}
            canSpeak={canSpeak}
            onSpeakPress={handleSpeak}
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
            completedExchanges={completedCount}
            totalExchanges={screenData.totalExchanges}
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
    </SafeAreaView>
  );
}
