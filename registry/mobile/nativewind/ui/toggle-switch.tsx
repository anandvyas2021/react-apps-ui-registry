import React, { useEffect, forwardRef } from "react";
import { Pressable, View } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn, type IconName } from "@/lib/utils";

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
    className?: string;
    activeColor?: string; // Exposed for Reanimated hex injection
    inactiveColor?: string;
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
            className,
            activeColor = "#5f84e0",
            inactiveColor = "#D1D5DB",
        },
        ref,
    ) => {
        const dimensions = SWITCH_SIZES[size];

        // Animation Values
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

        // Reanimated requires raw hex strings, avoiding context hooks
        const trackAnimatedStyle = useAnimatedStyle(() => {
            const backgroundColor = interpolateColor(
                progress.value,
                [0, 1],
                [inactiveColor, activeColor],
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
                className={cn(
                    "rounded-full justify-center",
                    disabled ? "opacity-50" : "opacity-100",
                    className,
                )}
                style={{ width: dimensions.trackW, height: dimensions.trackH }}
            >
                <Animated.View
                    style={[trackAnimatedStyle]}
                    className="absolute w-full h-full rounded-full"
                />

                <Animated.View
                    style={[
                        thumbAnimatedStyle,
                        { width: dimensions.thumb, height: dimensions.thumb },
                    ]}
                    className="bg-white rounded-full items-center justify-center shadow-sm"
                >
                    {value ? (
                        <DynamicIcon
                            name={customIcons.iconOn as string}
                            size={dimensions.iconSize}
                            color={activeColor}
                        />
                    ) : (
                        <DynamicIcon
                            name={customIcons.iconOff as string}
                            size={dimensions.iconSize}
                            color={inactiveColor}
                        />
                    )}
                </Animated.View>
            </Pressable>
        );
    },
);
ToggleSwitch.displayName = "ToggleSwitch";
