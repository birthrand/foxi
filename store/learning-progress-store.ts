import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const LEARNING_PROGRESS_STORAGE_KEY = "foxi-learning-progress";

export type LessonExchangeProgress = {
  completedExchanges: number;
  totalExchanges: number;
};

type LearningProgressState = {
  completedLessonIds: string[];
  lessonProgressPercent: Record<string, number>;
  lessonExchangeProgress: Record<string, LessonExchangeProgress>;
  dailyMinutesStudied: number;
  dailyGoalMinutes: number;
  streakDays: number;
  hasHydrated: boolean;
  setLessonProgress: (lessonId: string, percent: number) => void;
  setLessonExchangeProgress: (
    lessonId: string,
    completedExchanges: number,
    totalExchanges: number,
  ) => void;
  completeLesson: (lessonId: string) => void;
  restartLesson: (lessonId: string, totalExchanges?: number) => void;
  setDailyMinutesStudied: (minutes: number) => void;
  setHasHydrated: (value: boolean) => void;
};

export const useLearningProgressStore = create<LearningProgressState>()(
  persist(
    (set, get) => ({
      completedLessonIds: [],
      lessonProgressPercent: {},
      lessonExchangeProgress: {},
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
      setLessonExchangeProgress: (lessonId, completedExchanges, totalExchanges) => {
        const safeTotal = Math.max(totalExchanges, 1);
        const safeCompleted = Math.min(
          Math.max(completedExchanges, 0),
          safeTotal,
        );
        const percent = Math.round((safeCompleted / safeTotal) * 100);

        set({
          lessonProgressPercent: {
            ...get().lessonProgressPercent,
            [lessonId]: percent,
          },
          lessonExchangeProgress: {
            ...get().lessonExchangeProgress,
            [lessonId]: {
              completedExchanges: safeCompleted,
              totalExchanges: safeTotal,
            },
          },
        });
      },
      completeLesson: (lessonId) =>
        set((state) => {
          const exchangeProgress = state.lessonExchangeProgress[lessonId];
          const totalExchanges = exchangeProgress?.totalExchanges ?? 1;

          return {
            completedLessonIds: state.completedLessonIds.includes(lessonId)
              ? state.completedLessonIds
              : [...state.completedLessonIds, lessonId],
            lessonProgressPercent: {
              ...state.lessonProgressPercent,
              [lessonId]: 100,
            },
            lessonExchangeProgress: {
              ...state.lessonExchangeProgress,
              [lessonId]: {
                completedExchanges: totalExchanges,
                totalExchanges,
              },
            },
          };
        }),
      restartLesson: (lessonId, totalExchanges = 1) =>
        set((state) => ({
          completedLessonIds: state.completedLessonIds.filter(
            (id) => id !== lessonId,
          ),
          lessonProgressPercent: {
            ...state.lessonProgressPercent,
            [lessonId]: 0,
          },
          lessonExchangeProgress: {
            ...state.lessonExchangeProgress,
            [lessonId]: {
              completedExchanges: 0,
              totalExchanges: Math.max(totalExchanges, 1),
            },
          },
        })),
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
        lessonExchangeProgress: state.lessonExchangeProgress,
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
