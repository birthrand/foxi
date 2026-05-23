import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import { languageSelectionSpacing } from "@/constants/language-selection-spacing";
import type { Language } from "@/types/learning";

type LanguageCardProps = {
  language: Language;
  isSelected: boolean;
  onPress: () => void;
};

export function LanguageCard({
  language,
  isSelected,
  onPress,
}: LanguageCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${language.name}, ${language.learnerCountLabel}`}
      className="flex-row items-center"
      style={{
        padding: languageSelectionSpacing.cardPadding,
        borderRadius: languageSelectionSpacing.cardRadius,
        borderCurve: "continuous",
        backgroundColor: isSelected ? "#FFF3E0" : "#ffffff",
        borderWidth: isSelected ? 2 : 0,
        borderColor: isSelected ? "#ff7a00" : "transparent",
        boxShadow: isSelected
          ? "none"
          : "0 2px 8px rgba(13, 19, 43, 0.08)",
      }}
    >
      <View
        className="items-center justify-center bg-surface"
        style={{
          width: languageSelectionSpacing.flagSize,
          height: languageSelectionSpacing.flagSize,
          borderRadius: languageSelectionSpacing.flagSize / 2,
        }}
      >
        <Text className="text-[26px]">{language.flagEmoji}</Text>
      </View>

      <View className="ml-3.5 min-w-0 flex-1">
        <Text
          className="text-[17px] text-deep-navy"
          style={{ fontFamily: "Poppins_600SemiBold" }}
        >
          {language.name}
        </Text>
        <Text
          className="mt-0.5 text-body-md text-secondary"
          style={{ fontFamily: "Poppins_400Regular" }}
        >
          {language.learnerCountLabel}
        </Text>
      </View>

      <View
        className="items-center justify-center"
        style={{
          width: languageSelectionSpacing.selectionIndicatorSize,
          height: languageSelectionSpacing.selectionIndicatorSize,
          borderRadius:
            languageSelectionSpacing.selectionIndicatorSize / 2,
          backgroundColor: isSelected ? "#ff7a00" : "transparent",
          borderWidth: isSelected ? 0 : 2,
          borderColor: "#D1D5DB",
        }}
      >
        {isSelected ? (
          <Ionicons name="checkmark" size={16} color="#ffffff" />
        ) : null}
      </View>
    </Pressable>
  );
}
