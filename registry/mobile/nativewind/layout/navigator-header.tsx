import React from "react";
import { View, Text, TouchableOpacity, ViewProps } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn } from "@/lib/utils";

export interface NavigatorHeaderProps extends ViewProps {
    title?: string;
    haveBackButton?: boolean;
    inMainWrapper?: boolean;
    onBackPress?: () => void;
}

export function NavigatorHeader({
    title,
    haveBackButton = true,
    inMainWrapper = true,
    onBackPress,
    className,
    ...props
}: NavigatorHeaderProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleBack = () => {
        if (onBackPress) onBackPress();
        else router.back();
    };

    return (
        <View
            className={cn(
                "w-full flex-row items-center justify-between pb-2 px-6 bg-transparent z-10",
                className,
            )}
            style={{ paddingTop: inMainWrapper ? 0 : insets.top + 16 }}
            {...props}
        >
            {haveBackButton ? (
                <TouchableOpacity
                    onPress={handleBack}
                    activeOpacity={0.7}
                    className="w-12 h-12 items-center justify-center rounded-2xl bg-surface"
                >
                    <DynamicIcon
                        name="ArrowLeft"
                        size={20}
                        className="text-foreground"
                    />
                </TouchableOpacity>
            ) : (
                <View className="w-12 h-12" />
            )}

            <Text
                className={cn(
                    "text-lg font-bold",
                    haveBackButton ? "text-foreground" : "text-primary",
                )}
            >
                {title}
            </Text>

            <View className="w-12 h-12" />
        </View>
    );
}
