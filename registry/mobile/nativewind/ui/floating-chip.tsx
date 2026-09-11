import React from "react";
import { View, Text, ViewProps } from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn, type IconName } from "@/lib/utils";

export interface FloatingChipInterface {
    label: string;
    value: string;
    icon: IconName | string;
    colorClass?: string; // e.g., "text-primary"
    bgClass?: string; // e.g., "bg-primary-lighter"
}

export interface FloatingChipProps extends ViewProps {
    leftItem: FloatingChipInterface;
    rightItem: FloatingChipInterface;
}

export function FloatingChip({
    leftItem,
    rightItem,
    className,
    ...props
}: FloatingChipProps) {
    // A helper to render each side identically
    const renderItem = (item: FloatingChipInterface) => (
        <View className="flex-1 flex-row items-center gap-3">
            <View
                className={cn(
                    "w-11 h-11 rounded-xl items-center justify-center",
                    item.bgClass || "bg-primary-lighter",
                )}
            >
                <DynamicIcon
                    name={item.icon as string}
                    size={20}
                    className={cn(item.colorClass || "text-primary")}
                />
            </View>

            {/* The Text Stack */}
            <View className="flex-1 justify-center">
                <Text className="text-xs font-medium text-foreground-muted mb-0.5">
                    {item.label}
                </Text>
                <Text
                    className="text-base font-bold text-foreground tracking-tight"
                    numberOfLines={1}
                    adjustsFontSizeToFit
                >
                    {item.value}
                </Text>
            </View>
        </View>
    );

    return (
        <View
            className={cn(
                "flex-row items-center justify-between p-3 bg-surface rounded-[24px] border-[0.5px] border-border shadow-sm",
                className,
            )}
            {...props}
        >
            {renderItem(leftItem)}
            <View className="w-[1px] h-10 bg-border mx-3" />
            {renderItem(rightItem)}
        </View>
    );
}

FloatingChip.displayName = "FloatingChip";
