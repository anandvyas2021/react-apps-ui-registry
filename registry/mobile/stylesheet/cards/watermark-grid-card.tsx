import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet, ViewStyle } from "react-native";
import Animated, {
    withSpring,
    useSharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";
import type { IconName } from "@/lib/utils";

export interface WatermarkGridCardProps {
    title: string;
    subtitle?: string;
    icon: IconName | string;
    onPress: () => void;
    iconColor?: string;
    style?: ViewStyle;
}

export function WatermarkGridCard({
    title,
    subtitle,
    icon,
    onPress,
    iconColor,
    style,
}: WatermarkGridCardProps) {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={[styles.wrapper, animatedStyle, style]}>
            <Pressable
                onPressIn={() => (scale.value = withSpring(0.94))}
                onPressOut={() => (scale.value = withSpring(1))}
                onPress={onPress}
                style={styles.card}
            >
                {/* THE ABSTRACT TILTED WATERMARK */}
                <View style={styles.watermarkContainer}>
                    <DynamicIcon
                        name={icon as string}
                        size={50}
                        color={theme.primary}
                    />
                </View>

                {/* CARD CONTENT */}
                <View style={styles.iconContainer}>
                    <DynamicIcon
                        name={icon as string}
                        size={30}
                        color={iconColor || theme.foreground}
                    />
                </View>

                <View>
                    {subtitle && (
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    )}
                    <Text style={styles.title}>{title}</Text>
                </View>
            </Pressable>
        </Animated.View>
    );
}

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        wrapper: {
            width: "48%",
            marginBottom: 16,
        },
        card: {
            width: "100%",
            height: 160, // approximate for h-40
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 24,
            padding: 16,
            overflow: "hidden",
            justifyContent: "space-between",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        watermarkContainer: {
            position: "absolute",
            right: -8,
            bottom: -8,
            opacity: 0.1,
            transform: [{ rotate: "-15deg" }],
        },
        iconContainer: {
            width: 64,
            height: 64,
            borderRadius: 32,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 0.5,
            borderColor: theme.border,
            backgroundColor: theme.background,
        },
        subtitle: {
            fontSize: 10,
            fontWeight: "500",
            color: theme.foregroundMuted,
            textTransform: "uppercase",
        },
        title: {
            fontSize: 16,
            fontWeight: "700",
            color: theme.foreground,
        },
    });
