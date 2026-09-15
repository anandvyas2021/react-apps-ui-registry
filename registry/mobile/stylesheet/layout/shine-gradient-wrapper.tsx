import React, { useEffect, useMemo } from "react";
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

export interface ShineGradientWrapperProps {
    colors: [string, string, ...string[]];
    children: React.ReactNode;
    style?: ViewStyle;
    isShining?: boolean;
}

export function ShineGradientWrapper({
    colors,
    children,
    style,
    isShining = true,
}: ShineGradientWrapperProps) {
    const styles = useMemo(() => createStyles(), []);
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
        <View style={[styles.container, style]}>
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
                            styles.shimmerGradient,
                        ]}
                    />
                </Animated.View>
            )}

            <View style={styles.content}>{children}</View>
        </View>
    );
}

const createStyles = () =>
    StyleSheet.create({
        container: {
            overflow: "hidden",
            position: "relative",
        },
        shimmerGradient: {
            width: 150,
            transform: [{ skewX: "-20deg" }],
        },
        content: {
            zIndex: 10,
            width: "100%",
            height: "100%",
            justifyContent: "center",
        },
    });
