export const colors = {
  primary: {
    foxiOrange: "#FF7A00",
    foxiBlue: "#1E3A8A",
    warmCream: "#FFF3E0",
    deepNavy: "#0D132B",
  },
  semantic: {
    success: "#22C55E",
    warning: "#FBBF24",
    error: "#EF4444",
    info: "#3B82F6",
  },
  neutral: {
    text: "#0F172A",
    secondary: "#64748B",
    surface: "#F3F4F6",
    border: "#E5E7EB",
    background: "#FFFFFF",
  },
} as const;

export type ColorToken = typeof colors;
