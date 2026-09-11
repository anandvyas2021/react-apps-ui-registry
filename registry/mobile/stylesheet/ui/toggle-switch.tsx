import React, { useEffect, forwardRef, useMemo } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";
import type { IconName } from "@/lib/utils";

const SWITCH_SIZES = {
    sm: {
        trackW: 36,
        trackH: 20,
        thumb: 16,
        transOn: 18,
        transOff: 2,
        iconSize: 10,
    },
    default: {
        trackW: 44,
        trackH: 24,
        thumb: 20,
        transOn: 22,
        transOff: 2,
        iconSize: 12,
    },
    lg: {
        trackW: 52,
        trackH: 28,
        thumb: 24,
        transOn: 26,
        transOff: 2,
        iconSize: 16,
    },
};

export interface ToggleSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    size?: "sm" | "default" | "lg";
    customIcons?: {
        iconOn?: IconName;
        iconOff?: IconName;
    };
    disabled?: boolean;
}

export const ToggleSwitch = forwardRef<
    React.ElementRef<typeof View>,
    ToggleSwitchProps
>(
    (
        {
            value,
            onValueChange,
            size = "default",
            customIcons = { iconOn: "Check", iconOff: "X" },
            disabled = false,
        },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);
        const dimensions = SWITCH_SIZES[size];

        const translateX = useSharedValue(
            value ? dimensions.transOn : dimensions.transOff,
        );
        const progress = useSharedValue(value ? 1 : 0);

        useEffect(() => {
            translateX.value = withSpring(
                value ? dimensions.transOn : dimensions.transOff,
                {
                    damping: 20,
                    stiffness: 250,
                    mass: 0.5,
                },
            );
            progress.value = withTiming(value ? 1 : 0, { duration: 200 });
        }, [value, dimensions]);

        const handlePress = () => {
            if (disabled) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onValueChange(!value);
        };

        const trackAnimatedStyle = useAnimatedStyle(() => {
            const backgroundColor = interpolateColor(
                progress.value,
                [0, 1],
                [theme.border, theme.primary],
            );
            return { backgroundColor };
        });

        const thumbAnimatedStyle = useAnimatedStyle(() => {
            return {
                transform: [{ translateX: translateX.value }],
            };
        });

        return (
            <Pressable
                ref={ref}
                onPress={handlePress}
                disabled={disabled}
                style={[
                    styles.container,
                    { width: dimensions.trackW, height: dimensions.trackH },
                    disabled && styles.disabled,
                ]}
            >
                <Animated.View style={[styles.track, trackAnimatedStyle]} />

                <Animated.View
                    style={[
                        styles.thumb,
                        thumbAnimatedStyle,
                        { width: dimensions.thumb, height: dimensions.thumb },
                    ]}
                >
                    {value ? (
                        <DynamicIcon
                            name={customIcons.iconOn as string}
                            size={dimensions.iconSize}
                            color={theme.primary}
                        />
                    ) : (
                        <DynamicIcon
                            name={customIcons.iconOff as string}
                            size={dimensions.iconSize}
                            color={theme.mutedForeground}
                        />
                    )}
                </Animated.View>
            </Pressable>
        );
    },
);
ToggleSwitch.displayName = "ToggleSwitch";

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            justifyContent: "center",
            borderRadius: 9999,
        },
        disabled: {
            opacity: 0.5,
        },
        track: {
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: 9999,
        },
        thumb: {
            backgroundColor: "#ffffff",
            borderRadius: 9999,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
    });
