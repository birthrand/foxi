import { createClerkClient, type ClerkClient } from "@clerk/backend";

function getClerkPublishableKey(): string {
  return (
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() ||
    process.env.CLERK_PUBLISHABLE_KEY?.trim() ||
    ""
  );
}

function getClerkServerClient(): ClerkClient | null {
  const secretKey = process.env.CLERK_SECRET_KEY?.trim();
  const publishableKey = getClerkPublishableKey();

  if (!secretKey) {
    console.error("CLERK_SECRET_KEY is not configured for API routes.");
    return null;
  }

  if (!publishableKey) {
    console.error(
      "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not configured for API routes.",
    );
    return null;
  }

  return createClerkClient({ secretKey, publishableKey });
}

export async function getAuthenticatedClerkUserId(
  request: Request,
): Promise<string | null> {
  const clerkClient = getClerkServerClient();
  if (!clerkClient) {
    return null;
  }

  const requestState = await clerkClient.authenticateRequest(request);

  if (!requestState.isSignedIn) {
    return null;
  }

  return requestState.toAuth().userId;
}

export async function getClerkUserDisplayName(userId: string): Promise<string> {
  const clerkClient = getClerkServerClient();
  if (!clerkClient) {
    return userId;
  }

  try {
    const user = await clerkClient.users.getUser(userId);

    return (
      user.fullName?.trim() ||
      user.firstName?.trim() ||
      user.username ||
      userId
    );
  } catch {
    return userId;
  }
}
