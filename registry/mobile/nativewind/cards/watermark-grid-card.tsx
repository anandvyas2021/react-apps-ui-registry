import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
    withSpring,
    useSharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn, type IconName } from "@/lib/utils";

export interface WatermarkGridCardProps {
    title: string;
    subtitle?: string;
    icon: IconName | string;
    onPress: () => void;
    iconClassName?: string; // Allows passing a specific Tailwind text color
    iconColor?: string; // Allows passing a raw hex color
    className?: string; // Controls the outer wrapper (default w-[48%])
}

export function WatermarkGridCard({
    title,
    subtitle,
    icon,
    onPress,
    iconClassName,
    iconColor,
    className,
}: WatermarkGridCardProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View
            style={animatedStyle}
            className={cn("w-[48%] mb-4", className)}
        >
            <Pressable
                onPressIn={() => (scale.value = withSpring(0.94))}
                onPressOut={() => (scale.value = withSpring(1))}
                onPress={onPress}
                className="w-full h-40 bg-surface border border-border rounded-3xl p-4 overflow-hidden justify-between relative shadow-sm"
            >
                {/* THE ABSTRACT TILTED WATERMARK */}
                <View
                    className="absolute -right-2 -bottom-2 opacity-10"
                    style={{ transform: [{ rotate: "-15deg" }] }}
                >
                    <DynamicIcon
                        name={icon as string}
                        size={50}
                        className="text-primary"
                    />
                </View>

                {/* CARD CONTENT */}
                <View className="w-16 h-16 rounded-full items-center justify-center border-[0.5px] border-border bg-background">
                    <DynamicIcon
                        name={icon as string}
                        size={30}
                        className={iconClassName}
                        color={iconColor}
                    />
                </View>

                <View>
                    {subtitle && (
                        <Text className="text-[10px] font-medium text-foreground-muted uppercase">
                            {subtitle}
                        </Text>
                    )}
                    <Text className="text-base font-bold text-foreground">
                        {title}
                    </Text>
                </View>
            </Pressable>
        </Animated.View>
    );
}
