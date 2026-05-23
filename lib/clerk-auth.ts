import type { Href, Router } from "expo-router";

export const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (!publishableKey) {
  throw new Error(
    "Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file",
  );
}

type FinalizeNavigateParams = {
  session?: { currentTask?: { key: string } | null } | null;
  decorateUrl: (path: string) => string;
};

export function createFinalizeNavigate(router: Pick<Router, "replace">) {
  return ({ session, decorateUrl }: FinalizeNavigateParams) => {
    if (session?.currentTask) {
      console.warn("Pending session task:", session.currentTask);
      return;
    }

    const url = decorateUrl("/");
    router.replace(url as Href);
  };
}

export function getClerkFieldError(
  message: string | undefined,
): string | undefined {
  return message?.trim() || undefined;
}
