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

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [verificationVisible, setVerificationVisible] = useState(false);

  const handleSignIn = () => {
    setVerificationVisible(true);
  };

  const handleGoogleSignIn = () => {
    setVerificationVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AUTH_BACKGROUND }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          scrollEnabled={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              paddingHorizontal: authSpacing.screenPadding,
              paddingTop: authSpacing.topToTitle,
            }}
          >
            <View className="items-center">
              <Text
                className="text-center text-[38px] leading-[42px] text-[#2D2419]"
                style={{ fontFamily: "Poppins_700Bold" }}
              >
                Sign in to <Text className="text-foxi-orange">Foxi</Text>
              </Text>
              <View
                className="max-w-[320px] items-center"
                style={{
                  marginTop: authSpacing.titleToSubtitle,
                }}
              >
                <Text
                  className="text-center text-[15px] leading-[22px] text-[#78716C]"
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
                  Your smart, private AI companion
                </Text>
                <Text
                  className="text-center text-[15px] leading-[22px] text-[#78716C]"
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
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

          <AuthFormCard style={{ marginTop: -8 }}>
            <View style={{ gap: authSpacing.fieldGap }}>
              <AuthInput
                icon="mail"
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <AuthInput
                icon="lock-closed"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                showPasswordToggle
                onToggleSecureEntry={() => setPasswordVisible((v) => !v)}
              />
            </View>

            <Pressable
              className="mt-2.5 self-end active:opacity-70"
              accessibilityRole="button"
            >
              <Text
                className="text-[13px] text-foxi-orange"
                style={{ fontFamily: "Poppins_600SemiBold" }}
              >
                Forgot password?
              </Text>
            </Pressable>

            <View style={{ marginTop: authSpacing.fieldGap }}>
              <AuthPrimaryButton label="Sign In" onPress={handleSignIn} />
            </View>

            <Pressable
              onPress={() => router.push("/sign-up")}
              className="mt-4 items-center active:opacity-70"
              accessibilityRole="button"
            >
              <Text
                className="text-[14px] text-[#78716C]"
                style={{ fontFamily: "Poppins_400Regular" }}
              >
                Don&apos;t have an account?{" "}
                <Text
                  className="text-foxi-orange"
                  style={{ fontFamily: "Poppins_700Bold" }}
                >
                  Sign Up
                </Text>
              </Text>
            </Pressable>

            <View style={{ marginVertical: authSpacing.dividerVertical }}>
              <AuthOrDivider />
            </View>

            <AuthGoogleButton onPress={handleGoogleSignIn} />
          </AuthFormCard>
          <Text
            className="text-center text-[12px] leading-[18px] text-[#A8A29E]"
            style={{
              fontFamily: "Poppins_400Regular",
              marginHorizontal: authSpacing.screenPadding,
              marginTop: authSpacing.subtitleLineGap,
              marginBottom: authSpacing.cardMarginBottom,
            }}
          >
            By signing in, you agree to our{" "}
            <Text
              className="text-foxi-orange"
              style={{ fontFamily: "Poppins_600SemiBold" }}
            >
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text
              className="text-foxi-orange"
              style={{ fontFamily: "Poppins_600SemiBold" }}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationCodeModal
        visible={verificationVisible}
        onClose={() => setVerificationVisible(false)}
      />
    </SafeAreaView>
  );
}
