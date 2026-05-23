export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 1.2,
    fontFamily: "Poppins_700Bold",
  },
  h2: {
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 1.3,
    fontFamily: "Poppins_600SemiBold",
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 1.3,
    fontFamily: "Poppins_600SemiBold",
  },
  h4: {
    fontSize: 16,
    fontWeight: "500" as const,
    lineHeight: 1.4,
    fontFamily: "Poppins_500Medium",
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 1.6,
    fontFamily: "Poppins_400Regular",
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 1.6,
    fontFamily: "Poppins_400Regular",
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: "400" as const,
    lineHeight: 1.6,
    fontFamily: "Poppins_400Regular",
  },
  caption: {
    fontSize: 11,
    fontWeight: "400" as const,
    lineHeight: 1.4,
    fontFamily: "Poppins_400Regular",
  },
} as const;

export type TypographyToken = typeof typography;
