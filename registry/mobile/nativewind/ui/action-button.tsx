import React, { forwardRef } from "react";
import { TouchableOpacity, Text, ViewStyle, TextStyle } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { WaveDotsLoader } from "@/components/loaders/wave-dots-loader";
import { ShineGradientWrapper } from "@/components/layout/shine-gradient-wrapper";

import { cn, type IconName } from "@/lib/utils";

const buttonVariants = cva("flex-row items-center justify-center border", {
    variants: {
        variant: {
            primary: "bg-primary border-transparent shadow-sm",
            secondary: "bg-secondary border-secondary-foreground shadow-none",
        },
        size: {
            sm: "min-h-[36px] px-3 gap-1.5 mb-0",
            default: "min-h-[48px] px-4 gap-2 mb-3",
            lg: "min-h-[56px] px-6 gap-2 mb-3",
        },
        fullWidth: {
            true: "w-full",
            false: "self-start",
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
        size: "default",
        fullWidth: true,
        disabled: false,
        roundness: "default",
    },
});

const textVariants = cva("font-bold", {
    variants: {
        variant: {
            primary: "text-primary-foreground",
            secondary: "text-secondary-foreground",
        },
        size: {
            sm: "text-xs",
            default: "text-[13px]",
            lg: "text-[15px]",
        },
        disabled: { true: "text-foreground-disabled" },
    },
    defaultVariants: { variant: "primary", size: "default", disabled: false },
});

export interface ActionButtonProps extends VariantProps<typeof buttonVariants> {
    title: string;
    size?: "sm" | "default" | "lg";
    fullWidth?: boolean;
    icon?: IconName | string;
    iconPosition?: "pre" | "post";
    isLoading?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    className?: string;
    textClassName?: string;
    iconClassName?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
    withShine?: boolean;
    hasGradient?: boolean;
    GradientColors?: [string, string, ...string[]];
}

export const ActionButton = forwardRef<
    React.ElementRef<typeof TouchableOpacity>,
    ActionButtonProps
>(
    (
        {
            title,
            icon,
            variant = "primary",
            size = "default",
            fullWidth = true,
            roundness = "default",
            iconPosition = "post",
            isLoading = false,
            disabled = false,
            onPress,
            className,
            textClassName,
            iconClassName,
            style,
            textStyle,
            withShine = false,
            hasGradient = false,
            GradientColors = ["#8870e6", "#5f84e0", "#5f84e0"],
        },
        ref,
    ) => {
        const isDisabled = disabled || isLoading;
        const isWrapped = (withShine || hasGradient) && !isDisabled;
        const iconSize = size === "sm" ? 14 : size === "lg" ? 20 : 18;

        const buttonContent = (
            <TouchableOpacity
                ref={ref}
                activeOpacity={0.9}
                disabled={isDisabled}
                onPress={onPress}
                style={style}
                className={cn(
                    buttonVariants({
                        variant,
                        size,
                        fullWidth,
                        disabled: isDisabled,
                        roundness,
                    }),
                    className,
                    isLoading ? "opacity-80" : "",
                    isWrapped ? "mb-0" : "",
                    hasGradient && !isDisabled
                        ? "bg-transparent shadow-none border-transparent"
                        : "",
                )}
            >
                {isLoading ? (
                    <WaveDotsLoader />
                ) : (
                    <>
                        {icon && iconPosition === "pre" && (
                            <DynamicIcon
                                name={icon as string}
                                size={iconSize}
                                strokeWidth={2.5}
                                className={cn(
                                    textVariants({
                                        variant,
                                        size,
                                        disabled: isDisabled,
                                    }),
                                    textClassName,
                                    iconClassName,
                                )}
                            />
                        )}
                        <Text
                            style={textStyle}
                            className={cn(
                                textVariants({
                                    variant,
                                    size,
                                    disabled: isDisabled,
                                }),
                                textClassName,
                            )}
                        >
                            {title}
                        </Text>
                        {icon && iconPosition === "post" && (
                            <DynamicIcon
                                name={icon as string}
                                size={iconSize}
                                strokeWidth={2.5}
                                className={cn(
                                    textVariants({
                                        variant,
                                        size,
                                        disabled: isDisabled,
                                    }),
                                    textClassName,
                                    iconClassName,
                                )}
                            />
                        )}
                    </>
                )}
            </TouchableOpacity>
        );

        if (isWrapped) {
            return (
                <ShineGradientWrapper
                    colors={GradientColors}
                    className={cn(
                        fullWidth ? "w-full" : "self-start",
                        size === "sm" ? "mb-0" : "mb-3",
                        roundness === "full"
                            ? "rounded-full"
                            : roundness === "sm"
                              ? "rounded-lg"
                              : roundness === "none"
                                ? "rounded-none"
                                : "rounded-2xl",
                        className,
                    )}
                    isShining={withShine}
                    hasGradient={hasGradient}
                >
                    {buttonContent}
                </ShineGradientWrapper>
            );
        }

        return buttonContent;
    },
);
ActionButton.displayName = "ActionButton";
