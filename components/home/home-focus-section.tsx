import { View } from "react-native";

import { HomeFocusCard } from "@/components/home/home-focus-card";
import { HomeSectionHeader } from "@/components/home/home-section-header";
import { homeSpacing } from "@/constants/home-spacing";
import type { FocusItem } from "@/lib/home-data";

type HomeFocusSectionProps = {
  items: FocusItem[];
  onSeeAll?: () => void;
};

const PLAN_PURPLE = "#ff7a00";

export function HomeFocusSection({ items, onSeeAll }: HomeFocusSectionProps) {
  return (
    <View style={{ marginTop: homeSpacing.continueToFocus }}>
      <HomeSectionHeader
        title="Today's plan"
        onSeeAll={onSeeAll}
        seeAllLabel="View all"
        seeAllColor={PLAN_PURPLE}
      />

      <View
        style={{
          marginTop: homeSpacing.sectionHeaderToCards,
          gap: homeSpacing.focusCardGap,
        }}
      >
        {items.map((item) => (
          <HomeFocusCard key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
}
