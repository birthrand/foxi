import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import {
  LEARN_CARD_SHADOW,
  learnSpace,
  learnSpacing,
} from "@/constants/learn-spacing";
import type { LessonListItem } from "@/lib/learn-data";

type LessonCardProps = {
  item: LessonListItem;
  onPress?: () => void;
};

function StatusAction({ item }: { item: LessonListItem }) {
  if (item.status === "completed") {
    return (
      <View
        className="items-center justify-center"
        style={{
          width: learnSpacing.statusIconSize,
          height: learnSpacing.statusIconSize,
          borderRadius: learnSpacing.statusIconSize / 2,
          backgroundColor: "#22c55e",
        }}
      >
        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
      </View>
    );
  }

  if (item.status === "in_progress") {
    return (
      <View
        className="items-center justify-center"
        style={{
          width: learnSpacing.statusIconSize +4,
          height: learnSpacing.statusIconSize +4,
          borderRadius: learnSpacing.statusIconSize / 2,
          backgroundColor: "",
        }}
      >
        <Ionicons name="arrow-forward-circle" size={32} color="#ff7a00" />
      </View>
    );
  }

  return (
    <View
      className="items-center justify-center"
      style={{
        width: learnSpacing.statusIconSize,
        height: learnSpacing.statusIconSize,
        borderRadius: learnSpacing.statusIconSize / 2,
        backgroundColor: "#F3F4F6",
      }}
    >
      <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" />
    </View>
  );
}

export function LessonCard({ item, onPress }: LessonCardProps) {
  const { lesson, status, progressPercent, completedExchanges, totalExchanges } =
    item;
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isActive = status === "in_progress";
  const hasConversationProgress =
    isActive && totalExchanges > 0 && completedExchanges > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${lesson.title}. ${lesson.description}`}
      accessibilityState={{ disabled: isLocked }}
      onPress={isLocked ? undefined : onPress}
      disabled={isLocked}
      className="active:opacity-90"
      style={{
        borderRadius: learnSpacing.lessonCardRadius,
        backgroundColor: isActive ? "#FFFFFF" : "#FFF7ED",
        borderWidth: isActive ? 0 : 0,
        borderColor: isActive ? "#ff7a00" : "#E5E7EB",
        paddingHorizontal: learnSpacing.lessonCardPadding,
        paddingTop: learnSpacing.lessonCardPadding,
        paddingBottom: isActive
          ? learnSpacing.lessonCardPadding
          : learnSpace.xs,
        ...(isActive ? LEARN_CARD_SHADOW : {}),
      }}
    >
      <View className="flex-row items-start" style={{ gap: 10 }}>
        {/* <View
          accessibilityLabel={`${lesson.title} chat lesson`}
          className="items-center justify-center"
          style={{
            width: learnSpacing.lessonIconSize,
            height: learnSpacing.lessonIconSize,
            borderRadius: learnSpacing.lessonIconRadius,
            backgroundColor: isActive ? "rgba(255, 232, 212, 0)" : "",
            opacity: isLocked ? 0.55 : 1,
          }}
        >
          <Ionicons
            name="headset-outline"
            size={22}
            color={isLocked ? "#94A3B8" : "#ff7a00"}
          />
        </View> */}

        <View className="min-w-0 flex-1">
          <Text
            className="text-deep-navy"
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 16,
              lineHeight: 22,
              opacity: isLocked ? 0.55 : 1,
            }}
            numberOfLines={1}
          >
            {lesson.title}
          </Text>
          {/* <Text
            className="text-secondary"
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              lineHeight: 16,
              marginTop: 1,
              opacity: isLocked ? 0.55 : 1,
            }}
            numberOfLines={1}
          >
            {lesson.description}
          </Text> */}
          <Text
            className="text-secondary"
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 11,
              lineHeight: 14,
              marginTop: 4,
              opacity: isLocked ? 0.55 : 1,
            }}
          >
            {isCompleted
              ? `Completed · tap to practice again`
              : hasConversationProgress
                ? `${completedExchanges}/${totalExchanges} exchanges · ${lesson.estimatedMinutes} min`
                : `${lesson.estimatedMinutes} min · ${lesson.xpReward} XP`}
          </Text>

          {isActive ? (
            <View
              style={{
                marginTop: 6,
                height: learnSpacing.progressBarHeight,
                borderRadius: learnSpacing.progressBarHeight / 2,
                backgroundColor: "#F3F4F6",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  borderRadius: learnSpacing.progressBarHeight / 2,
                  backgroundColor: "#ff7a00",
                }}
              />
            </View>
          ) : null}
        </View>

        <View style={{ marginTop: 8 }}>
          <StatusAction item={item} />
        </View>
      </View>
    </Pressable>
  );
}
