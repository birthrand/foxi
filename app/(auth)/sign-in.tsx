import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthFormCard } from "@/components/auth/auth-form-card";
import { AuthGoogleButton } from "@/components/auth/auth-google-button";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthMascotHero } from "@/components/auth/auth-mascot-hero";
import { AuthOrDivider } from "@/components/auth/auth-or-divider";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { VerificationCodeModal } from "@/components/auth/verification-code-modal";
import { AUTH_BACKGROUND, authSpacing } from "@/constants/auth-spacing";
import { images } from "@/constants/images";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { createFinalizeNavigate, getClerkFieldError } from "@/lib/clerk-auth";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [verificationVisible, setVerificationVisible] = useState(false);
  const [verificationError, setVerificationError] = useState<string>();
  const [isVerifying, setIsVerifying] = useState(false);
  const [formError, setFormError] = useState<string>();

  const isSubmitting = fetchStatus === "fetching";
  const finalizeNavigate = createFinalizeNavigate(router);

  const handleSignIn = async () => {
    setFormError(undefined);

    const { error } = await signIn.password({
      emailAddress: email.trim(),
      password,
    });

    if (error) {
      setFormError(
        getClerkFieldError(errors.fields.identifier?.message) ??
          getClerkFieldError(errors.fields.password?.message) ??
          "Could not sign in. Check your email and password.",
      );
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: finalizeNavigate });
      return;
    }

    if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors?.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        const { error: mfaError } = await signIn.mfa.sendEmailCode();
        if (mfaError) {
          setFormError("Could not send verification code. Try again.");
          return;
        }
        setVerificationVisible(true);
        return;
      }
    }

    setFormError("Sign-in could not be completed. Try again.");
  };

  const handleVerifyCode = async (code: string) => {
    setVerificationError(undefined);
    setIsVerifying(true);

    try {
      const { error } = await signIn.mfa.verifyEmailCode({ code });

      if (error) {
        setVerificationError(
          getClerkFieldError(errors.fields.code?.message) ??
            "Invalid verification code.",
        );
        return;
      }

      if (signIn.status === "complete") {
        setVerificationVisible(false);
        await signIn.finalize({ navigate: finalizeNavigate });
        return;
      }

      setVerificationError("Verification could not be completed.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) {
      return;
    }
    await signInWithGoogle();
  };

  const closeVerificationModal = () => {
    setVerificationVisible(false);
    setVerificationError(undefined);
    signIn.reset();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AUTH_BACKGROUND }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 pt-10">
            <View className="items-center">
              <Text className="text-center text-[38px] leading-[42px] text-[#2D2419] font--poppins-bold">
                Sign in to <Text className="text-foxi-orange">Foxi</Text>
              </Text>
              <View className="mt-4 max-w-[320px] items-center">
                <Text className="text-center text-[15px] leading-[22px] text-[#78716C] font--poppins">
                  Your smart, private AI companion
                </Text>
                <Text className="text-center text-[15px] leading-[22px] text-[#78716C] font--poppins">
                  that&apos;s always by your side
                </Text>
              </View>
            </View>
            <AuthMascotHero
              source={images.mascotLogIn1}
              showGlow={false}
              style={{ marginTop: 48 }}
              compact
              imageOffsetX={authSpacing.signInMascotOffsetX}
            />
          </View>

          <View className="-mt-8">
            <AuthFormCard>
              <View className="gap-4">
                <AuthInput
                  icon="mail"
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
                {errors.fields.identifier ? (
                  <Text className="-mt-2 text-[12px] text-red-600 font--poppins">
                    {errors.fields.identifier.message}
                  </Text>
                ) : null}
                <AuthInput
                  icon="lock-closed"
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  showPasswordToggle
                  onToggleSecureEntry={() => setPasswordVisible((v) => !v)}
                />
                {errors.fields.password ? (
                  <Text className="-mt-2 text-[12px] text-red-600 font--poppins">
                    {errors.fields.password.message}
                  </Text>
                ) : null}
              </View>

              {formError ? (
                <Text className="mt-2 text-center text-[13px] text-red-600 font--poppins">
                  {formError}
                </Text>
              ) : null}

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/forgot-password",
                    params: email ? { email } : undefined,
                  })
                }
                className="mt-2.5 self-end active:opacity-70"
                accessibilityRole="button"
              >
                <Text className="text-[13px] text-foxi-orange font--poppins-semibold">
                  Forgot password?
                </Text>
              </Pressable>

              <View className="mt-8">
                <AuthPrimaryButton
                  label={isSubmitting ? "Signing In..." : "Sign In"}
                  onPress={handleSignIn}
                  disabled={isSubmitting || !email.trim() || !password}
                />
              </View>

              <Pressable
                onPress={() => router.push("/sign-up")}
                className="mt-4 items-center active:opacity-70"
                accessibilityRole="button"
              >
                <Text className="text-[14px] text-[#78716C] font--poppins">
                  Don&apos;t have an account?{" "}
                  <Text className="text-foxi-orange font--poppins-bold">
                    Sign Up
                  </Text>
                </Text>
              </Pressable>

              <View className="my-6">
                <AuthOrDivider />
              </View>

              <AuthGoogleButton
                onPress={handleGoogleSignIn}
                disabled={isGoogleLoading}
              />
            </AuthFormCard>
          </View>

          <Text className="mx-6 mb-4 mt-2 text-center text-[12px] leading-[18px] text-[#A8A29E] font--poppins">
            By signing in, you agree to our{" "}
            <Text className="text-foxi-orange font--poppins-semibold">
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text className="text-foxi-orange font--poppins-semibold">
              Privacy Policy
            </Text>
            .
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationCodeModal
        visible={verificationVisible}
        onClose={closeVerificationModal}
        onVerifyCode={handleVerifyCode}
        isVerifying={isVerifying}
        errorMessage={verificationError}
      />
    </SafeAreaView>
  );
}
