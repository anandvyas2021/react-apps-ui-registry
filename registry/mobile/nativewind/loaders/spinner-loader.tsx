import React, { useEffect, forwardRef } from "react";
import { ViewProps } from "react-native";
import Animated, {
    Easing,
    withRepeat,
    withTiming,
    useSharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

import { cn } from "@/lib/utils";

export interface SpinnerLoaderProps extends Omit<ViewProps, "style"> {
    color?: string;
    size?: number;
    strokeWidth?: number;
    className?: string;
    style?: any;
}

export const SpinnerLoader = forwardRef<
    React.ElementRef<typeof Animated.View>,
    SpinnerLoaderProps
>(
    (
        {
            color = "#ffffff", // Default to white, perfectly overridden by the prop
            size = 24,
            strokeWidth = 3,
            className,
            style,
            ...props
        },
        ref,
    ) => {
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
                className={cn("justify-center items-center", className)}
                style={[
                    animatedStyle,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderColor: `${color}40`, // 25% opacity for the track
                        borderTopColor: color, // Solid color for the spinning head
                    },
                    style,
                ]}
                {...props}
            />
        );
    },
);
SpinnerLoader.displayName = "SpinnerLoader";
