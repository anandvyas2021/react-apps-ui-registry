import React, { useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    withDelay,
} from "react-native-reanimated";

import { cn } from "@/lib/utils";

export interface ShineGradientWrapperProps {
    colors: [string, string, ...string[]]; // Requires at least 2 colors
    children: React.ReactNode;
    className?: string;
    style?: ViewStyle;
    isShining?: boolean;
}

export function ShineGradientWrapper({
    colors,
    children,
    className,
    style,
    isShining = true,
}: ShineGradientWrapperProps) {
    const shimmerPosition = useSharedValue(-300);

    useEffect(() => {
        if (isShining) {
            shimmerPosition.value = withRepeat(
                withDelay(
                    1500,
                    withTiming(400, {
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                    }),
                ),
                -1,
                false,
            );
        }
    }, [isShining]);

    const shimmerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: shimmerPosition.value }],
        };
    });

    return (
        <View
            className={cn("overflow-hidden relative", className)}
            style={style}
        >
            <LinearGradient
                colors={colors}
                pointerEvents="none"
                style={StyleSheet.absoluteFillObject}
            />

            {isShining && (
                <Animated.View
                    style={[StyleSheet.absoluteFillObject, shimmerStyle]}
                    pointerEvents="none"
                >
                    <LinearGradient
                        colors={[
                            "rgba(255,255,255,0)",
                            "rgba(255,255,255,0.4)",
                            "rgba(255,255,255,0)",
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                            StyleSheet.absoluteFillObject,
                            { width: 150, transform: [{ skewX: "-20deg" }] },
                        ]}
                    />
                </Animated.View>
            )}

            <View className="z-10 w-full h-full justify-center">
                {children}
            </View>
        </View>
    );
}
