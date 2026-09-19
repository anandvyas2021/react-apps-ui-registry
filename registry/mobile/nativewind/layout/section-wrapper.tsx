import React from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn } from "@/lib/utils";

export interface SectionWrapperProps {
    children: React.ReactNode;
    type?: "default" | "bordered";
    title?: string;
    showInfoIcon?: boolean;
    onInfoPress?: () => void;
    rightTitle?: string;
    rightType?: "text" | "navigate" | "chip";
    rightAction?: () => void;
    className?: string;
    style?: ViewStyle;
}

export function SectionWrapper({
    children,
    type = "default",
    title,
    showInfoIcon = false,
    onInfoPress,
    rightTitle,
    rightType = "text",
    rightAction,
    className,
    style,
}: SectionWrapperProps) {
    const renderInfoIcon = () => {
        if (!showInfoIcon && !onInfoPress) return null;

        const IconElement = (
            <DynamicIcon
                name="Info"
                size={16}
                className="text-foreground-muted ml-1"
            />
        );

        if (onInfoPress) {
            return (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onInfoPress}
                    hitSlop={10}
                >
                    {IconElement}
                </TouchableOpacity>
            );
        }
        return IconElement;
    };

    return (
        <View className={cn("w-full mb-6", className)} style={style}>
            {/* Header Row */}
            <View className="flex-row items-center justify-between mb-3 px-2">
                <View className="flex-row items-center gap-1.5">
                    {title && (
                        <Text className="text-base font-bold text-foreground tracking-tight">
                            {title}
                        </Text>
                    )}
                    {renderInfoIcon()}
                </View>

                {/* Right Action */}
                {rightTitle &&
                    (rightType === "text" ? (
                        <Text className="text-sm font-bold text-foreground-muted">
                            {rightTitle}
                        </Text>
                    ) : (
                        <TouchableOpacity
                            className={cn(
                                "flex-row items-center gap-1 px-2.5 py-1 rounded-full",
                                rightType === "chip" && "bg-surface-muted",
                            )}
                            onPress={rightAction}
                            activeOpacity={0.7}
                            disabled={!rightAction}
                        >
                            <Text className="text-sm font-bold text-foreground-muted">
                                {rightTitle}
                            </Text>
                            <DynamicIcon
                                name="ChevronRight"
                                size={12}
                                className="text-foreground-muted"
                            />
                        </TouchableOpacity>
                    ))}
            </View>

            {/* Content */}
            <View
                className={cn(
                    type === "bordered" &&
                        "border border-border rounded-2xl p-4 bg-background",
                )}
            >
                {children}
            </View>
        </View>
    );
}
