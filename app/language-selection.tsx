import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LanguageCard } from "@/components/language/language-card";
import { LanguageContinueButton } from "@/components/language/language-continue-button";
import {
  LANGUAGE_SELECTION_BACKGROUND,
  languageSelectionSpacing,
} from "@/constants/language-selection-spacing";
import { getAvailableLanguages } from "@/data/languages";
import { useLanguageStore } from "@/store/language-store";
import type { LanguageCode } from "@/types/learning";

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const setSelectedLanguage = useLanguageStore(
    (state) => state.setSelectedLanguage,
  );
  const storedLanguageCode = useLanguageStore(
    (state) => state.selectedLanguageCode,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCode, setSelectedCode] = useState<LanguageCode | null>(
    storedLanguageCode,
  );

  const availableLanguages = getAvailableLanguages();

  const filteredLanguages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return availableLanguages;
    }

    return availableLanguages.filter(
      (language) =>
        language.name.toLowerCase().includes(query) ||
        language.nativeName.toLowerCase().includes(query),
    );
  }, [availableLanguages, searchQuery]);

  const handleContinue = () => {
    if (!selectedCode) {
      return;
    }
    setSelectedLanguage(selectedCode);
    router.replace("/");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: LANGUAGE_SELECTION_BACKGROUND }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          className="flex-1"
          style={{ paddingHorizontal: languageSelectionSpacing.screenPadding }}
        >
          <View
            className="flex-row items-center"
            style={{
              marginTop: languageSelectionSpacing.headerTop,
              minHeight: languageSelectionSpacing.backButtonSize,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="items-center justify-center"
              style={{
                width: languageSelectionSpacing.backButtonSize,
                height: languageSelectionSpacing.backButtonSize,
                // borderRadius: languageSelectionSpacing.backButtonSize / 2,
                // boxShadow: "0 2px 8px rgba(13, 19, 43, 0.1)",
              }}
            >
              <Ionicons name="chevron-back" size={22} color="#0d132b" />
            </Pressable>

            <Text
              className="flex-1 text-center text-[18px] text-deep-navy"
              style={{ fontFamily: "Poppins_700Regular" }}
            >
              Choose your language
            </Text>

            <View style={{ width: languageSelectionSpacing.backButtonSize }} />
          </View>

          <View
            className="mt-6 flex-row items-center px-4"
            style={{
              height: languageSelectionSpacing.searchHeight,
              borderWidth: 1,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: 8,
              // boxShadow: "0 2px 8px rgba(13, 19, 43, 0.08)",
            }}
          >
            <Ionicons name="search" size={20} color="#94A3B8" />
            <TextInput
              className="ml-3 flex-1 text-[15px] text-deep-navy"
              style={{ fontFamily: "Poppins_400Regular" }}
              placeholder="Search languages"
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingTop: languageSelectionSpacing.searchToList,
              paddingBottom: languageSelectionSpacing.listToButton,
            }}
          >
            <Text
              className="text-[14px] text-secondary"
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              Popular
            </Text>

            <View
              style={{
                marginTop: languageSelectionSpacing.sectionToCards,
                gap: languageSelectionSpacing.cardGap,
              }}
            >
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((language) => (
                  <LanguageCard
                    key={language.code}
                    language={language}
                    isSelected={selectedCode === language.code}
                    onPress={() => setSelectedCode(language.code)}
                  />
                ))
              ) : (
                <Text
                  className="py-8 text-center text-[15px] text-secondary"
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
                  No languages match your search.
                </Text>
              )}
            </View>
          </ScrollView>

          <View
            style={{ paddingBottom: languageSelectionSpacing.screenPadding }}
          >
            <LanguageContinueButton
              onPress={handleContinue}
              disabled={!selectedCode}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
