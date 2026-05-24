import { Pressable, Text, View } from "react-native";

import { LESSON_TAG_BG, lessonSpacing } from "@/constants/lesson-spacing";

type LessonAiStatusBarProps = {
  tagLabel: string;
  streakDays: number;
  totalXp: number;
  onStreakPress: () => void;
};

const DIVIDER_COLOR = "#E5E7EB";

export function LessonAiStatusBar({
  tagLabel,
  streakDays,
  totalXp,
  onStreakPress,
}: LessonAiStatusBarProps) {
  const xpProgressPercent = Math.min(100, (totalXp % 100) + 20);

  return (
    <View
      className="flex-row items-center justify-between"
      style={{ marginTop: lessonSpacing.headerToStatus }}
    >
      <View
        className="flex-row items-center"
        style={{
          gap: 6,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: LESSON_TAG_BG,
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#22C55E",
          }}
        />
        <Text
          className="text-deep-navy"
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 13,
            lineHeight: 18,
          }}
        >
          {tagLabel}
        </Text>
      </View>

      <View
        className="flex-row items-center bg-white"
        style={{
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#F3F4F6",
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${streakDays} day streak. Tap for details.`}
          onPress={onStreakPress}
          className="flex-row items-center active:opacity-80"
          style={{ gap: 4 }}
        >
          <View>
            <View
              className="flex-row items-center justify-center"
              style={{ gap: 2 }}
            >
              <Text
                className="text-deep-navy"
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 14,
                }}
              >
                {streakDays}
              </Text>
            </View>
            <Text
              className="text-secondary"
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 10,
                lineHeight: 12,
              }}
            >
              day streak
            </Text>
          </View>
        </Pressable>

        <View
          style={{
            width: 1,
            height: 32,
            backgroundColor: DIVIDER_COLOR,
            marginHorizontal: 12,
          }}
        />

        <View style={{ minWidth: 72 }}>
          <View
            className="flex-row items-center justify-center"
            style={{ gap: 4 }}
          >
            <Text
              className="text-deep-navy"
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                lineHeight: 18,
              }}
            >
              {totalXp} XP
            </Text>
          </View>
          {/* <View
            style={{
              marginTop: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#F3F4F6",
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${xpProgressPercent}%`,
                height: "100%",
                borderRadius: 2,
                backgroundColor: "#ff7a00",
              }}
            />
          </View> */}
        </View>
      </View>
    </View>
  );
}
