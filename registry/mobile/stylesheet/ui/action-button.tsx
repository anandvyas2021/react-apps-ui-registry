import React, { useMemo } from "react";
import {
    Text,
    ViewStyle,
    TextStyle,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";

import { DynamicIcon } from "./dynamic-icon";
import { WaveDotsLoader } from "./wave-dots-loader";

import { useTheme } from "../theme/ThemeProvider";
import type { ThemeTokens } from "../../../../theme/tokens";

export interface ActionButtonProps extends Omit<
    TouchableOpacityProps,
    "style"
> {
    title: string;
    icon?: string;
    variant?: "primary" | "secondary";
    iconPosition?: "pre" | "post";
    isLoading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyles?: TextStyle;
    className?: never;
    // borderRadius?: number;
}

export const ActionButton = React.forwardRef<
    React.ElementRef<typeof TouchableOpacity>,
    ActionButtonProps
>(
    (
        {
            title,
            icon,
            variant = "primary",
            iconPosition = "post",
            isLoading = false,
            disabled = false,
            style,
            textStyle,
            // borderRadius = 30,
            ...props
        },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);
        const isDisabled = disabled || isLoading;
        const isSecondary = variant === "secondary";

        const iconColor = isDisabled
            ? theme.foregroundDisabled
            : isSecondary
              ? theme.secondaryForeground
              : theme.primaryForeground;

        return (
            <TouchableOpacity
                ref={ref}
                activeOpacity={0.8}
                disabled={isDisabled}
                style={[
                    styles.base,
                    // { borderRadius },
                    isSecondary ? styles.secondary : styles.primary,
                    isDisabled && styles.disabled,
                    style,
                ]}
                {...props}
            >
                {isLoading ? (
                    <WaveDotsLoader />
                ) : (
                    <>
                        {icon && iconPosition === "pre" && (
                            <DynamicIcon
                                name={icon}
                                size={20}
                                color={iconColor}
                            />
                        )}
                        <Text
                            style={[
                                styles.textBase,
                                isSecondary && styles.textSecondary,
                                isDisabled && styles.textDisabled,
                                textStyle,
                            ]}
                        >
                            {title}
                        </Text>
                        {icon && iconPosition === "post" && (
                            <DynamicIcon
                                name={icon}
                                size={20}
                                color={iconColor}
                            />
                        )}
                    </>
                )}
            </TouchableOpacity>
        );
    },
);
ActionButton.displayName = "ActionButton";

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        base: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            marginBottom: 12,
            borderRadius: 16,
            minHeight: 52,
            borderWidth: 1,
        },
        primary: {
            backgroundColor: theme.primary,
            borderColor: "transparent",
        },
        secondary: {
            backgroundColor: theme.secondary,
            borderColor: theme.secondaryForeground,
        },
        disabled: {
            backgroundColor: theme.surfaceMuted,
            borderColor: "transparent",
            opacity: 0.5,
        },
        textBase: {
            fontSize: 16,
            fontWeight: "700",
            color: theme.primaryForeground,
        },
        textSecondary: {
            color: theme.secondaryForeground,
        },
        textDisabled: {
            color: theme.foregroundDisabled,
        },
    });
