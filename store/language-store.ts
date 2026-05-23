import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { LanguageCode } from "@/types/learning";

const LANGUAGE_STORAGE_KEY = "foxi-selected-language";

type LanguageStoreState = {
  selectedLanguageCode: LanguageCode | null;
  hasHydrated: boolean;
  setSelectedLanguage: (code: LanguageCode) => void;
  clearSelectedLanguage: () => void;
  setHasHydrated: (value: boolean) => void;
  clearLanguageStorageForTesting: () => Promise<void>;
};

export const useLanguageStore = create<LanguageStoreState>()(
  persist(
    (set) => ({
      selectedLanguageCode: null,
      hasHydrated: false,
      setSelectedLanguage: (code) => set({ selectedLanguageCode: code }),
      clearSelectedLanguage: () => set({ selectedLanguageCode: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      clearLanguageStorageForTesting: async () => {
        await useLanguageStore.persist.clearStorage();
        set({ selectedLanguageCode: null, hasHydrated: true });
      },
    }),
    {
      name: LANGUAGE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedLanguageCode: state.selectedLanguageCode,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function useSelectedLanguageCode(): LanguageCode | null {
  return useLanguageStore((state) => state.selectedLanguageCode);
}

export function useLanguageStoreHydrated(): boolean {
  return useLanguageStore((state) => state.hasHydrated);
}
