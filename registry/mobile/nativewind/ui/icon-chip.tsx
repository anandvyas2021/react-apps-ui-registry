import React, { forwardRef } from "react";
import { Pressable, Text, PressableProps, View } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn, type IconName } from "@/lib/utils";

const chipVariants = cva(
    "items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border",
    {
        variants: {
            variant: {
                primary: "border-primary bg-primary-lighter",
                success: "border-success bg-success-bg",
                warning: "bg-orange-500/10 border-warning",
                destructive: "bg-destructive-bg border-destructive",
                muted: "border-border bg-surface",
            },
            iconPosition: {
                pre: "flex-row",
                post: "flex-row-reverse",
            },
        },
        defaultVariants: {
            variant: "primary",
            iconPosition: "pre",
        },
    },
);

const chipTextVariants = cva("text-xs font-extrabold", {
    variants: {
        variant: {
            primary: "text-primary",
            success: "text-success",
            warning: "text-warning",
            destructive: "text-destructive",
            muted: "text-foreground-muted",
        },
    },
    defaultVariants: {
        variant: "primary",
    },
});

export interface IconChipProps extends Omit<PressableProps, "className"> {
    label: string;
    icon?: IconName;
    iconPosition?: "pre" | "post";
    variant?: "primary" | "success" | "destructive" | "warning" | "muted";
    className?: string;
    copyable?: boolean;
}

export const IconChip = forwardRef<
    React.ElementRef<typeof View>,
    IconChipProps
>(
    (
        {
            label,
            variant = "primary",
            icon,
            iconPosition = "pre",
            className,
            copyable = false,
            onPress,
            ...props
        },
        ref,
    ) => {
        const handlePress = (e: any) => {
            if (copyable) {
                // TODO: Implement your clipboard/haptics logic here
                console.log(`Copied: ${label}`);
            }
            if (onPress) onPress(e);
        };

        return (
            <Pressable
                ref={ref}
                onPress={handlePress}
                disabled={!copyable && !onPress}
                className={cn(
                    chipVariants({ variant, iconPosition }),
                    className,
                )}
                {...props}
            >
                <DynamicIcon
                    name={icon}
                    size={14}
                    className={chipTextVariants({ variant })}
                />
                <Text className={chipTextVariants({ variant })}>{label}</Text>
            </Pressable>
        );
    },
);
IconChip.displayName = "IconChip";
