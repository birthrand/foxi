import { View } from "react-native";

import { onboardingSpacing } from "@/constants/onboarding-spacing";

type OnboardingPaginationDotsProps = {
  total: number;
  currentIndex: number;
  specSized?: boolean;
};

export function OnboardingPaginationDots({
  total,
  currentIndex,
  specSized = true,
}: OnboardingPaginationDotsProps) {
  const gap = specSized ? onboardingSpacing.paginationGap : 8;
  const activeSize = specSized ? onboardingSpacing.paginationActive : 10;
  const inactiveSize = specSized ? onboardingSpacing.paginationInactive : 8;

  return (
    <View
      className="flex-row items-center justify-center"
      style={{
        gap,
        marginTop: specSized ? onboardingSpacing.secondaryToPagination : 40,
      }}
    >
      {Array.from({ length: total }, (_, index) => {
        const isActive = index === currentIndex;
        const size = isActive ? activeSize : inactiveSize;

        return (
          <View
            key={index}
            className={isActive ? "bg-foxi-orange" : "bg-[#FFD9B8]"}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
            }}
          />
        );
      })}
    </View>
  );
}
