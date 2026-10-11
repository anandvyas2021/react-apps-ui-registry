import React, { forwardRef, useMemo } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { WaveDotsLoader } from "@/components/loaders/wave-dots-loader";
import { ShineGradientWrapper } from "@/components/layout/shine-gradient-wrapper";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";
import type { IconName } from "@/lib/utils";

export interface ActionButtonProps {
    title: string;
    variant?: "primary" | "secondary";
    size?: "sm" | "default" | "lg";
    fullWidth?: boolean;
    roundness?: "default" | "full" | "sm" | "none";
    icon?: IconName | string;
    iconPosition?: "pre" | "post";
    isLoading?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    withShine?: boolean;
    hasGradient?: boolean;
    GradientColors?: [string, string, ...string[]];
}

export const ActionButton = forwardRef<
    React.ElementRef<typeof TouchableOpacity>,
    ActionButtonProps
>(
    (
        {
            title,
            variant = "primary",
            size = "default",
            fullWidth = true,
            roundness = "default",
            icon,
            iconPosition = "post",
            isLoading = false,
            disabled = false,
            onPress,
            style,
            textStyle,
            withShine = false,
            hasGradient = false,
            GradientColors = ["#8870e6", "#5f84e0", "#5f84e0"],
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
        const iconSize = size === "sm" ? 14 : size === "lg" ? 20 : 18;

        const sizeStyles = {
            sm: styles.sizeSm,
            default: styles.sizeDefault,
            lg: styles.sizeLg,
        }[size];

        const textSizeStyles = {
            sm: styles.textSm,
            default: styles.textDefault,
            lg: styles.textLg,
        }[size];

        const buttonStyles = [
            styles.baseButton,
            sizeStyles,
            { borderRadius: activeRadius },
            fullWidth ? styles.fullWidth : styles.fitContent,
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
            textSizeStyles,
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
                activeOpacity={0.9}
                disabled={isDisabled}
                onPress={onPress}
                style={buttonStyles}
            >
                {isLoading ? (
                    <WaveDotsLoader />
                ) : (
                    <>
                        {icon && iconPosition === "pre" && (
                            <DynamicIcon
                                name={icon as string}
                                size={iconSize}
                                color={activeColor}
                            />
                        )}
                        <Text style={textStylesArray}>{title}</Text>
                        {icon && iconPosition === "post" && (
                            <DynamicIcon
                                name={icon as string}
                                size={iconSize}
                                color={activeColor}
                            />
                        )}
                    </>
                )}
            </TouchableOpacity>
        );

        if (isWrapped) {
            return (
                <ShineGradientWrapper
                    colors={GradientColors}
                    isShining={withShine}
                    hasGradient={hasGradient}
                    style={[
                        styles.shineWrapper,
                        { borderRadius: activeRadius },
                        fullWidth ? styles.fullWidth : styles.fitContent,
                        size === "sm"
                            ? { marginBottom: 0 }
                            : { marginBottom: 12 },
                    ]}
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
            borderWidth: 1,
        },
        fullWidth: {
            width: "100%",
        },
        fitContent: {
            alignSelf: "flex-start",
        },
        sizeSm: {
            minHeight: 36,
            paddingHorizontal: 12,
            gap: 6,
            marginBottom: 0,
        },
        sizeDefault: {
            minHeight: 48,
            paddingHorizontal: 16,
            gap: 8,
            marginBottom: 12,
        },
        sizeLg: {
            minHeight: 56,
            paddingHorizontal: 24,
            gap: 8,
            marginBottom: 12,
        },
        primaryButton: {
            backgroundColor: theme.primary,
            borderColor: "transparent",
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 2,
        },
        secondaryButton: {
            backgroundColor: theme.secondary,
            borderColor: theme.secondaryForeground,
        },
        disabledButton: {
            backgroundColor: theme.surfaceMuted,
            borderColor: "transparent",
            elevation: 0,
            shadowOpacity: 0,
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
        shineWrapper: {
            overflow: "hidden",
        },
        baseText: {
            fontWeight: "700",
        },
        textSm: {
            fontSize: 12,
        },
        textDefault: {
            fontSize: 13,
        },
        textLg: {
            fontSize: 15,
        },
        primaryText: {
            color: theme.primaryForeground,
        },
        secondaryText: {
            color: theme.secondaryForeground,
        },
        disabledText: {
            color: theme.foregroundMuted,
        },
    });
