import { useSignIn } from "@clerk/expo";
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
import { AuthInput } from "@/components/auth/auth-input";
import { AuthMascotHero } from "@/components/auth/auth-mascot-hero";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { AUTH_BACKGROUND, authSpacing } from "@/constants/auth-spacing";
import { images } from "@/constants/images";
import { createFinalizeNavigate, getClerkFieldError } from "@/lib/clerk-auth";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formError, setFormError] = useState<string>();

  const isSubmitting = fetchStatus === "fetching";
  const finalizeNavigate = createFinalizeNavigate(router);

  const handleResetPassword = async () => {
    setFormError(undefined);

    if (password.length < 8) {
      Alert.alert(
        "Password too short",
        "Use at least 8 characters for your new password.",
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Passwords don't match",
        "Make sure both password fields match.",
      );
      return;
    }

    if (signIn.status !== "needs_new_password") {
      Alert.alert(
        "Reset link expired",
        "Request a new reset code from the forgot password screen.",
      );
      router.replace("/forgot-password");
      return;
    }

    const { error } = await signIn.resetPasswordEmailCode.submitPassword({
      password,
    });

    if (error) {
      setFormError(
        getClerkFieldError(errors.fields.password?.message) ??
          "Could not reset your password. Try again.",
      );
      return;
    }

    await signIn.finalize({ navigate: finalizeNavigate });
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
                Create a new{" "}
                <Text className="text-foxi-orange">password</Text>
              </Text>
              <View className="mt-4 max-w-[320px] items-center">
                <Text className="text-center text-[15px] leading-[22px] text-[#78716C] font--poppins">
                  Choose a strong password to secure your Foxi account.
                </Text>
              </View>
            </View>
            <AuthMascotHero
              source={images.mascotLogIn}
              showGlow={false}
              style={{ marginTop: 48 }}
              compact
              imageOffsetX={authSpacing.signInMascotOffsetX}
            />
          </View>

          <AuthFormCard className="-mt-2">
            <View className="gap-4">
              <AuthInput
                icon="lock-closed"
                placeholder="New password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                showPasswordToggle
                onToggleSecureEntry={() => setPasswordVisible((v) => !v)}
              />
              <AuthInput
                icon="lock-closed"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!confirmPasswordVisible}
                showPasswordToggle
                onToggleSecureEntry={() =>
                  setConfirmPasswordVisible((v) => !v)
                }
              />
            </View>

            {errors.fields.password ? (
              <Text className="mt-2 text-[12px] text-red-600 font--poppins">
                {errors.fields.password.message}
              </Text>
            ) : null}

            {formError ? (
              <Text className="mt-2 text-center text-[13px] text-red-600 font--poppins">
                {formError}
              </Text>
            ) : null}

            <Text className="mt-2 text-[12px] leading-[18px] text-[#A8A29E] font--poppins">
              Use at least 8 characters with a mix of letters, numbers &
              symbols.
            </Text>

            <View className="mt-4">
              <AuthPrimaryButton
                label={isSubmitting ? "Resetting..." : "Reset Password"}
                onPress={handleResetPassword}
                disabled={isSubmitting || !password || !confirmPassword}
              />
            </View>

            <Pressable
              onPress={() => router.push("/sign-in")}
              className="mt-4 items-center active:opacity-70"
              accessibilityRole="button"
            >
              <Text className="text-[14px] text-[#78716C] font--poppins">
                Back to{" "}
                <Text className="text-foxi-orange font--poppins-bold">
                  Sign In
                </Text>
              </Text>
            </Pressable>
          </AuthFormCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
