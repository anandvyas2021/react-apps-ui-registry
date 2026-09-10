/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            colors: {
                background: "var(--background)", // whole screen
                surface: {
                    DEFAULT: "var(--surface)", // Cards, Inputs, Modals
                    muted: "var(--surface-muted)", // Disabled buttons, empty states
                    button: "var(--button-surface)", // for some custom button bg
                },

                /* CONTENT (Text & Icons) */
                foreground: {
                    DEFAULT: "var(--foreground)", // Main Titles, active icons
                    muted: "var(--foreground-muted)", // Subtitles, inactive icons, timestamps
                    disabled: "var(--foreground-disabled)", // Disabled text, placeholder text
                },

                /* BOUNDARIES (Lines) */
                border: {
                    DEFAULT: "var(--border)", // Standard borders around cards/inputs
                    subtle: "var(--border-subtle)", // Faint dividers between list items
                },

                /* ACTIONS (Primary Brand) */
                primary: {
                    DEFAULT: "var(--primary)", // main theme Background
                    lighter: "var(--primary-lighter)", // lighter main theme Background
                    foreground: "var(--primary-foreground)", // Text/Icons inside the primary Background
                },

                /* ACTIONS (Secondary Brand) */
                secondary: {
                    DEFAULT: "var(--secondary)", // Transparent Background
                    foreground: "var(--secondary-foreground)", // Text inside the transparent background
                },

                /* Feedback */
                success: {
                    DEFAULT: "var(--success)", // Green for gains/checks
                    bg: "var(--success-background)", // lighter background
                },
                destructive: {
                    DEFAULT: "var(--destructive)", // Red for errors/losses
                    bg: "var(--destructive-background)", // lighter background
                },
            },
        },
    },
};
