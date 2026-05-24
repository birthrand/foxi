import { View } from "react-native";

import { HomeRecentVocabularyCard } from "@/components/home/home-recent-vocabulary-card";
import { HomeSectionHeader } from "@/components/home/home-section-header";
import { homeSpacing } from "@/constants/home-spacing";
import type { RecentVocabularyItem } from "@/lib/home-data";

type HomeRecentVocabularySectionProps = {
  items: RecentVocabularyItem[];
  onSeeAll?: () => void;
  onItemPress?: (item: RecentVocabularyItem) => void;
};

const SEE_ALL_ORANGE = "#ff7a00";

export function HomeRecentVocabularySection({
  items,
  onSeeAll,
  onItemPress,
}: HomeRecentVocabularySectionProps) {
  return (
    <View>
      <HomeSectionHeader
        title="Recent Vocabulary"
        onSeeAll={onSeeAll}
        seeAllLabel="View all"
        seeAllColor={SEE_ALL_ORANGE}
      />

      <View style={{ marginTop: homeSpacing.sectionHeaderToCards }}>
        <HomeRecentVocabularyCard items={items} onItemPress={onItemPress} />
      </View>
    </View>
  );
}
