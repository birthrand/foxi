import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const LEARNING_PROGRESS_STORAGE_KEY = "foxi-learning-progress";

type LearningProgressState = {
  completedLessonIds: string[];
  lessonProgressPercent: Record<string, number>;
  dailyMinutesStudied: number;
  dailyGoalMinutes: number;
  streakDays: number;
  hasHydrated: boolean;
  setLessonProgress: (lessonId: string, percent: number) => void;
  completeLesson: (lessonId: string) => void;
  setDailyMinutesStudied: (minutes: number) => void;
  setHasHydrated: (value: boolean) => void;
};

export const useLearningProgressStore = create<LearningProgressState>()(
  persist(
    (set, get) => ({
      completedLessonIds: [],
      lessonProgressPercent: {},
      dailyMinutesStudied: 25,
      dailyGoalMinutes: 30,
      streakDays: 7,
      hasHydrated: false,
      setLessonProgress: (lessonId, percent) =>
        set({
          lessonProgressPercent: {
            ...get().lessonProgressPercent,
            [lessonId]: Math.min(100, Math.max(0, percent)),
          },
        }),
      completeLesson: (lessonId) =>
        set({
          completedLessonIds: get().completedLessonIds.includes(lessonId)
            ? get().completedLessonIds
            : [...get().completedLessonIds, lessonId],
          lessonProgressPercent: {
            ...get().lessonProgressPercent,
            [lessonId]: 100,
          },
        }),
      setDailyMinutesStudied: (minutes) =>
        set({ dailyMinutesStudied: Math.max(0, minutes) }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: LEARNING_PROGRESS_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        completedLessonIds: state.completedLessonIds,
        lessonProgressPercent: state.lessonProgressPercent,
        dailyMinutesStudied: state.dailyMinutesStudied,
        dailyGoalMinutes: state.dailyGoalMinutes,
        streakDays: state.streakDays,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function useLearningProgressHydrated(): boolean {
  return useLearningProgressStore((state) => state.hasHydrated);
}
