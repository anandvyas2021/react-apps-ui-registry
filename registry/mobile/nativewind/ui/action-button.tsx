import React, { forwardRef } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { WaveDotsLoader } from "@/components/loaders/wave-dots-loader";
import { ShineGradientWrapper } from "@/components/layout/shine-gradient-wrapper";

import { cn, type IconName } from "@/lib/utils";

const buttonVariants = cva(
    "flex-row items-center justify-center gap-2 mb-3 w-full border min-h-[52px]",
    {
        variants: {
            variant: {
                primary: "bg-primary border-transparent shadow-primary",
                secondary:
                    "bg-secondary border-secondary-foreground shadow-none",
            },
            disabled: {
                true: "bg-surface-muted shadow-none border-transparent",
            },
            roundness: {
                default: "rounded-2xl",
                full: "rounded-full",
                sm: "rounded-lg",
                none: "rounded-none",
            },
        },
        defaultVariants: {
            variant: "primary",
            disabled: false,
            roundness: "default",
        },
    },
);

const textVariants = cva("text-lg font-bold", {
    variants: {
        variant: {
            primary: "text-primary-foreground",
            secondary: "text-secondary-foreground",
        },
        disabled: { true: "text-foreground-disabled" },
    },
    defaultVariants: { variant: "primary", disabled: false },
});

export interface ActionButtonProps extends VariantProps<typeof buttonVariants> {
    title: string;
    icon?: IconName | string;
    iconPosition?: "pre" | "post";
    isLoading?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    className?: string;
    textClassName?: string;
    withShine?: boolean;
    shineColors?: [string, string, ...string[]];
    roundness: "default";
}

export const ActionButton = React.forwardRef<
    React.ElementRef<typeof TouchableOpacity>,
    ActionButtonProps
>(
    (
        {
            title,
            icon,
            variant = "primary",
            iconPosition = "post",
            isLoading = false,
            disabled = false,
            onPress,
            className,
            textClassName,
            withShine = false,
            shineColors = ["#3B82F6", "#2563EB", "#1E3A8A"],
            roundness = "default",
            ...props
        },
        ref,
    ) => {
        const isDisabled = disabled || isLoading;

        const buttonContent = (
            <TouchableOpacity
                ref={ref}
                activeOpacity={0.9}
                disabled={isDisabled}
                onPress={onPress}
                className={cn(
                    buttonVariants({ variant, disabled: isDisabled }),
                    className,
                    isLoading ? "opacity-80" : "",
                    withShine && !isDisabled
                        ? "bg-transparent shadow-none border-transparent mb-0"
                        : "",
                )}
                {...props}
            >
                {isLoading ? (
                    <WaveDotsLoader />
                ) : (
                    <>
                        {icon && iconPosition === "pre" && (
                            <DynamicIcon
                                name={icon as string}
                                size={20}
                                className={cn(
                                    textVariants({
                                        variant,
                                        disabled: isDisabled,
                                    }),
                                    textClassName,
                                )}
                            />
                        )}
                        <Text
                            className={cn(
                                textVariants({ variant, disabled: isDisabled }),
                                textClassName,
                            )}
                        >
                            {title}
                        </Text>
                        {icon && iconPosition === "post" && (
                            <DynamicIcon
                                name={icon as string}
                                size={20}
                                className={cn(
                                    textVariants({
                                        variant,
                                        disabled: isDisabled,
                                    }),
                                    textClassName,
                                )}
                            />
                        )}
                    </>
                )}
            </TouchableOpacity>
        );

        if (withShine && !isDisabled) {
            return (
                <ShineGradientWrapper
                    colors={shineColors}
                    // Pass the border-radius, width, and margin to the wrapper so it fits perfectly
                    className={cn(
                        "w-full rounded-full mb-3",
                        roundness === "full"
                            ? "rounded-full"
                            : roundness === "sm"
                              ? "rounded-lg"
                              : roundness === "none"
                                ? "rounded-none"
                                : "rounded-2xl",
                        className,
                    )}
                >
                    {buttonContent}
                </ShineGradientWrapper>
            );
        }

        return buttonContent;
    },
);
ActionButton.displayName = "ActionButton";
