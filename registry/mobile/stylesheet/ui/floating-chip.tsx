import React, { forwardRef, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, ViewStyle } from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";
import type { IconName } from "@/lib/utils";

export type FloatingChipVariant = "surface" | "muted" | "outline";
export type FloatingChipSize = "sm" | "default" | "lg";
export type FloatingChipRoundness = "default" | "full" | "lg";
export type FloatingChipIntent =
    | "primary"
    | "success"
    | "warning"
    | "destructive"
    | "muted"
    | "normal";

export interface FloatingChipItem {
    label: string;
    subtitle: string;
    icon?: IconName | string;
    intent?: "primary" | "success" | "warning" | "destructive" | "muted";
    iconColor?: string;
    iconBgColor?: string;
}

export interface FloatingChipProps {
    leftItem: FloatingChipItem;
    rightItem: FloatingChipItem;
    variant?: FloatingChipVariant;
    size?: FloatingChipSize;
    roundness?: FloatingChipRoundness;
    showDivider?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
}

export const FloatingChip = forwardRef<
    React.ComponentRef<typeof Pressable>,
    FloatingChipProps
>(
    (
        {
            leftItem,
            rightItem,
            variant = "surface",
            size = "default",
            roundness = "default",
            showDivider = true,
            disabled,
            onPress,
            style,
        },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);

        const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;

        const roundnessRadius = {
            default: 24,
            full: 9999,
            lg: 16,
        }[roundness];

        const intentColorMap = {
            primary: { text: theme.primary, bg: `${theme.primary}1A` },
            success: { text: "#10B981", bg: "rgba(16, 185, 129, 0.1)" },
            warning: { text: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
            destructive: {
                text: theme.destructive,
                bg: `${theme.destructive}1A`,
            },
            muted: { text: theme.foregroundMuted, bg: theme.surfaceMuted },
            normal: { text: theme.foreground, bg: theme.surfaceMuted },
        };

        const renderItem = (item: FloatingChipItem) => {
            const activeIntent = item.intent ?? "normal";
            const colors =
                intentColorMap[activeIntent] || intentColorMap.normal;
            const finalBg = item.iconBgColor || colors.bg;
            const finalColor = item.iconColor || colors.text;

            return (
                <View style={styles.itemContainer}>
                    {item.icon && (
                        <View
                            style={[
                                styles.iconBox,
                                styles[`iconBox_${size}`],
                                { backgroundColor: finalBg },
                            ]}
                        >
                            <DynamicIcon
                                name={item.icon as string}
                                size={iconSize}
                                color={finalColor}
                            />
                        </View>
                    )}

                    <View style={styles.textStack}>
                        <Text
                            style={[styles.labelText, styles[`label_${size}`]]}
                            numberOfLines={1}
                        >
                            {item.label}
                        </Text>
                        <Text
                            style={[
                                styles.subtitleText,
                                styles[`subtitle_${size}`],
                                { color: finalColor },
                            ]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {item.subtitle}
                        </Text>
                    </View>
                </View>
            );
        };

        return (
            <Pressable
                ref={ref}
                disabled={disabled}
                onPress={onPress}
                style={[
                    styles.baseChip,
                    styles[`variant_${variant}`],
                    styles[`size_${size}`],
                    { borderRadius: roundnessRadius },
                    disabled && styles.disabled,
                    style,
                ]}
            >
                {renderItem(leftItem)}
                {showDivider && (
                    <View style={[styles.divider, styles[`divider_${size}`]]} />
                )}
                {renderItem(rightItem)}
            </Pressable>
        );
    },
);

FloatingChip.displayName = "FloatingChip";

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        baseChip: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
        },
        variant_surface: {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        variant_muted: {
            backgroundColor: theme.surfaceMuted,
            borderColor: "transparent",
        },
        variant_outline: {
            backgroundColor: "transparent",
            borderColor: theme.border,
        },
        size_sm: {
            padding: 8,
        },
        size_default: {
            padding: 12,
        },
        size_lg: {
            padding: 16,
        },
        disabled: {
            opacity: 0.6,
        },
        itemContainer: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        },
        iconBox: {
            alignItems: "center",
            justifyContent: "center",
        },
        iconBox_sm: {
            width: 32,
            height: 32,
            borderRadius: 8,
        },
        iconBox_default: {
            width: 44,
            height: 44,
            borderRadius: 12,
        },
        iconBox_lg: {
            width: 56,
            height: 56,
            borderRadius: 16,
        },
        textStack: {
            flex: 1,
            justifyContent: "center",
        },
        labelText: {
            fontWeight: "500",
            color: theme.foregroundMuted,
            marginBottom: 2,
        },
        label_sm: {
            fontSize: 10,
        },
        label_default: {
            fontSize: 12,
        },
        label_lg: {
            fontSize: 14,
        },
        subtitleText: {
            fontWeight: "700",
            letterSpacing: -0.3,
        },
        subtitle_sm: {
            fontSize: 14,
        },
        subtitle_default: {
            fontSize: 16,
        },
        subtitle_lg: {
            fontSize: 18,
        },
        divider: {
            width: 1,
            backgroundColor: theme.border,
            marginHorizontal: 12,
        },
        divider_sm: {
            height: 24,
        },
        divider_default: {
            height: 40,
        },
        divider_lg: {
            height: 48,
        },
    });
