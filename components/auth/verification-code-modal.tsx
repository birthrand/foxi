import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

type VerificationCodeModalProps = {
  visible: boolean;
  onClose: () => void;
};

const CODE_LENGTH = 6;

export function VerificationCodeModal({
  visible,
  onClose,
}: VerificationCodeModalProps) {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!visible) {
      setCode("");
      return;
    }

    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    return () => clearTimeout(focusTimer);
  }, [visible]);

  useEffect(() => {
    if (code.length !== CODE_LENGTH) {
      return;
    }

    Keyboard.dismiss();
    onClose();
    router.replace("/");
  }, [code, onClose, router]);

  const handleChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(digitsOnly);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <Pressable
          className="absolute inset-0 bg-black/45"
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close verification modal"
        />
        <View
          className="rounded-t-[28px] bg-white px-6 pb-8 pt-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 16,
          }}
        >
          <View className="mb-1 h-1 w-10 self-center rounded-full bg-[#E8E2DA]" />
          <Text
            className="mt-4 text-center text-[22px] text-[#2D2419]"
            style={{ fontFamily: "Poppins_700Bold" }}
          >
            Check your email
          </Text>
          <Text
            className="mt-2 text-center text-[14px] leading-5 text-[#78716C]"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            We sent you a verification code. Enter the 6-digit code below to
            continue.
          </Text>

          <Pressable
            onPress={() => inputRef.current?.focus()}
            className="mt-6 flex-row justify-between gap-2"
            accessibilityRole="none"
          >
            {Array.from({ length: CODE_LENGTH }).map((_, index) => {
              const digit = code[index] ?? "";
              const isActive = index === code.length && code.length < CODE_LENGTH;

              return (
                <View
                  key={index}
                  className="flex-1 items-center justify-center rounded-xl border-2 bg-[#FFFBF5]"
                  style={{
                    height: 52,
                    maxWidth: 48,
                    borderColor: isActive ? "#ff7a00" : "#E8E2DA",
                  }}
                >
                  <Text
                    className="text-[22px] text-[#2D2419]"
                    style={{ fontFamily: "Poppins_600SemiBold" }}
                  >
                    {digit}
                  </Text>
                </View>
              );
            })}
          </Pressable>

          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleChange}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            maxLength={CODE_LENGTH}
            style={{
              position: "absolute",
              opacity: 0,
              height: 1,
              width: 1,
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
