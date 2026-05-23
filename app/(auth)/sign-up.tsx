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
import { AuthInput } from "@/components/auth/auth-input";
import { AuthMascotHero } from "@/components/auth/auth-mascot-hero";
import { AuthPrimaryButton } from "@/components/auth/auth-primary-button";
import { AuthTermsCheckbox } from "@/components/auth/auth-terms-checkbox";
import { VerificationCodeModal } from "@/components/auth/verification-code-modal";
import { AUTH_BACKGROUND, authSpacing } from "@/constants/auth-spacing";
import { images } from "@/constants/images";

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [verificationVisible, setVerificationVisible] = useState(false);

  const handleCreateAccount = () => {
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
            />
          </View>

          <AuthFormCard style={{ marginTop: -20 }}>
            <View style={{ gap: authSpacing.fieldGap }}>
              <AuthInput
                icon="person"
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
              <AuthInput
                icon="mail"
                placeholder="Email Address"
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

            {/* <Text
              className="mt-2 text-[12px] leading-[18px] text-[#A8A29E]"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              Use at least 8 characters with a mix of letters, numbers &
              symbols.
            </Text> */}

            <View style={{ marginTop: authSpacing.hintToCheckbox }}>
              <AuthTermsCheckbox
                checked={termsAccepted}
                onToggle={() => setTermsAccepted((v) => !v)}
              />
            </View>

            <View style={{ marginTop: authSpacing.checkboxToButton }}>
              <AuthPrimaryButton
                label="Create Account"
                onPress={handleCreateAccount}
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
          </AuthFormCard>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationCodeModal
        visible={verificationVisible}
        onClose={() => setVerificationVisible(false)}
      />
    </SafeAreaView>
  );
}
