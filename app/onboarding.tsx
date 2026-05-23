import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OnboardingAccountLink } from "@/components/onboarding/onboarding-account-link";
import { OnboardingPaginationDots } from "@/components/onboarding/onboarding-pagination-dots";
import { OnboardingPrimaryButton } from "@/components/onboarding/onboarding-primary-button";
import { OnboardingSlide } from "@/components/onboarding/onboarding-slide";
import { onboardingSpacing } from "@/constants/onboarding-spacing";
import { onboardingSlides } from "@/data/onboarding";

const ONBOARDING_BACKGROUND = "#FFFBF5";
const DEFAULT_PRIMARY_LABEL = "Continue";
const FINAL_PRIMARY_LABEL = "Start learning";
const DEFAULT_SECONDARY_LABEL = "I already have an account";

export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<(typeof onboardingSlides)[number]>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = onboardingSlides[activeIndex];
  const isLastSlide = activeIndex === onboardingSlides.length - 1;

  const syncActiveIndex = useCallback(
    (offsetX: number) => {
      if (width <= 0) {
        return;
      }
      const index = Math.round(offsetX / width);
      if (index >= 0 && index < onboardingSlides.length) {
        setActiveIndex(index);
      }
    },
    [width],
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    syncActiveIndex(event.nativeEvent.contentOffset.x);
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    syncActiveIndex(event.nativeEvent.contentOffset.x);
  };

  const goToNextSlide = () => {
    if (isLastSlide) {
      router.replace("/");
      return;
    }

    const nextIndex = activeIndex + 1;
    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    setActiveIndex(nextIndex);
  };

  const handleExploreOnOwn = () => {
    router.replace("/");
  };

  const primaryLabel =
    activeSlide.primaryButtonLabel ??
    (isLastSlide ? FINAL_PRIMARY_LABEL : DEFAULT_PRIMARY_LABEL);

  const secondaryLabel =
    activeSlide.secondaryLinkLabel ?? DEFAULT_SECONDARY_LABEL;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ONBOARDING_BACKGROUND }}>
      <View className="flex-1">
        <FlatList
          ref={listRef}
          className="min-h-0 flex-1"
          data={onboardingSlides}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={{ width, flex: 1 }}>
              <OnboardingSlide slide={item} />
            </View>
          )}
        />
        <View
          className="shrink"
          style={{
            paddingHorizontal: onboardingSpacing.screenPadding,
            paddingBottom: onboardingSpacing.paginationToBottom,
          }}
        >
          <OnboardingPrimaryButton label={primaryLabel} onPress={goToNextSlide} />
          <OnboardingAccountLink
            label={secondaryLabel}
            onPress={
              activeSlide.secondaryLinkLabel ? handleExploreOnOwn : undefined
            }
          />
          <OnboardingPaginationDots
            total={onboardingSlides.length}
            currentIndex={activeIndex}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
