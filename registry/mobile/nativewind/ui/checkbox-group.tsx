import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn, type IconName } from "@/lib/utils";

export interface CheckboxOption {
    value: string;
    title: string;
    subtitle?: string;
    icon?: IconName | string;
    badge?: string;
    cornerBadge?: string;
    disabled?: boolean;
}

export interface CheckboxCardProps {
    option: CheckboxOption;
    isSelected: boolean;
    onToggle: (value: string) => void;
    checkboxPosition?: "left" | "right";
    className?: string;
    style?: ViewStyle;
}

export function CheckboxCard({
    option,
    isSelected,
    onToggle,
    checkboxPosition = "right",
    className,
    style,
}: CheckboxCardProps) {
    const handlePress = () => {
        if (option?.disabled) return;
        onToggle(option?.value);
    };

    const CheckboxSquare = (
        <View
            className={cn(
                "h-5 w-5 rounded-md items-center justify-center border-2",
                isSelected
                    ? "border-primary bg-primary"
                    : "border-border bg-transparent",
                option?.disabled && "opacity-40",
            )}
        >
            {isSelected && (
                <DynamicIcon
                    name="Check"
                    size={14}
                    strokeWidth={3}
                    className="text-primary-foreground"
                />
            )}
        </View>
    );

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={handlePress}
            disabled={option?.disabled}
            className={cn(
                "relative w-full min-h-[60px] flex-row items-center justify-between p-4 mb-3 rounded-2xl border",
                isSelected
                    ? "bg-primary-lighter border-primary"
                    : "bg-surface border-border",
                option?.disabled && "opacity-50",
                className,
            )}
            style={style}
        >
            {option?.cornerBadge && (
                <View className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full z-10 bg-foreground">
                    <Text className="text-[10px] font-black text-background">
                        {option?.cornerBadge}
                    </Text>
                </View>
            )}

            <View className="flex-row items-center flex-1 mr-3">
                {checkboxPosition === "left" && (
                    <View className="mr-3.5">{CheckboxSquare}</View>
                )}

                {option?.icon && (
                    <View
                        className={cn(
                            "h-11 w-11 rounded-xl items-center justify-center mr-3.5",
                            isSelected
                                ? "bg-primary-lighter"
                                : "bg-surface-muted",
                        )}
                    >
                        <DynamicIcon
                            name={option?.icon as string}
                            size={20}
                            className={
                                isSelected
                                    ? "text-primary"
                                    : "text-foreground-muted"
                            }
                        />
                    </View>
                )}

                <View className="flex-1 justify-center">
                    <View className="flex-row flex-wrap items-center gap-2">
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

            {checkboxPosition === "right" && CheckboxSquare}
        </TouchableOpacity>
    );
}

// single checkbox (For simple forms, Terms & Conditions, etc.)

export interface CheckboxProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    className?: string;
    style?: ViewStyle;
}
export function Checkbox({
    checked,
    onCheckedChange,
    label,
    description,
    disabled = false,
    className,
    style,
}: CheckboxProps) {
    const handlePress = () => {
        if (disabled) return;
        onCheckedChange(!checked);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={handlePress}
            disabled={disabled}
            className={cn(
                "flex-row items-center gap-3 py-2",
                disabled && "opacity-50",
                className,
            )}
            style={style}
        >
            <View
                className={cn(
                    "h-5 w-5 rounded-md items-center justify-center border-2",
                    checked
                        ? "border-primary bg-primary"
                        : "border-border bg-transparent",
                )}
            >
                {checked && (
                    <DynamicIcon
                        name="Check"
                        size={14}
                        strokeWidth={3}
                        className="text-primary-foreground"
                    />
                )}
            </View>

            {(label || description) && (
                <View className="flex-1 justify-center">
                    {label && (
                        <Text className="text-sm font-semibold text-foreground">
                            {label}
                        </Text>
                    )}
                    {description && (
                        <Text className="text-xs text-foreground-muted mt-0.5">
                            {description}
                        </Text>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
}

// multi-select group

export interface CheckboxGroupProps {
    options: CheckboxOption[];
    values: string[];
    onValuesChange: (values: string[]) => void;
    checkboxPosition?: "left" | "right";
    label?: string;
    error?: string;
    className?: string;
    style?: ViewStyle;
}
export function CheckboxGroup({
    options,
    values = [],
    onValuesChange,
    checkboxPosition = "right",
    label,
    error,
    className,
    style,
}: CheckboxGroupProps) {
    const handleToggle = (value: string) => {
        if (values.includes(value)) {
            onValuesChange(values.filter((v) => v !== value));
        } else {
            onValuesChange([...values, value]);
        }
    };

    return (
        <View className={cn("w-full mb-3", className)} style={style}>
            {label && (
                <Text className="text-xs font-medium text-foreground-muted mb-2 ml-1">
                    {label}
                </Text>
            )}

            {options.map((option) => (
                <CheckboxCard
                    key={option.value}
                    option={option}
                    isSelected={values.includes(option.value)}
                    onToggle={handleToggle}
                    checkboxPosition={checkboxPosition}
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

// controlled multi-select group

export interface ControlledCheckboxGroupProps<
    T extends FieldValues,
> extends UseControllerProps<T> {
    options: CheckboxOption[];
    checkboxPosition?: "left" | "right";
    label?: string;
    className?: string;
}
export function ControlledCheckboxGroup<T extends FieldValues>({
    control,
    name,
    options,
    checkboxPosition,
    label,
    className,
}: ControlledCheckboxGroupProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <CheckboxGroup
                    options={options}
                    values={Array.isArray(value) ? value : []}
                    onValuesChange={onChange}
                    checkboxPosition={checkboxPosition}
                    label={label}
                    error={error?.message}
                    className={className}
                />
            )}
        />
    );
}
