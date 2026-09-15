import React, { useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    ViewStyle,
    TouchableOpacity,
} from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";
import type { IconName } from "@/lib/utils";

export interface SectionCardProps {
    title?: string;
    children: React.ReactNode;
    style?: ViewStyle;
}

export function SectionCard({ title, children, style }: SectionCardProps) {
    const theme = useTheme();
    const styles = useMemo(() => createStyles1(theme), [theme]);

    return (
        <View style={[styles.container, style]}>
            {title && <Text style={styles.title}>{title}</Text>}
            <View style={styles.card}>{children}</View>
        </View>
    );
}

export interface SectionRowProps {
    icon: IconName | string;
    title: string;
    subtitle?: string;
    titlePosition?: "top" | "bottom";
    onPress?: () => void;
    disabled?: boolean;
    type?: "info" | "navigate" | "toggle" | "custom";
    toggleValue?: boolean;
    onToggle?: (val: boolean) => void;
    rightElement?: React.ReactNode;
    isLast?: boolean;
    customToggleIcons?: { iconOn?: IconName; iconOff?: IconName };
}

export const SectionRow = ({
    icon,
    title,
    subtitle,
    titlePosition = "bottom",
    onPress,
    disabled = false,
    type = "info",
    toggleValue,
    onToggle,
    rightElement,
    isLast = false,
    customToggleIcons,
}: SectionRowProps) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles2(theme), [theme]);

    const isClickable = (type === "navigate" || onPress) && type !== "toggle";

    const RowContent = (
        <View style={[styles.row, disabled && styles.disabled]}>
            <View style={styles.iconWrapper}>
                <DynamicIcon
                    name={icon as string}
                    size={20}
                    className="text-white"
                />
            </View>

            <View style={styles.textContainer}>
                {titlePosition === "top" ? (
                    <>
                        <Text style={styles.topTitle}>{title}</Text>
                        {subtitle && (
                            <Text style={styles.topSubtitle}>{subtitle}</Text>
                        )}
                    </>
                ) : (
                    <>
                        <Text style={styles.bottomTitle}>{title}</Text>
                        {subtitle && (
                            <Text style={styles.bottomSubtitle}>
                                {subtitle}
                            </Text>
                        )}
                    </>
                )}
            </View>

            <View style={styles.rightElement}>
                {type === "navigate" && (
                    <DynamicIcon
                        name="ChevronRight"
                        size={20}
                        color={theme.mutedForeground}
                    />
                )}
                {type === "toggle" && (
                    <ToggleSwitch
                        value={!!toggleValue}
                        onValueChange={(val) => onToggle?.(val)}
                        disabled={disabled}
                        customIcons={customToggleIcons}
                    />
                )}
                {type === "custom" && rightElement}
            </View>
        </View>
    );

    return (
        <View>
            {isClickable ? (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onPress}
                    disabled={disabled}
                >
                    {RowContent}
                </TouchableOpacity>
            ) : (
                <View>{RowContent}</View>
            )}
            {!isLast && <View style={styles.separator} />}
        </View>
    );
};

// styles for section-card wrapper
const createStyles1 = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            marginBottom: 24,
            width: "100%",
        },
        title: {
            fontSize: 14,
            fontWeight: "700",
            color: theme.primary,
            marginBottom: 8,
            marginLeft: 4,
        },
        card: {
            paddingHorizontal: 16,
            borderRadius: 36,
            borderWidth: 0.8,
            borderColor: theme.border,
            backgroundColor: theme.surface,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
    });

// styles for section-card row
const createStyles2 = (theme: ThemeTokens) =>
    StyleSheet.create({
        row: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 14,
        },
        disabled: {
            opacity: 0.5,
        },
        iconWrapper: {
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
            borderRadius: "100%",
            backgroundColor: theme.primary,
        },
        textContainer: {
            flex: 1,
            justifyContent: "center",
        },
        topTitle: {
            fontSize: 10,
            fontWeight: "500",
            color: theme.foregroundMuted,
            marginBottom: 2,
        },
        topSubtitle: {
            fontSize: 14,
            fontWeight: "700",
            color: theme.foreground,
        },
        bottomTitle: {
            fontSize: 12,
            fontWeight: 600,
            color: theme.foreground,
            marginBottom: 2,
        },
        bottomSubtitle: {
            fontSize: 12,
            fontWeight: "500",
            color: theme.foregroundMuted,
        },
        rightElement: {
            marginLeft: 8,
        },
        separator: {
            width: "85%",
            alignSelf: "flex-end",
            borderBottomWidth: 0.8,
            borderColor: theme.border,
        },
    });
