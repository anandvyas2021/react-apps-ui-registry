import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { WaveDotsLoader } from "@/components/loaders/wave-dots-loader";
import { ShineGradientWrapper } from "@/components/layout/shine-gradient-wrapper";

import { cn, type IconName } from "@/lib/utils";

const buttonVariants = cva(
    "flex-row items-center justify-center gap-2 mb-3 w-full border min-h-[48px]",
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

const textVariants = cva("text-[13px] font-bold", {
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
    hasGradient?: boolean;
    GradientColors?: [string, string, ...string[]];
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
            hasGradient = false,
            GradientColors = ["#8870e6", "#5f84e0", "#5f84e0"],
            roundness = "default",
            ...props
        },
        ref,
    ) => {
        const isDisabled = disabled || isLoading;
        const isWrapped = (withShine || hasGradient) && !isDisabled;

        const buttonContent = (
            <TouchableOpacity
                ref={ref}
                activeOpacity={0.9}
                disabled={isDisabled}
                onPress={onPress}
                className={cn(
                    buttonVariants({
                        variant,
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
                {...props}
            >
                {isLoading ? (
                    <WaveDotsLoader />
                ) : (
                    <>
                        {icon && iconPosition === "pre" && (
                            <DynamicIcon
                                name={icon as string}
                                size={18}
                                className={cn(
                                    textVariants({
                                        variant,
                                        disabled: isDisabled,
                                    }),
                                    textClassName,
                                )}
                                strokeWidth={2.5}
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
                                size={18}
                                className={cn(
                                    textVariants({
                                        variant,
                                        disabled: isDisabled,
                                    }),
                                    textClassName,
                                )}
                                strokeWidth={2.5}
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
