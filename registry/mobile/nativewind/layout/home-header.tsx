import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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

import { cn } from "@/lib/utils";

export interface HomeHeaderProps {
    inMainWrapper?: boolean;
    title?: string;
    hasNotifications?: boolean;
    onItemPress?: (route: string) => void;
    className?: string;
}

export function HomeHeader({
    inMainWrapper = true,
    title = "App Name",
    hasNotifications = true,
    onItemPress,
    className,
    ...props
}: HomeHeaderProps) {
    const insets = useSafeAreaInsets();
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
            className={cn("px-3 py-2 mx-3 rounded-2xl z-50", className)}
            style={{ marginTop: inMainWrapper ? 0 : insets.top + 20 }}
            {...props}
        >
            <View className="w-full flex-row items-center justify-between">
                {/* Logo & Name */}
                <View className="flex-row items-center gap-2">
                    <View className="size-11 items-center justify-center pl-3 rounded-2xl shadow-sm bg-primary">
                        <DynamicIcon
                            name="Hexagon"
                            size={24}
                            className="text-primary-foreground"
                        />
                    </View>
                    <Text className="text-xl font-extrabold text-primary tracking-tight">
                        {title}
                    </Text>
                </View>

                {/* Actions */}
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => onItemPress("/notifications")}
                        className="p-2 items-center justify-center rounded-xl border-[0.5px] border-primary bg-background"
                    >
                        <DynamicIcon
                            name="Bell"
                            size={26}
                            className="text-primary fill-primary"
                        />
                        <Animated.View
                            style={[
                                animatedDotStyle,
                                { position: "absolute", top: 9, right: 10 },
                            ]}
                            className="w-2.5 h-2.5 bg-destructive rounded-full border border-border"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => onItemPress("/profile")}
                        className="p-2 items-center justify-center rounded-xl border-[0.5px] border-primary bg-background"
                    >
                        <DynamicIcon
                            name="User"
                            size={26}
                            className="text-primary fill-primary"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
