import React, { useMemo } from "react";
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";

import { HorizontalScroll } from "@/components/layout/horizontal-scroll";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface FilterChipsProps {
    filters: { label: string; value: string }[];
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    style?: ViewStyle;
}

export function FilterChips({
    filters,
    activeFilter,
    onFilterChange,
    style,
}: FilterChipsProps) {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <HorizontalScroll style={style}>
            {filters?.map((filter) => {
                const isActive = activeFilter === filter?.value;
                return (
                    <TouchableOpacity
                        key={filter?.value}
                        onPress={() => onFilterChange(filter?.value)}
                        activeOpacity={0.7}
                        style={[
                            styles.chip,
                            isActive ? styles.chipActive : styles.chipInactive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.text,
                                isActive
                                    ? styles.textActive
                                    : styles.textInactive,
                            ]}
                        >
                            {filter?.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </HorizontalScroll>
    );
}

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        chip: {
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 18,
            borderWidth: 1.3,
        },
        chipActive: {
            borderColor: theme.primary,
            backgroundColor: theme.primaryLighter,
        },
        chipInactive: {
            borderColor: "transparent",
            backgroundColor: theme.surfaceMuted,
        },
        text: {
            fontSize: 12,
            fontWeight: "600",
        },
        textActive: {
            color: theme.primary,
        },
        textInactive: {
            color: theme.foreground,
        },
    });
