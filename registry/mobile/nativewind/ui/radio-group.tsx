import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    type TouchableOpacityProps,
    type ViewStyle,
} from "react-native";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
    type UseControllerProps,
} from "react-hook-form";

import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { cn, type IconName } from "@/lib/utils";

export type RadioIconVariant =
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "destructive";

export interface RadioOption {
    value: string;
    title: string;
    subtitle?: string;
    badge?: string;
    cornerBadge?: string;
    rightBlock?: {
        label?: string;
        suffix?: string;
        value?: string;
        type?: "money" | string;
    };
    iconOptions?: { icon?: IconName | string; variant?: RadioIconVariant };
    disabled?: boolean;
}

export interface RadioCardProps extends Omit<TouchableOpacityProps, "onPress"> {
    option: RadioOption;
    isSelected: boolean;
    onSelect: (value: string) => void;
    radioPosition?: "left" | "right";
    disabled?: boolean;
    hasError?: boolean;
    className?: string;
}

const formatCurrency = ({ value }: { value: number }) => {
    if (isNaN(value)) return "";
    return `₹${value.toLocaleString("en-IN")}`;
};

const iconVariantConfig: Record<
    RadioIconVariant,
    { bg: string; text: string }
> = {
    default: { bg: "bg-surface-muted", text: "text-foreground" },
    primary: { bg: "bg-primary-lighter", text: "text-primary" },
    secondary: { bg: "bg-surface", text: "text-foreground" },
    success: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
    destructive: { bg: "bg-destructive-bg", text: "text-destructive" },
};

export function RadioCard({
    option,
    isSelected,
    onSelect,
    radioPosition = "right",
    disabled = false,
    hasError = false,
    className,
    style,
    ...props
}: RadioCardProps) {
    const isDisabled = Boolean(disabled || option?.disabled);

    const handlePress = () => {
        if (isDisabled) return;
        onSelect(option?.value);
    };

    const RadioCircle = (
        <View
            className={cn(
                "h-5 w-5 items-center justify-center rounded-full border-[3px]",
                isSelected
                    ? "border-primary bg-primary"
                    : hasError
                      ? "border-destructive bg-transparent"
                      : "border-border bg-transparent",
                option?.disabled && "opacity-40",
            )}
        >
            {isSelected && (
                <View className="h-2.5 w-2.5 rounded-full bg-white" />
            )}
        </View>
    );

    const activeVariant = option?.iconOptions?.variant || "default";

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={handlePress}
            disabled={isDisabled}
            className={cn(
                "relative w-full min-h-[70px] flex-row items-center justify-between p-4 mb-3 rounded-2xl border",
                isSelected
                    ? "bg-primary-lighter border-primary"
                    : hasError
                      ? "bg-surface border-destructive"
                      : "bg-surface border-border",
                isDisabled && "opacity-50 bg-surface-muted",
                className,
            )}
            style={style}
            {...props}
        >
            {/* Top-Right Floating Pill Badge */}
            {option?.cornerBadge && (
                <View className="absolute -top-3 right-4 bg-foreground px-2.5 py-0.5 rounded-full z-10">
                    <Text className="text-[10px] font-black text-background">
                        {option.cornerBadge}
                    </Text>
                </View>
            )}

            {/* Left Zone: Radio / Icon / Titles */}
            <View className="flex-row items-center flex-1 mr-3">
                {radioPosition === "left" && (
                    <View className="mr-3.5">{RadioCircle}</View>
                )}

                {option?.iconOptions?.icon && (
                    <View
                        className={cn(
                            "h-10 w-9 items-center justify-center mr-3.5 rounded-lg",
                            iconVariantConfig[activeVariant]?.bg,
                        )}
                    >
                        <DynamicIcon
                            name={option.iconOptions.icon as string}
                            size={20}
                            className={iconVariantConfig[activeVariant]?.text}
                        />
                    </View>
                )}

                <View className="flex-1 justify-center">
                    <View className="flex-row items-center gap-2 flex-wrap">
                        <Text
                            className={cn(
                                "text-sm font-bold",
                                isSelected ? "text-primary" : "text-foreground",
                            )}
                            numberOfLines={1}
                        >
                            {option?.title}
                        </Text>

                        {option?.badge && (
                            <View className="px-2 py-0.5 rounded-md bg-primary">
                                <Text className="text-[10px] font-bold text-primary">
                                    {option.badge}
                                </Text>
                            </View>
                        )}
                    </View>

                    {option?.subtitle && (
                        <Text
                            className="text-xs text-foreground-muted mt-0.5"
                            numberOfLines={1}
                        >
                            {option.subtitle}
                        </Text>
                    )}
                </View>
            </View>

            {/* Right Zone: Price Info / Right Radio */}
            <View className="flex-row items-center gap-3">
                {(option?.rightBlock?.label || option?.rightBlock?.suffix) && (
                    <View className="items-end">
                        <Text
                            className={cn(
                                "text-xs font-bold tracking-tight",
                                isSelected ? "text-primary" : "text-foreground",
                            )}
                        >
                            {option?.rightBlock?.type === "money"
                                ? formatCurrency({
                                      value: Number(option?.rightBlock?.label),
                                  })
                                : option?.rightBlock?.label}
                            {option?.rightBlock?.suffix && (
                                <Text className="text-xs font-semibold text-foreground-muted">
                                    {" "}
                                    {option.rightBlock.suffix}
                                </Text>
                            )}
                        </Text>
                        {option?.rightBlock?.value && (
                            <Text className="text-[10px] font-medium text-foreground-muted">
                                {option.rightBlock.value}
                            </Text>
                        )}
                    </View>
                )}

                {radioPosition === "right" && RadioCircle}
            </View>
        </TouchableOpacity>
    );
}

export interface RadioGroupProps {
    options: RadioOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    radioPosition?: "left" | "right";
    label?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
    style?: ViewStyle;
}

export function RadioGroup({
    options = [],
    value,
    defaultValue = "",
    onValueChange,
    radioPosition = "right",
    label,
    error,
    disabled = false,
    className,
    style,
}: RadioGroupProps) {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const selectedValue = isControlled ? value : internalValue;

    const handleSelect = (newValue: string) => {
        if (disabled) return;
        if (!isControlled) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    };

    return (
        <View className={cn("w-full mb-3", className)} style={style}>
            {label && (
                <Text
                    className={cn(
                        "text-xs font-medium text-foreground-muted mb-2 ml-1",
                        disabled && "opacity-50",
                    )}
                >
                    {label}
                </Text>
            )}

            {options?.map((option) => (
                <RadioCard
                    key={option?.value}
                    option={option}
                    isSelected={selectedValue === option?.value}
                    onSelect={handleSelect}
                    radioPosition={radioPosition}
                    disabled={disabled}
                    hasError={Boolean(error)}
                />
            ))}

            {error && (
                <Text className="text-xs text-destructive mt-1 ml-1 font-medium">
                    {error}
                </Text>
            )}
        </View>
    );
}

export interface ControlledRadioGroupProps<T extends FieldValues>
    extends
        UseControllerProps<T>,
        Omit<
            RadioGroupProps,
            "value" | "defaultValue" | "onValueChange" | "error"
        > {
    control: Control<T>;
    name: Path<T>;
    options: RadioOption[];
    radioPosition?: "left" | "right";
    label?: string;
    className?: string;
}

export function ControlledRadioGroup<T extends FieldValues>({
    control,
    name,
    options,
    radioPosition,
    label,
    className,
    ...rest
}: ControlledRadioGroupProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <RadioGroup
                    options={options}
                    value={value}
                    onValueChange={onChange}
                    radioPosition={radioPosition}
                    label={label}
                    error={error?.message}
                    className={className}
                    {...rest}
                />
            )}
        />
    );
}
ControlledRadioGroup.displayName = "ControlledRadioGroup";
