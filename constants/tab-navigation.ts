import type { ComponentProps } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

export type TabRouteName =
  | "index"
  | "learn"
  | "practice"
  | "progress"
  | "profile";

export type TabItemConfig = {
  route: TabRouteName;
  label: string;
  icon: IoniconName;
  activeIcon: IoniconName;
};

export const TAB_ITEMS: TabItemConfig[] = [
  {
    route: "index",
    label: "Home",
    icon: "home-outline",
    activeIcon: "home",
  },
  {
    route: "learn",
    label: "Learn",
    icon: "book-outline",
    activeIcon: "book",
  },
  {
    route: "practice",
    label: "Practice",
    icon: "flash-outline",
    activeIcon: "flash",
  },
  {
    route: "progress",
    label: "Progress",
    icon: "bar-chart-outline",
    activeIcon: "bar-chart",
  },
  {
    route: "profile",
    label: "Profile",
    icon: "person-outline",
    activeIcon: "person",
  },
];

const circleSize = 52;
const iconSize = 22;
const iconToLabelGap = 2;

export const TAB_BAR = {
  circleSize,
  iconSize,
  labelFontSize: 10,
  labelLineHeight: 14,
  barPaddingTop: 10,
  iconToLabelGap,
  inactiveLabelMarginTop: -((circleSize - iconSize) / 2) + iconToLabelGap,
} as const;
