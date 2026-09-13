import React from "react";
import { View } from "react-native";
import Animated, {
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";

import { cn } from "@/lib/utils";

export interface DotSlashPaginationProps {
    data: any[];
    activeIndex: number;
    className?: string;
}

export function DotSlashPagination({
    data,
    activeIndex,
    className,
}: DotSlashPaginationProps) {
    return (
        <View className={cn("flex-row items-center gap-1.5", className)}>
            {data?.map((_, index) => {
                const isActive = activeIndex === index;

                // Smoothly animate the width transition
                const animatedStyle = useAnimatedStyle(() => ({
                    width: withTiming(isActive ? 24 : 8, { duration: 300 }),
                }));

                return (
                    <Animated.View
                        key={index}
                        style={animatedStyle}
                        className={cn(
                            "h-2 rounded-full",
                            isActive ? "bg-primary" : "bg-slate-200", // Tailwind equivalent of #E2E8F0
                        )}
                    />
                );
            })}
        </View>
    );
}
