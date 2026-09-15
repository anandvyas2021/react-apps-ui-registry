import React, { forwardRef, useMemo } from "react";
import {
    Text,
    ViewStyle,
    TextStyle,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { WaveDotsLoader } from "@/components/loaders/wave-dots-loader";
import { ShineGradientWrapper } from "@/components/layout/shine-gradient-wrapper";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";
import type { IconName } from "@/lib/utils";

export interface ActionButtonProps {
    title: string;
    icon?: IconName | string;
    variant?: "primary" | "secondary";
    iconPosition?: "pre" | "post";
    isLoading?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    withShine?: boolean;
    hasGradient?: boolean;
    gradientColors?: [string, string, ...string[]];
    roundness?: "default" | "full" | "sm" | "none";
}

export const ActionButton = forwardRef<
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
            onPress,
            style,
            textStyle,
            withShine = false,
            hasGradient = false,
            gradientColors = ["#3B82F6", "#2563EB", "#1E3A8A"],
            roundness = "default",
            ...props
        },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);

        const isDisabled = disabled || isLoading;
        const isWrapped = (withShine || hasGradient) && !isDisabled;

        const radiusMap = {
            default: 16,
            full: 9999,
            sm: 8,
            none: 0,
        };
        const activeRadius = radiusMap[roundness];

        const buttonStyles = [
            styles.baseButton,
            { borderRadius: activeRadius },
            variant === "primary"
                ? styles.primaryButton
                : styles.secondaryButton,
            isDisabled && styles.disabledButton,
            isLoading && styles.loadingButton,
            isWrapped && styles.wrappedOverride,
            hasGradient && !isDisabled && styles.gradientOverride,
            style,
        ];

        const textStylesArray = [
            styles.baseText,
            variant === "primary" ? styles.primaryText : styles.secondaryText,
            isDisabled && styles.disabledText,
            textStyle,
        ];

        const activeColor = isDisabled
            ? theme.foregroundMuted
            : variant === "primary"
              ? theme.primaryForeground
              : theme.secondaryForeground;

        const buttonContent = (
            <TouchableOpacity
                ref={ref}
                activeOpacity={0.8}
                disabled={isDisabled}
                onPress={onPress}
                style={buttonStyles}
                {...props}
            >
                {isLoading ? (
                    <WaveDotsLoader />
                ) : (
                    <>
                        {icon && iconPosition === "pre" && (
                            <DynamicIcon
                                name={icon as string}
                                size={20}
                                color={activeColor}
                            />
                        )}
                        <Text style={textStylesArray}>{title}</Text>
                        {icon && iconPosition === "post" && (
                            <DynamicIcon
                                name={icon as string}
                                size={20}
                                color={activeColor}
                            />
                        )}
                    </>
                )}
            </TouchableOpacity>
        );

        if (withShine && !isDisabled) {
            return (
                <ShineGradientWrapper
                    colors={gradientColors}
                    isShining={withShine}
                    hasGradient={hasGradient}
                    style={[styles.wrapper, { borderRadius: activeRadius }]}
                >
                    {buttonContent}
                </ShineGradientWrapper>
            );
        }

        return buttonContent;
    },
);
ActionButton.displayName = "ActionButton";

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        baseButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            marginBottom: 12,
            minHeight: 52,
            borderWidth: 1,
        },
        primaryButton: {
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 2,
            borderColor: "transparent",
            backgroundColor: theme.primary,
        },
        secondaryButton: {
            borderColor: theme.secondaryForeground,
            backgroundColor: theme.secondary,
        },
        disabledButton: {
            borderColor: "transparent",
            opacity: 0.5,
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: theme.surfaceMuted,
        },
        loadingButton: {
            opacity: 0.8,
        },
        wrappedOverride: {
            marginBottom: 0,
        },
        gradientOverride: {
            backgroundColor: "transparent",
            borderColor: "transparent",
            elevation: 0,
            shadowOpacity: 0,
        },
        wrapper: {
            width: "100%",
            marginBottom: 12,
        },
        baseText: {
            fontSize: 16,
            fontWeight: "700",
        },
        primaryText: {
            color: theme.primaryForeground,
        },
        textSecondary: {
            color: theme.secondaryForeground,
        },
        disabledText: {
            color: theme.foregroundDisabled,
        },
    });
