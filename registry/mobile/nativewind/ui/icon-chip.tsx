import React, { forwardRef } from "react";
import {
    Pressable,
    Text,
    View,
    type GestureResponderEvent,
    type ViewStyle,
    type TextStyle,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import * as Clipboard from "expo-clipboard";

import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { cn, type IconName } from "@/lib/utils";

const chipVariants = cva("flex-row items-center justify-center", {
    variants: {
        variant: {
            primary: "border-primary",
            success: "border-emerald-500",
            warning: "border-amber-500",
            destructive: "border-destructive",
            muted: "border-border",
        },
        outlineType: {
            bordered: "border",
            dotted: "border border-dotted",
            dashed: "border border-dashed",
            ghost: "border-0",
        },
        fill: {
            soft: "",
            solid: "",
            hollow: "bg-transparent",
        },
        size: {
            xs: "gap-1 px-1.5 py-0.5",
            sm: "gap-1 px-2.5 py-1",
            md: "gap-1.5 px-3 py-1.5",
            lg: "gap-2 px-4 py-2",
        },
        radius: {
            full: "rounded-full",
            lg: "rounded-lg",
            md: "rounded-md",
            sm: "rounded-sm",
        },
        iconPosition: {
            pre: "flex-row",
            post: "flex-row-reverse",
        },
    },
    compoundVariants: [
        // Soft Fills
        {
            variant: "primary",
            fill: "soft",
            className: "bg-primary/10",
        },
        {
            variant: "success",
            fill: "soft",
            className: "bg-emerald-500/10",
        },
        {
            variant: "warning",
            fill: "soft",
            className: "bg-amber-500/10",
        },
        {
            variant: "destructive",
            fill: "soft",
            className: "bg-destructive/10",
        },
        {
            variant: "muted",
            fill: "soft",
            className: "bg-surface-muted",
        },

        // Solid Fills
        { variant: "primary", fill: "solid", className: "bg-primary" },
        { variant: "success", fill: "solid", className: "bg-emerald-500" },
        { variant: "warning", fill: "solid", className: "bg-amber-500" },
        {
            variant: "destructive",
            fill: "solid",
            className: "bg-destructive",
        },
        {
            variant: "muted",
            fill: "solid",
            className: "bg-foreground-muted",
        },
    ],
    defaultVariants: {
        variant: "primary",
        fill: "soft",
        size: "md",
        radius: "full",
        iconPosition: "pre",
        outlineType: "bordered",
    },
});

const chipTextVariants = cva("font-bold tracking-tight", {
    variants: {
        variant: {
            primary: "text-primary",
            success: "text-emerald-500",
            warning: "text-amber-500",
            destructive: "text-destructive",
            muted: "text-foreground-muted",
        },
        fill: {
            soft: "",
            solid: "text-white",
            hollow: "",
        },
        size: {
            xs: "text-[9px]",
            sm: "text-[10px]",
            md: "text-xs",
            lg: "text-sm",
        },
        textTransform: {
            normal: "",
            uppercase: "uppercase tracking-wider text-[9px]",
        },
    },
    defaultVariants: {
        variant: "primary",
        fill: "soft",
        size: "md",
        textTransform: "normal",
    },
});

export interface IconChipProps extends VariantProps<typeof chipVariants> {
    label?: string;
    icon?: IconName | string;
    dotColor?: string;
    iconPosition?: "pre" | "post";
    variant?: "primary" | "success" | "destructive" | "warning" | "muted";
    fill?: "soft" | "solid" | "hollow";
    size?: "xs" | "sm" | "md" | "lg";
    radius?: "full" | "lg" | "md" | "sm";
    textTransform?: "normal" | "uppercase";
    outlineType?: "bordered" | "dotted" | "dashed" | "ghost";
    copyable?: boolean;
    onPress?: (event: GestureResponderEvent) => void;
    className?: string;
    textClassName?: string;
    iconClassName?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const IconChip = forwardRef<
    React.ElementRef<typeof Pressable>,
    IconChipProps
>(
    (
        {
            label,
            variant = "primary",
            fill = "soft",
            size = "md",
            radius = "full",
            textTransform = "normal",
            icon,
            dotColor,
            iconPosition = "pre",
            className,
            textClassName,
            iconClassName,
            copyable = false,
            outlineType = "bordered",
            onPress,
            style,
            textStyle,
            ...props
        },
        ref,
    ) => {
        const handlePress = async (e: GestureResponderEvent) => {
            if (copyable && label) {
                await Clipboard.setStringAsync(label);
            }
            if (onPress) onPress(e);
        };

        const iconSize =
            size === "xs" ? 11 : size === "sm" ? 12 : size === "md" ? 14 : 16;
        const dotSizeClass =
            size === "xs"
                ? "h-1 w-1"
                : size === "sm"
                  ? "h-1.5 w-1.5"
                  : size === "md"
                    ? "h-2 w-2"
                    : "h-2.5 w-2.5";

        return (
            <Pressable
                ref={ref}
                onPress={handlePress}
                disabled={!copyable && !onPress}
                style={style}
                className={cn(
                    chipVariants({
                        variant,
                        fill,
                        size,
                        radius,
                        iconPosition,
                        outlineType,
                    }),
                    !label && "aspect-square px-1.5",
                    className,
                )}
                {...props}
            >
                {dotColor ? (
                    <View
                        className={cn(
                            "rounded-full",
                            dotSizeClass,
                            iconClassName,
                        )}
                        style={{ backgroundColor: dotColor }}
                    />
                ) : icon ? (
                    <DynamicIcon
                        name={icon as string}
                        size={iconSize}
                        className={cn(
                            chipTextVariants({ variant, fill }),
                            iconClassName,
                        )}
                    />
                ) : null}

                {label && (
                    <Text
                        style={textStyle}
                        className={cn(
                            chipTextVariants({
                                variant,
                                fill,
                                size,
                                textTransform,
                            }),
                            textClassName,
                        )}
                        numberOfLines={1}
                    >
                        {label}
                    </Text>
                )}
            </Pressable>
        );
    },
);
IconChip.displayName = "IconChip";
