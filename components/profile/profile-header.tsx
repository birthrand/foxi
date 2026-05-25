import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { images } from "@/constants/images";
import {
  PROFILE_CARD_SHADOW,
  profileSpacing
} from "@/constants/profile-spacing";

type ProfileHeaderProps = {
  displayName: string;
  flagEmoji: string;
  learningLabel: string;
  motivationalMessage: string;
  onPress?: () => void;
};

export function ProfileHeader({
  displayName,
  flagEmoji,
  learningLabel,
  motivationalMessage,
  onPress,
}: ProfileHeaderProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : "header"}
      accessibilityLabel={`Profile for ${displayName}`}
      className="flex-row items-center active:opacity-80 mt-4"
      style={{ gap: profileSpacing.avatarToText }}
    >
      <View className="flex-1 flex-col items-center gap-2">
        <View className="overflow-hidden"
        style={{
          width: profileSpacing.avatarSize,
          height: profileSpacing.avatarSize,
          backgroundColor: "rgba(255, 122, 0, 0.2)",
          borderRadius: profileSpacing.avatarSize / 2,
          ...PROFILE_CARD_SHADOW,
        }}>
          
        
        <Image
          source={images.mascotProfile}
          accessibilityLabel="Foxi mascot profile avatar"
          style={{
            width: profileSpacing.avatarSize,
            height: profileSpacing.avatarSize,
            transform: [{ translateY: 8 }],
          }}
          contentFit="contain"
          
        />
        </View>
      <View className="min-w-0 flex-row items-center">
        <Text
          className="text-deep-navy"
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 24,
            lineHeight: 32,
          }}
          numberOfLines={1}
        >
          {displayName.charAt(0).toUpperCase() + displayName.slice(1)}
        </Text>
        {/* <View
          className="flex-row items-center"
          style={{ gap: 6 }}
        >
          <Text style={{ fontSize: 16 }}>{flagEmoji}</Text>
          <Text style={{ fontSize: 24}}> {" | "}</Text>
          <Text
            className="text-deep-navy mt-1"
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 14,
              lineHeight: 20,
            }}
            numberOfLines={1}
          >
            {learningLabel}
          </Text>
        </View> */}
        </View>
      {/* <View className="min-w-0 flex-1">
        <Text
          className="text-deep-navy"
          style={{
            fontFamily: "Poppins_700Bold",
            fontSize: 22,
            lineHeight: 28,
          }}
          numberOfLines={1}
        >
          {displayName}!
        </Text>

        

        <Text
          className="text-secondary"
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 12,
            lineHeight: 16,
            marginTop: profileSpace.xs / 2,
          }}
          numberOfLines={2}
        >
          {motivationalMessage}
        </Text>
      </View> */}

      {/* <Ionicons
        name="chevron-forward"
        size={profileSpacing.headerChevronSize}
        color="#94a3b8"
      /> */}
      </View>
    </Pressable>
  );
}
