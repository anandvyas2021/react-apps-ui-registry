import React, { useMemo } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface DotSlashPaginationProps {
    data: any[];
    activeIndex: number;
    style?: ViewStyle;
}

export function DotSlashPagination({
    data,
    activeIndex,
    style,
}: DotSlashPaginationProps) {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={[styles.container, style]}>
            {data?.map((_, index) => {
                const isActive = activeIndex === index;

                const animatedStyle = useAnimatedStyle(() => ({
                    width: withTiming(isActive ? 24 : 8, { duration: 300 }),
                }));

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.dot,
                            animatedStyle,
                            isActive ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                );
            })}
        </View>
    );
}

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
        },
        dot: {
            height: 8,
            borderRadius: 9999,
        },
        activeDot: {
            backgroundColor: theme.primary,
        },
        inactiveDot: {
            backgroundColor: theme.surfaceMuted, // Fallback for light grey
        },
    });
