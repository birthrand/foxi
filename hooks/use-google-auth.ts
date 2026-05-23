import { useSSO } from "@clerk/expo";
import { useSignInWithGoogle } from "@clerk/expo/google";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";

export function useGoogleAuth() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);

    try {
      if (Platform.OS === "ios" || Platform.OS === "android") {
        try {
          const { createdSessionId, setActive } =
            await startGoogleAuthenticationFlow();

          if (createdSessionId && setActive) {
            await setActive({ session: createdSessionId });
            router.replace("/");
            return;
          }
        } catch (nativeError) {
          console.warn("Native Google sign-in failed, falling back to SSO:", nativeError);
        }
      }

      const redirectUrl = AuthSession.makeRedirectUri({ path: "sso-callback" });
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      Alert.alert(
        "Sign in failed",
        "Could not sign in with Google. Check your Clerk Google connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [router, startGoogleAuthenticationFlow, startSSOFlow]);

  return { signInWithGoogle, isLoading };
}
