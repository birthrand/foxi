import { useSignIn } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { AuthInput } from "@/components/auth/auth-input";
import { AuthMascotHero } from "@/components/auth/auth-mascot-hero";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { VerificationCodeModal } from "@/components/auth/verification-code-modal";
import { AUTH_BACKGROUND, authSpacing } from "@/constants/auth-spacing";
import { images } from "@/constants/images";
import { getClerkFieldError } from "@/lib/clerk-auth";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();

  const [email, setEmail] = useState(
    typeof emailParam === "string" ? emailParam : "",
  );
  const [verificationVisible, setVerificationVisible] = useState(false);
  const [verificationError, setVerificationError] = useState<string>();
  const [isVerifying, setIsVerifying] = useState(false);
  const [formError, setFormError] = useState<string>();

  const isSubmitting = fetchStatus === "fetching";

  const handleSendResetCode = async () => {
    setFormError(undefined);

    const { error: createError } = await signIn.create({
      identifier: email.trim(),
    });

    if (createError) {
      setFormError(
        getClerkFieldError(errors.fields.identifier?.message) ??
          "Could not find an account with that email.",
      );
      return;
    }

    const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode();

    if (sendError) {
      setFormError("Could not send reset code. Try again.");
      return;
    }

    setVerificationVisible(true);
  };

  const handleVerifyCode = async (code: string) => {
    setVerificationError(undefined);
    setIsVerifying(true);

    try {
      const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code });

      if (error) {
        setVerificationError(
          getClerkFieldError(errors.fields.code?.message) ??
            "Invalid reset code.",
        );
        return;
      }

      if (signIn.status === "needs_new_password") {
        setVerificationVisible(false);
        router.push("/reset-password");
      }
    } finally {
      setIsVerifying(false);
    }
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
                Forgot your <Text className="text-foxi-orange">password?</Text>
              </Text>
              <View className="mt-4 max-w-[320px] items-center">
                <Text className="text-center text-[15px] leading-[22px] text-[#78716C] font--poppins">
                  Enter your email and we&apos;ll send you a reset code
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
          <View className="-mt-4">
            <AuthFormCard>
              <View className="gap-4">
                <AuthInput
                  icon="mail"
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              {formError ? (
                <Text className="mt-2 text-center text-[13px] text-red-600 font--poppins">
                  {formError}
                </Text>
              ) : null}

              <View className="mt-6">
                <AuthPrimaryButton
                  label={isSubmitting ? "Sending..." : "Send Reset Code"}
                  onPress={handleSendResetCode}
                  disabled={isSubmitting || !email.trim()}
                />
              </View>

              <Pressable
                onPress={() => router.push("/sign-in")}
                className="mt-4 items-center active:opacity-70"
                accessibilityRole="button"
              >
                <Text className="text-[14px] text-[#78716C] font--poppins">
                  Remember your password?{" "}
                  <Text className="text-foxi-orange font--poppins-bold">
                    Sign In
                  </Text>
                </Text>
              </Pressable>
            </AuthFormCard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationCodeModal
        visible={verificationVisible}
        onClose={() => {
          setVerificationVisible(false);
          setVerificationError(undefined);
        }}
        title="Check your email"
        description="We sent a 6-digit reset code to your email. Enter it below to continue."
        onVerifyCode={handleVerifyCode}
        isVerifying={isVerifying}
        errorMessage={verificationError}
      />
    </SafeAreaView>
  );
}
