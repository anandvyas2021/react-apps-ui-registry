import React, { forwardRef } from "react";
import { View, Text, Pressable, ViewStyle } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn, type IconName } from "@/lib/utils";

const floatingChipVariants = cva(
    "flex-row items-center justify-between border transition-all",
    {
        variants: {
            variant: {
                surface: "bg-surface border-border shadow-sm",
                muted: "bg-surface-muted border-transparent shadow-none",
                outline: "bg-transparent border-border shadow-none",
            },
            size: {
                sm: "p-2",
                default: "p-3",
                lg: "p-4",
            },
            roundness: {
                default: "rounded-[24px]",
                full: "rounded-full",
                lg: "rounded-2xl",
            },
        },
        defaultVariants: {
            variant: "surface",
            size: "default",
            roundness: "default",
        },
    },
);

const itemIconBoxVariants = cva("items-center justify-center", {
    variants: {
        intent: {
            primary: "bg-primary/10",
            success: "bg-emerald-500/10",
            warning: "bg-amber-500/10",
            destructive: "bg-destructive/10",
            muted: "bg-surface-muted",
        },
        size: {
            sm: "w-8 h-8 rounded-lg",
            default: "w-11 h-11 rounded-xl",
            lg: "w-14 h-14 rounded-2xl",
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "default",
    },
});

const itemIconColorVariants = cva("", {
    variants: {
        intent: {
            primary: "text-primary",
            success: "text-emerald-500",
            warning: "text-amber-500",
            destructive: "text-destructive",
            muted: "text-foreground-muted",
            normal: "text-foreground",
        },
    },
    defaultVariants: {
        intent: "muted",
    },
});

export interface FloatingChipItem {
    label: string;
    subtitle: string;
    icon?: IconName | string;
    intent?: "primary" | "success" | "warning" | "destructive" | "muted";
    colorClass?: string;
    bgClass?: string;
}

export interface FloatingChipProps extends VariantProps<
    typeof floatingChipVariants
> {
    leftItem: FloatingChipItem;
    rightItem: FloatingChipItem;
    showDivider?: boolean;
    className?: string;
    style?: ViewStyle;
    disabled?: boolean;
    onPress?: () => void;
}

export const FloatingChip = forwardRef<
    React.ComponentRef<typeof Pressable>,
    FloatingChipProps
>(
    (
        {
            leftItem,
            rightItem,
            variant,
            size = "default",
            roundness,
            showDivider = true,
            className,
            style,
            disabled,
            onPress,
            ...props
        },
        ref,
    ) => {
        const labelSize =
            size === "sm"
                ? "text-[10px]"
                : size === "lg"
                  ? "text-sm"
                  : "text-xs";
        const subtitleSize =
            size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";
        const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;

        const renderItem = (item: FloatingChipItem) => (
            <View className="flex-1 flex-row items-center gap-3">
                {item?.icon && (
                    <View
                        className={cn(
                            itemIconBoxVariants({ intent: item?.intent, size }),
                            item?.bgClass,
                        )}
                    >
                        <DynamicIcon
                            name={item.icon as string}
                            size={iconSize}
                            className={cn(
                                itemIconColorVariants({ intent: item?.intent }),
                                item?.colorClass,
                            )}
                        />
                    </View>
                )}

                <View className="flex-1 justify-center">
                    <Text
                        className={cn(
                            "font-medium text-foreground-muted mb-0.5",
                            labelSize,
                        )}
                        numberOfLines={1}
                    >
                        {item?.label}
                    </Text>
                    <Text
                        className={cn(
                            "font-bold tracking-tight",
                            itemIconColorVariants({
                                intent: item?.intent ?? "normal",
                            }),
                            subtitleSize,
                        )}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        {item?.subtitle}
                    </Text>
                </View>
            </View>
        );

        return (
            <Pressable
                ref={ref}
                disabled={disabled}
                onPress={onPress}
                style={style}
                className={cn(
                    floatingChipVariants({ variant, size, roundness }),
                    disabled && "opacity-60",
                    className,
                )}
                {...props}
            >
                {renderItem(leftItem)}
                {showDivider && (
                    <View
                        className={cn(
                            "w-[1px] bg-border mx-3",
                            size === "sm"
                                ? "h-6"
                                : size === "lg"
                                  ? "h-12"
                                  : "h-10",
                        )}
                    />
                )}
                {renderItem(rightItem)}
            </Pressable>
        );
    },
);

FloatingChip.displayName = "FloatingChip";
