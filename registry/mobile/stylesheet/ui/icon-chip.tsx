import React, { forwardRef, useMemo } from "react";
import {
    Pressable,
    Text,
    View,
    StyleSheet,
    type GestureResponderEvent,
    type ViewStyle,
    type TextStyle,
} from "react-native";
import * as Clipboard from "expo-clipboard";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";
import type { IconName } from "@/lib/utils";

export type IconChipVariant =
    | "primary"
    | "success"
    | "warning"
    | "destructive"
    | "muted";
export type IconChipFill = "soft" | "solid" | "hollow";
export type IconChipSize = "xs" | "sm" | "md" | "lg";
export type IconChipRadius = "full" | "lg" | "md" | "sm";
export type IconChipOutline = "bordered" | "dotted" | "dashed" | "ghost";
export type IconChipTextTransform = "normal" | "uppercase";

export interface IconChipProps {
    label?: string;
    icon?: IconName | string;
    dotColor?: string;
    iconPosition?: "pre" | "post";
    variant?: IconChipVariant;
    fill?: IconChipFill;
    size?: IconChipSize;
    radius?: IconChipRadius;
    outlineType?: IconChipOutline;
    textTransform?: IconChipTextTransform;
    copyable?: boolean;
    onPress?: (event: GestureResponderEvent) => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const IconChip = forwardRef<
    React.ElementRef<typeof Pressable>,
    IconChipProps
>(
    (
        {
            label,
            variant = "primary",
            fill = "soft",
            size = "md",
            radius = "full",
            outlineType = "bordered",
            textTransform = "normal",
            icon,
            dotColor,
            iconPosition = "pre",
            copyable = false,
            onPress,
            style,
            textStyle,
        },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);

        const handlePress = async (e: GestureResponderEvent) => {
            if (copyable && label) {
                await Clipboard.setStringAsync(label);
            }
            if (onPress) onPress(e);
        };

        const iconSize =
            size === "xs" ? 11 : size === "sm" ? 12 : size === "md" ? 14 : 16;

        const colorMap = {
            primary: {
                main: theme.primary,
                softBg: `${theme.primary}1A`,
                solidBg: theme.primary,
            },
            success: {
                main: "#10B981",
                softBg: "rgba(16, 185, 129, 0.1)",
                solidBg: "#10B981",
            },
            warning: {
                main: "#F59E0B",
                softBg: "rgba(245, 158, 11, 0.1)",
                solidBg: "#F59E0B",
            },
            destructive: {
                main: theme.destructive,
                softBg: `${theme.destructive}1A`,
                solidBg: theme.destructive,
            },
            muted: {
                main: theme.foregroundMuted,
                softBg: theme.surfaceMuted,
                solidBg: theme.foregroundMuted,
            },
        };

        const activePalette = colorMap[variant];

        const backgroundColor =
            fill === "hollow"
                ? "transparent"
                : fill === "solid"
                  ? activePalette.solidBg
                  : activePalette.softBg;

        const textColor = fill === "solid" ? "#FFFFFF" : activePalette.main;

        const radiusValue = {
            full: 9999,
            lg: 12,
            md: 8,
            sm: 4,
        }[radius];

        const borderStyleMap = {
            bordered: "solid" as const,
            dotted: "dotted" as const,
            dashed: "dashed" as const,
            ghost: "solid" as const,
        };

        const borderStyles: ViewStyle = {
            borderWidth: outlineType === "ghost" ? 0 : 1,
            borderColor:
                outlineType === "ghost" ? "transparent" : activePalette.main,
            borderStyle: borderStyleMap[outlineType],
        };

        const dotSize = {
            xs: 4,
            sm: 6,
            md: 8,
            lg: 10,
        }[size];

        return (
            <Pressable
                ref={ref}
                onPress={handlePress}
                disabled={!copyable && !onPress}
                style={[
                    styles.baseChip,
                    styles[`size_${size}`],
                    {
                        backgroundColor,
                        borderRadius: radiusValue,
                        flexDirection:
                            iconPosition === "post" ? "row-reverse" : "row",
                    },
                    borderStyles,
                    !label && styles.iconOnly,
                    style,
                ]}
            >
                {dotColor ? (
                    <View
                        style={[
                            styles.dot,
                            {
                                width: dotSize,
                                height: dotSize,
                                backgroundColor: dotColor,
                            },
                        ]}
                    />
                ) : icon ? (
                    <DynamicIcon
                        name={icon as string}
                        size={iconSize}
                        color={textColor}
                    />
                ) : null}

                {label && (
                    <Text
                        style={[
                            styles.baseText,
                            styles[`text_${size}`],
                            { color: textColor },
                            textTransform === "uppercase" &&
                                styles.textUppercase,
                            textStyle,
                        ]}
                        numberOfLines={1}
                    >
                        {label}
                    </Text>
                )}
            </Pressable>
        );
    },
);
IconChip.displayName = "IconChip";

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        baseChip: {
            alignItems: "center",
            justifyContent: "center",
        },
        iconOnly: {
            aspectRatio: 1,
            paddingHorizontal: 6,
        },
        size_xs: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            gap: 4,
        },
        size_sm: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            gap: 4,
        },
        size_md: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            gap: 6,
        },
        size_lg: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            gap: 8,
        },
        dot: {
            borderRadius: 9999,
        },
        baseText: {
            fontWeight: "700",
            letterSpacing: -0.2,
        },
        text_xs: {
            fontSize: 9,
        },
        text_sm: {
            fontSize: 10,
        },
        text_md: {
            fontSize: 12,
        },
        text_lg: {
            fontSize: 14,
        },
        textUppercase: {
            textTransform: "uppercase",
            letterSpacing: 0.8,
            fontSize: 9,
        },
    });
