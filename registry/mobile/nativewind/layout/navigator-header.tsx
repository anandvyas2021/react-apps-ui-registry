import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn } from "@/lib/utils";

export interface NavigatorHeaderProps {
    title?: string;
    haveBackButton?: boolean;
    inMainWrapper?: boolean;
    onBackPress?: () => void;
    navigatorOptions?: {
        rightBlock?: [{ name?: string; onPress?: () => void; icon?: string }];
    };
}

export function NavigatorHeader({
    title,
    haveBackButton = true,
    inMainWrapper = true,
    onBackPress,
    className,
    navigatorOptions,
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
            <View className="flex-1 items-start justify-center">
                {haveBackButton && (
                    <TouchableOpacity
                        onPress={handleBack}
                        activeOpacity={0.7}
                        className="size-12 items-center justify-center rounded-2xl bg-surface"
                    >
                        <DynamicIcon
                            name="ArrowLeft"
                            size={20}
                            className="text-foreground"
                        />
                    </TouchableOpacity>
                )}
            </View>

            <View className="flex-[2] items-center justify-center">
                {title && (
                    <Text
                        numberOfLines={1}
                        className={cn(
                            "text-lg font-bold",
                            haveBackButton ? "text-foreground" : "text-primary",
                        )}
                    >
                        {title}
                    </Text>
                )}
            </View>

            <View className="flex-1 flex-row items-center justify-end gap-3">
                {navigatorOptions?.rightBlock?.length &&
                    navigatorOptions?.rightBlock?.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={item?.onPress}
                                activeOpacity={0.7}
                                className="size-10 items-center justify-center rounded-2xl bg-primary-lighter"
                            >
                                {item?.name ? (
                                    <DynamicIcon
                                        name={item?.icon as string}
                                        size={20}
                                        className="text-primary"
                                    />
                                ) : item?.name ? (
                                    <Text className="text-sm font-bold text-foreground px-2">
                                        {item.name}
                                    </Text>
                                ) : null}
                            </TouchableOpacity>
                        );
                    })}
            </View>
        </View>
    );
}
