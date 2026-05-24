import { Text, View } from "react-native";

import { learnSpacing, getTimelineConnectorHeight } from "@/constants/learn-spacing";
import type { LessonVisualStatus } from "@/lib/learn-data";

type LessonTimelineNodeProps = {
  number: number;
  status: LessonVisualStatus;
  isLast: boolean;
  nextStatus?: LessonVisualStatus;
  rowMinHeight?: number;
};

function getNodeColors(status: LessonVisualStatus) {
  switch (status) {
    case "completed":
      return {
        backgroundColor: "#0d132b",
        borderColor: "#0d132b",
        textColor: "#FFFFFF",
      };
    case "in_progress":
      return {
        backgroundColor: "#ff7a00",
        borderColor: "#ff7a00",
        textColor: "#FFFFFF",
      };
  }

  return {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    textColor: "#94A3B8",
  };
}

function getLineStyle(
  status: LessonVisualStatus,
  nextStatus?: LessonVisualStatus,
): { backgroundColor: string; opacity: number } {
  if (status === "completed" && nextStatus === "completed") {
    return { backgroundColor: "#0d132b", opacity: 1 };
  }

  if (
    status === "completed" &&
    (nextStatus === "in_progress" || nextStatus === "locked")
  ) {
    return { backgroundColor: "#ff7a00", opacity: 1 };
  }

  if (status === "in_progress") {
    return { backgroundColor: "#D1D5DB", opacity: 0.8 };
  }

  return { backgroundColor: "#D1D5DB", opacity: 0.5 };
}

export function LessonTimelineNode({
  number,
  status,
  isLast,
  nextStatus,
  rowMinHeight = learnSpacing.lessonRowMinHeightCompact,
}: LessonTimelineNodeProps) {
  const colors = getNodeColors(status);
  const lineStyle = getLineStyle(status, nextStatus);
  const nodeSize = learnSpacing.timelineNodeSize;
  const connectorHeight = getTimelineConnectorHeight(rowMinHeight);

  return (
    <View
      className="items-center justify-center"
      style={{
        width: nodeSize,
        height: nodeSize,
      }}
    >
      {!isLast ? (
        <View
          style={{
            position: "absolute",
            top: nodeSize + learnSpacing.timelineConnectorGap,
            left: (nodeSize - learnSpacing.timelineLineWidth) / 2,
            width: learnSpacing.timelineLineWidth,
            height: connectorHeight,
            borderRadius: 2,
            backgroundColor: lineStyle.backgroundColor,
            opacity: lineStyle.opacity,
          }}
        />
      ) : null}

      <View
        className="items-center justify-center"
        style={{
          width: nodeSize,
          height: nodeSize,
          borderRadius: nodeSize / 2,
          backgroundColor: colors.backgroundColor,
          borderWidth: status === "locked" ? 2 : 0,
          borderColor: colors.borderColor,
          zIndex: 1,
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 14,
            lineHeight: 18,
            color: colors.textColor,
          }}
        >
          {number}
        </Text>
      </View>
    </View>
  );
}
