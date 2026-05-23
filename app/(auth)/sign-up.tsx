import { useSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
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
import { AuthTermsCheckbox } from "@/components/auth/auth-terms-checkbox";
import { VerificationCodeModal } from "@/components/auth/verification-code-modal";
import { AUTH_BACKGROUND, authSpacing } from "@/constants/auth-spacing";
import { images } from "@/constants/images";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { createFinalizeNavigate, getClerkFieldError } from "@/lib/clerk-auth";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [verificationVisible, setVerificationVisible] = useState(false);
  const [verificationError, setVerificationError] = useState<string>();
  const [isVerifying, setIsVerifying] = useState(false);
  const [formError, setFormError] = useState<string>();

  const isSubmitting = fetchStatus === "fetching";
  const finalizeNavigate = createFinalizeNavigate(router);

  const handleCreateAccount = async () => {
    setFormError(undefined);

    if (!termsAccepted) {
      Alert.alert(
        "Terms required",
        "Please accept the Terms of Service and Privacy Policy to continue.",
      );
      return;
    }

    const { error } = await signUp.password({
      emailAddress: email.trim(),
      password,
    });

    if (error) {
      setFormError(
        getClerkFieldError(errors.fields.emailAddress?.message) ??
          getClerkFieldError(errors.fields.password?.message) ??
          "Could not create your account. Check your details and try again.",
      );
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setFormError("Could not send verification code. Try again.");
      return;
    }

    setVerificationVisible(true);
  };

  const handleVerifyCode = async (code: string) => {
    setVerificationError(undefined);
    setIsVerifying(true);

    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code });

      if (error) {
        setVerificationError(
          getClerkFieldError(errors.fields.code?.message) ??
            "Invalid verification code.",
        );
        return;
      }

      if (signUp.status === "complete") {
        setVerificationVisible(false);
        await signUp.finalize({ navigate: finalizeNavigate });
        return;
      }

      setVerificationError("Verification could not be completed.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (isGoogleLoading) {
      return;
    }

    if (!termsAccepted) {
      Alert.alert(
        "Terms required",
        "Please accept the Terms of Service and Privacy Policy to continue.",
      );
      return;
    }

    await signInWithGoogle();
  };

  const closeVerificationModal = () => {
    setVerificationVisible(false);
    setVerificationError(undefined);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AUTH_BACKGROUND }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: authSpacing.screenPadding,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              paddingHorizontal: authSpacing.screenPadding,
              paddingTop: authSpacing.topToTitle,
            }}
          >
            <View className="items-center overflow-visible">
              <Text
                className="text-center text-[#2D2419]"
                style={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: authSpacing.splitTitleFontSize,
                  lineHeight: authSpacing.splitTitleLineHeight,
                }}
              >
                Create
              </Text>
              <Text
                className="text-center text-foxi-orange"
                style={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: authSpacing.splitTitleFontSize,
                  lineHeight: authSpacing.splitTitleLineHeight,
                  marginTop: authSpacing.splitTitleLine2Overlap,
                }}
              >
                your account
              </Text>
              <Text
                className="max-w-[300px] text-center text-[15px] leading-[22px] text-[#78716C]"
                style={{
                  fontFamily: "Poppins_400Regular",
                  marginTop: authSpacing.titleToSubtitle,
                }}
              >
                Let&apos;s get you all set up and ready to learn with Foxi
              </Text>
            </View>

            <AuthMascotHero
              source={images.mascotSignUp}
              showGlow={false}
              flushBottom
              style={{ marginTop: 12 }}
            />
          </View>

          <AuthFormCard style={{ marginTop: -20 }}>
            <View style={{ gap: authSpacing.fieldGap }}>
              <AuthInput
                icon="mail"
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              {errors.fields.emailAddress ? (
                <Text
                  className="-mt-2 text-[12px] text-red-600"
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
                  {errors.fields.emailAddress.message}
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
                <Text
                  className="-mt-2 text-[12px] text-red-600"
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
                  {errors.fields.password.message}
                </Text>
              ) : null}
            </View>

            <View style={{ marginTop: authSpacing.hintToCheckbox }}>
              <AuthTermsCheckbox
                checked={termsAccepted}
                onToggle={() => setTermsAccepted((v) => !v)}
              />
            </View>

            {formError ? (
              <Text
                className="mt-2 text-center text-[13px] text-red-600"
                style={{ fontFamily: "Poppins_400Regular" }}
              >
                {formError}
              </Text>
            ) : null}

            <View style={{ marginTop: authSpacing.checkboxToButton }}>
              <AuthPrimaryButton
                label={isSubmitting ? "Creating Account..." : "Create Account"}
                onPress={handleCreateAccount}
                disabled={isSubmitting || !email.trim() || !password}
              />
            </View>

            <Pressable
              onPress={() => router.push("/sign-in")}
              className="items-center active:opacity-70"
              style={{ marginTop: authSpacing.buttonToFooter }}
              accessibilityRole="button"
            >
              <Text
                className="text-[14px] text-[#78716C]"
                style={{ fontFamily: "Poppins_400Regular" }}
              >
                Already have an account?{" "}
                <Text
                  className="text-foxi-orange"
                  style={{ fontFamily: "Poppins_700Bold" }}
                >
                  Sign In
                </Text>
              </Text>
            </Pressable>

            <View className="my-6">
              <AuthOrDivider />
            </View>

            <AuthGoogleButton
              onPress={handleGoogleSignUp}
              disabled={isGoogleLoading}
            />

            <View nativeID="clerk-captcha" />
          </AuthFormCard>
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
