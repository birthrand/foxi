import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

import { authSpacing } from "@/constants/auth-spacing";

type AuthFormCardProps = ViewProps & {
  children: ReactNode;
};

export function AuthFormCard({ children, style, ...props }: AuthFormCardProps) {
  return (
    <View
      className="bg-white"
      style={[
        {
          marginTop: authSpacing.mascotToCard,
          marginHorizontal: authSpacing.cardMarginHorizontal,
          marginBottom: authSpacing.cardMarginBottom,
          paddingHorizontal: authSpacing.cardPadding,
          paddingTop: authSpacing.cardPadding,
          paddingBottom: authSpacing.cardPadding,
          borderRadius: authSpacing.cardRadius,
          shadowColor: "#8a3d00",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 6,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
