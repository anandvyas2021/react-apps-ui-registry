import React, { useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
    Easing,
    withRepeat,
    withTiming,
    withSequence,
    useSharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface HomeHeaderProps {
    inMainWrapper?: boolean;
    title?: string;
    hasNotifications?: boolean;
    onItemPress?: (route: string) => void;
}

export function HomeHeader({
    inMainWrapper = true,
    title = "App Name",
    hasNotifications = true,
    onItemPress,
    style,
    ...props
}: HomeHeaderProps) {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const dotOpacity = useSharedValue(0.3);

    useEffect(() => {
        if (hasNotifications) {
            dotOpacity.value = withRepeat(
                withSequence(
                    withTiming(1, {
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                    }),
                    withTiming(0.3, {
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                    }),
                ),
                -1,
                true,
            );
        } else {
            dotOpacity.value = 0;
        }
    }, [hasNotifications]);

    const animatedDotStyle = useAnimatedStyle(() => ({
        opacity: dotOpacity.value,
    }));

    return (
        <View
            style={[
                styles.container,
                { marginTop: inMainWrapper ? 0 : insets.top + 20 },
                style,
            ]}
            {...props}
        >
            <View style={styles.innerRow}>
                {/* Logo & Name */}
                <View style={styles.brandingGroup}>
                    <View style={styles.logoContainer}>
                        <DynamicIcon
                            name="Hexagon"
                            size={24}
                            color={theme.primaryForeground}
                        />
                    </View>
                    <Text style={styles.titleText}>{title}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actionsGroup}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => onItemPress("/notifications")}
                        style={styles.actionButton}
                    >
                        <DynamicIcon
                            name="Bell"
                            size={26}
                            color={theme.primary}
                        />
                        <Animated.View
                            style={[styles.notificationDot, animatedDotStyle]}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => onItemPress("/profile")}
                        style={styles.actionButton}
                    >
                        <DynamicIcon
                            name="User"
                            size={26}
                            color={theme.primary}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginHorizontal: 12,
            borderRadius: 16,
            zIndex: 50,
        },
        innerRow: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        brandingGroup: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
        logoContainer: {
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            backgroundColor: theme.primary,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        titleText: {
            fontSize: 20,
            fontWeight: "800",
            color: theme.primary,
            letterSpacing: -0.5,
        },
        actionsGroup: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        },
        actionButton: {
            padding: 8,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            borderWidth: 0.5,
            borderColor: theme.primary,
            backgroundColor: theme.background,
        },
        notificationDot: {
            position: "absolute",
            top: 9,
            right: 10,
            width: 10,
            height: 10,
            backgroundColor: theme.destructive,
            borderRadius: 9999,
            borderWidth: 1,
            borderColor: theme.border,
        },
    });
