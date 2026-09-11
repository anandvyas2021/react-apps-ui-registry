import React, { useEffect, forwardRef, useMemo } from "react";
import { ViewProps, StyleSheet } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from "react-native-reanimated";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface SpinnerLoaderProps extends ViewProps {
    color?: string;
    size?: number;
    strokeWidth?: number;
}

export const SpinnerLoader = forwardRef<
    React.ElementRef<typeof Animated.View>,
    SpinnerLoaderProps
>(({ color, size = 24, strokeWidth = 3, style, ...props }, ref) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const activeColor = color || theme.primary; // Dynamic fallback
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 800, easing: Easing.linear }),
            -1,
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateZ: `${rotation.value}deg` }],
    }));

    return (
        <Animated.View
            ref={ref}
            style={[
                styles.base,
                animatedStyle,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: strokeWidth,
                    borderColor: `${activeColor}40`,
                    borderTopColor: activeColor,
                },
                style,
            ]}
            {...props}
        />
    );
});
SpinnerLoader.displayName = "SpinnerLoader";

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        base: {
            justifyContent: "center",
            alignItems: "center",
        },
    });
