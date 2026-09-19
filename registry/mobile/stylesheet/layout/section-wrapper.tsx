import React, { useMemo } from "react";
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    ViewStyle,
} from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface SectionWrapperProps {
    children: React.ReactNode;
    type?: "default" | "bordered";
    title?: string;
    showInfoIcon?: boolean;
    onInfoPress?: () => void;
    rightTitle?: string;
    rightType?: "text" | "navigate" | "chip";
    rightAction?: () => void;
    style?: ViewStyle;
}

export function SectionWrapper({
    children,
    type = "default",
    title,
    showInfoIcon = false,
    onInfoPress,
    rightTitle,
    rightType = "text",
    rightAction,
    style,
}: SectionWrapperProps) {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const renderInfoIcon = () => {
        if (!showInfoIcon && !onInfoPress) return null;

        const IconElement = (
            <DynamicIcon
                name="Info"
                size={16}
                color={theme.foregroundMuted}
                style={styles.infoIcon}
            />
        );

        if (onInfoPress) {
            return (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onInfoPress}
                    hitSlop={10}
                >
                    {IconElement}
                </TouchableOpacity>
            );
        }
        return IconElement;
    };

    return (
        <View style={[styles.container, style]}>
            {/* Header Row (Outside the border) */}
            <View style={styles.headerRow}>
                <View style={styles.titleGroup}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    {renderInfoIcon()}
                </View>

                {/* Right Action */}
                {rightTitle &&
                    (rightType === "text" ? (
                        <Text style={styles.rightText}>{rightTitle}</Text>
                    ) : (
                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                rightType === "chip" && styles.actionButtonChip,
                            ]}
                            onPress={rightAction}
                            activeOpacity={0.7}
                            disabled={!rightAction}
                        >
                            <Text style={styles.rightText}>{rightTitle}</Text>
                            <DynamicIcon
                                name="ChevronRight"
                                size={12}
                                color={theme.foregroundMuted}
                            />
                        </TouchableOpacity>
                    ))}
            </View>

            {/* Content (Only the children receive the border and padding) */}
            <View style={[type === "bordered" && styles.borderedContent]}>
                {children}
            </View>
        </View>
    );
}

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            width: "100%",
            marginBottom: 24,
        },
        headerRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            paddingHorizontal: 8, // Ensures text aligns with the bordered box below
        },
        borderedContent: {
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 16,
            padding: 16,
            backgroundColor: theme.background,
        },
        titleGroup: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
        },
        title: {
            fontSize: 16,
            fontWeight: "700",
            color: theme.foreground,
            letterSpacing: -0.3,
        },
        infoIcon: {
            marginLeft: 4,
        },
        rightText: {
            fontSize: 14,
            fontWeight: "700",
            color: theme.foregroundMuted,
        },
        actionButton: {
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 9999,
        },
        actionButtonChip: {
            backgroundColor: theme.surfaceMuted,
        },
    });
