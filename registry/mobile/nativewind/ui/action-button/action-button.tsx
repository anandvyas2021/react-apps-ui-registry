import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils/utils";
import { WaveDotsLoader } from "../wave-dots-loader/wave-dots-loader";
import { DynamicIcon } from "../dynamic-icon/dynamic-icon";

const buttonVariants = cva(
    "flex-row items-center justify-center gap-2 mb-3 w-full rounded-2xl border min-h-[52px]",
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
        },
        defaultVariants: { variant: "primary", disabled: false },
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

export interface ActionButtonProps
    extends TouchableOpacityProps, VariantProps<typeof buttonVariants> {
    title: string;
    icon?: string;
    iconPosition?: "pre" | "post";
    isLoading?: boolean;
    textStyles?: string;
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
            textStyles,
            className,
            ...props
        },
        ref,
    ) => {
        const isDisabled = disabled || isLoading;

        return (
            <TouchableOpacity
                ref={ref}
                activeOpacity={0.9}
                disabled={isDisabled}
                className={cn(
                    buttonVariants({ variant, disabled: isDisabled }),
                    className,
                    isLoading ? "opacity-80" : "",
                )}
                {...props}
            >
                {isLoading ? (
                    <WaveDotsLoader />
                ) : (
                    <>
                        {icon && iconPosition === "pre" && (
                            <DynamicIcon
                                name={icon}
                                size={20}
                                className={cn(
                                    textVariants({
                                        variant,
                                        disabled: isDisabled,
                                    }),
                                    textStyles,
                                )}
                            />
                        )}
                        <Text
                            className={cn(
                                textVariants({ variant, disabled: isDisabled }),
                                textStyles,
                            )}
                        >
                            {title}
                        </Text>
                        {icon && iconPosition === "post" && (
                            <DynamicIcon
                                name={icon}
                                size={20}
                                className={cn(
                                    textVariants({
                                        variant,
                                        disabled: isDisabled,
                                    }),
                                    textStyles,
                                )}
                            />
                        )}
                    </>
                )}
            </TouchableOpacity>
        );
    },
);
ActionButton.displayName = "ActionButton";
