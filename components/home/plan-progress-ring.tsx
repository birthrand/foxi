import Svg, { Circle } from "react-native-svg";
import { Text, View } from "react-native";

type PlanProgressRingProps = {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  labelColor?: string;
};

export function PlanProgressRing({
  percent,
  size = 44,
  strokeWidth = 3,
  color = "#FFFFFF",
  labelColor = "#FFFFFF",
}: PlanProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const strokeDashoffset =
    circumference - (clampedPercent / 100) * circumference;

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text
        style={{
          position: "absolute",
          fontFamily: "Poppins_600SemiBold",
          fontSize: 11,
          lineHeight: 14,
          color: labelColor,
        }}
      >
        {clampedPercent}%
      </Text>
    </View>
  );
}
