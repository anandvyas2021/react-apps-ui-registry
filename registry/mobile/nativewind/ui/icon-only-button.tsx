import React, { forwardRef } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn, type IconName } from "@/lib/utils";

const iconButtonVariants = cva(
    "items-center justify-center rounded-2xl border",
    {
        variants: {
            variant: {
                default:
                    "bg-surface border-border shadow-sm active:bg-surface-button",
                ghost: "bg-transparent border-transparent active:bg-slate-800/50",
            },
            size: {
                default: "w-16 h-16",
                sm: "w-12 h-12 rounded-xl",
                lg: "w-20 h-20 rounded-3xl",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface IconOnlyButtonProps
    extends
        Omit<TouchableOpacityProps, "onPress" | "className">,
        VariantProps<typeof iconButtonVariants> {
    icon: IconName | string;
    onPress: () => void;
    iconColor?: string;
    className?: string;
}

export const IconOnlyButton = forwardRef<
    React.ElementRef<typeof TouchableOpacity>,
    IconOnlyButtonProps
>(({ icon, variant, size, iconColor, className, onPress, ...props }, ref) => {
    return (
        <TouchableOpacity
            ref={ref}
            activeOpacity={0.7}
            className={cn(iconButtonVariants({ variant, size }), className)}
            onPress={onPress}
            {...props}
        >
            <DynamicIcon
                name={icon as string}
                size={size === "sm" ? 20 : size === "lg" ? 32 : 24}
                color={iconColor} // or "#94a3b8"
                className="text-foreground-muted"
            />
        </TouchableOpacity>
    );
});
IconOnlyButton.displayName = "IconOnlyButton";
