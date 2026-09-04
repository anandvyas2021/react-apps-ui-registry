import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    withDelay,
    withRepeat,
    withTiming,
    withSequence,
    useSharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

const Dot = ({ delay, color }: { delay: number; color: string }) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0.4);

    useEffect(() => {
        translateY.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(-6, { duration: 300 }),
                    withTiming(0, { duration: 300 }),
                ),
                -1,
                true,
            ),
        );
        opacity.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1, { duration: 300 }),
                    withTiming(0.4, { duration: 300 }),
                ),
                -1,
                true,
            ),
        );
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                style,
                {
                    width: 7,
                    height: 7,
                    borderRadius: 6,
                    backgroundColor: color,
                    marginHorizontal: 3,
                },
            ]}
        />
    );
};

export function WaveDotsLoader({ color = "#FFFFFF" }: { color?: string }) {
    return (
        <View style={styles.loaderStyles}>
            <Dot delay={0} color={color} />
            <Dot delay={150} color={color} />
            <Dot delay={300} color={color} />
        </View>
    );
}

const styles = StyleSheet.create({
    loaderStyles: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 24,
    },
});
