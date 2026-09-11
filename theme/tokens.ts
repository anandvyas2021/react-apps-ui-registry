// theme/tokens.ts
//
// This is the ONLY place default color values live. The NativeWind engine
// reads this to generate global.css, the Stylesheet engine reads it directly
// as the default theme object. Never hardcode a color anywhere else.

export const defaultThemeValues = {
    background: "#f9fafb",
    surface: "#ffffff",
    surfaceMuted: "#f3f4f6",
    surfaceButton: "#f3f4f6",

    foreground: "#121212",
    foregroundMuted: "#64748b",
    foregroundDisabled: "#9ca3af",

    border: "#e5e7eb",
    borderSubtle: "#f3f4f6",

    primary: "#5f84e0",
    primaryLighter: "#5f84e01a",
    primaryForeground: "#ffffff",

    secondary: "transparent",
    secondaryForeground: "#111827",

    success: "#10b981",
    successBackground: "#10b9811a",
    destructive: "#ef4444",
    destructiveBackground: "#ef44441a",
} as const;

export type ThemeTokens = typeof defaultThemeValues;
export type ThemeTokenKey = keyof ThemeTokens;
