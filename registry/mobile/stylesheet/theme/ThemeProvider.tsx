import React, { createContext, useContext, useMemo } from "react";
import { defaultThemeValues, type ThemeTokens } from "../../../../theme/tokens"; // Points to your single source of truth

// Create the Context with the default tokens
const ThemeContext = createContext<ThemeTokens>(defaultThemeValues);

export interface ThemeProviderProps {
    /** Only override the tokens you want to change — everything else falls back to defaults */
    theme?: Partial<ThemeTokens>;
    children: React.ReactNode;
}

/**
 * Optional. If the consumer never wraps their app in this, every component
 * still renders using defaultThemeValues — theming is opt-in, not required.
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
    const value = useMemo(() => ({ ...defaultThemeValues, ...theme }), [theme]);
    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

export function useTheme(): ThemeTokens {
    return useContext(ThemeContext);
}
