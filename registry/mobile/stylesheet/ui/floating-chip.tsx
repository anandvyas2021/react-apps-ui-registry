import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface FloatingChipInterface {
    label: string;
    value: string;
    icon: string;
    iconColor?: string;
    bgColor?: string; // Optional override for the inner icon background
}

export interface FloatingChipProps {
    leftItem: FloatingChipInterface;
    rightItem: FloatingChipInterface;
}

export function FloatingDoubleChip({ leftItem, rightItem }: FloatingChipProps) {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const renderItem = (item: FloatingChipInterface) => (
        <View style={styles.itemContainer}>
            <View
                style={[
                    styles.iconWrapper,
                    { backgroundColor: item.bgColor || theme.surfaceMuted },
                ]}
            >
                <DynamicIcon
                    name={item.icon}
                    size={20}
                    color={item.iconColor || theme.foreground}
                />
            </View>

            <View style={styles.textStack}>
                <Text style={styles.label}>{item.label}</Text>
                <Text
                    style={styles.value}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                >
                    {item.value}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {renderItem(leftItem)}
            <View style={styles.divider} />
            {renderItem(rightItem)}
        </View>
    );
}

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 12,
            borderRadius: 24,
            borderWidth: 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
            borderColor: theme.border,
            backgroundColor: theme.surface,
        },
        itemContainer: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        },
        iconWrapper: {
            width: 44,
            height: 44,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
        },
        textStack: {
            flex: 1,
            justifyContent: "center",
        },
        label: {
            fontSize: 12,
            fontWeight: "500",
            marginBottom: 2,
            color: theme.mutedForeground,
        },
        value: {
            fontSize: 16,
            fontWeight: "700",
            letterSpacing: -0.5,
            color: theme.foreground,
        },
        divider: {
            width: 1,
            height: 40,
            marginHorizontal: 12,
            backgroundColor: theme.border,
        },
    });
