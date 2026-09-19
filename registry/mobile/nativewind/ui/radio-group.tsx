import { View, Text, TouchableOpacity, ViewProps } from "react-native";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

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
    rightBlock?: { label?: string; suffix?: string };
    iconOptions?: { icon?: IconName | string; variant?: RadioIconVariant };
    disabled?: boolean;
}

export interface RadioCardProps extends ViewProps {
    option: RadioOption;
    isSelected: boolean;
    onSelect: (value: string) => void;
    radioPosition?: "left" | "right";
    className?: string;
}

const iconVariantConfig: Record<
    RadioIconVariant,
    { bg: string; text: string }
> = {
    default: { bg: "bg-surface-muted", text: "text-foreground" },
    primary: { bg: "bg-primary-lighter", text: "text-primary" },
    secondary: { bg: "bg-surface", text: "text-foreground" },
    success: { bg: "bg-success-bg", text: "text-success" },
    destructive: { bg: "bg-destructive-bg", text: "text-destructive" },
};

export function RadioCard({
    option,
    isSelected,
    onSelect,
    radioPosition = "right",
    className,
    style,
    ...props
}: RadioCardProps) {
    const handlePress = () => {
        if (option?.disabled) return;
        onSelect(option?.value);
    };

    const RadioCircle = (
        <View
            className={cn(
                "h-5 w-5 items-center justify-center rounded-full border-[3px]",
                isSelected
                    ? "border-primary bg-primary"
                    : "border-border bg-transparent",
                option.disabled && "opacity-40",
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
            disabled={option?.disabled}
            className={cn(
                "relative w-full min-h-[70px] flex-row items-center justify-between p-4 mb-3 rounded-2xl border",
                isSelected
                    ? "bg-primary-lighter border-primary"
                    : "bg-surface border-border",
                option?.disabled && "opacity-50",
                className,
            )}
            style={style}
            {...props}
        >
            {/* Top-Right Floating Pill Badge */}
            {option?.cornerBadge && (
                <View className="absolute -top-3 right-4 bg-foreground px-2.5 py-0.5 rounded-full z-10">
                    <Text className="text-[10px] font-black text-background">
                        {option?.cornerBadge}
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
                            name={option?.iconOptions?.icon as string}
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
                                isSelected
                                    ? "text-foreground"
                                    : "text-foreground",
                            )}
                            numberOfLines={1}
                        >
                            {option?.title}
                        </Text>

                        {option?.badge && (
                            <View className="px-2 py-0.5 rounded-md bg-primary-lighter">
                                <Text className="text-[10px] font-bold text-primary">
                                    {option?.badge}
                                </Text>
                            </View>
                        )}
                    </View>

                    {option?.subtitle && (
                        <Text
                            className="text-xs text-foreground-muted mt-0.5"
                            numberOfLines={1}
                        >
                            {option?.subtitle}
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
                            {option?.rightBlock?.label}
                            {option?.rightBlock?.suffix && (
                                <Text className="text-xs font-semibold text-foreground-muted">
                                    {" "}
                                    {option?.rightBlock?.suffix}
                                </Text>
                            )}
                        </Text>
                    </View>
                )}

                {radioPosition === "right" && RadioCircle}
            </View>
        </TouchableOpacity>
    );
}

// multi-checkbox group
export interface RadioGroupProps {
    options: RadioOption[];
    value: string;
    onValueChange: (value: string) => void;
    radioPosition?: "left" | "right";
    label?: string;
    error?: string;
    className?: string;
}
export function RadioGroup({
    options,
    value,
    onValueChange,
    radioPosition = "right",
    label,
    error,
    className,
}: RadioGroupProps) {
    return (
        <View className={cn("w-full mb-3", className)}>
            {label && (
                <Text className="text-xs font-medium text-foreground-muted mb-2 ml-1">
                    {label}
                </Text>
            )}

            {options.map((option) => (
                <RadioCard
                    key={option?.value}
                    option={option}
                    isSelected={value === option?.value}
                    onSelect={onValueChange}
                    radioPosition={radioPosition}
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

// controlled multi-checkbox group
export interface ControlledRadioGroupProps<
    T extends FieldValues,
> extends UseControllerProps<T> {
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
                />
            )}
        />
    );
}
