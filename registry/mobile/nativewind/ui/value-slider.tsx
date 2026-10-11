import React, { useMemo } from "react";
import { View, Text, Pressable, type ViewStyle } from "react-native";
import Slider from "@react-native-community/slider";
import {
    Controller,
    type FieldValues,
    type UseControllerProps,
} from "react-hook-form";
import { cva, type VariantProps } from "class-variance-authority";
import * as Haptics from "expo-haptics";

import { cn } from "@/lib/utils";

// --- CVA Definitions ---

const trackFillVariants = cva("h-full rounded-full", {
    variants: {
        variant: {
            primary: "bg-primary",
            success: "bg-success",
            warning: "bg-warning",
            destructive: "bg-destructive",
        },
    },
    defaultVariants: {
        variant: "primary",
    },
});

const thumbVariants = cva("rounded-full shadow-md", {
    variants: {
        variant: {
            primary: "border-primary bg-primary",
            success: "border-success bg-success",
            warning: "border-warning bg-warning",
            destructive: "border-destructive bg-destructive",
        },
        thumbVariant: {
            ring: "bg-white border-[3px]",
            solid: "border-0",
        },
    },
    defaultVariants: {
        variant: "primary",
        thumbVariant: "ring",
    },
});

const THUMB_DIMENSIONS = {
    sm: { size: 16, className: "w-4 h-4" },
    md: { size: 22, className: "w-[22px] h-[22px]" },
    lg: { size: 28, className: "w-7 h-7" },
};

const TRACK_HEIGHTS = {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2.5",
};

export type SliderFlag = string | { label: string; value?: number };

export interface ValueSliderProps extends VariantProps<typeof thumbVariants> {
    label?: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onValueChange: (value: number) => void;
    onSlidingComplete?: (value: number) => void;
    valueDisplay?: string;
    formatValue?: (value: number) => string;

    minLabel?: string;
    maxLabel?: string;
    flags?: SliderFlag[];

    size?: "sm" | "md" | "lg";
    thumbSize?: "sm" | "md" | "lg";
    inline?: boolean;
    showValue?: boolean;
    showTicks?: boolean;
    disabled?: boolean;
    haptics?: boolean;
    error?: string;
    className?: string;
    style?: ViewStyle;
    labelClassName?: string;
    valueClassName?: string;
}

export const ValueSlider = ({
    label,
    value = 0,
    min = 0,
    max = 100,
    step = 1,
    onValueChange,
    onSlidingComplete,
    valueDisplay,
    formatValue,
    minLabel,
    maxLabel,
    flags,
    variant = "primary",
    thumbVariant = "ring",
    size = "md",
    thumbSize,
    inline = false,
    showValue = true,
    showTicks = false,
    disabled = false,
    haptics = false,
    error,
    className,
    style,
    labelClassName,
    valueClassName,
}: ValueSliderProps) => {
    const activeThumbSize = thumbSize || size;
    const thumbConfig = THUMB_DIMENSIONS[activeThumbSize];
    const thumbRadius = thumbConfig.size / 2;

    const percentage = useMemo(() => {
        if (max <= min) return 0;
        const clamped = Math.min(Math.max(value, min), max);
        return ((clamped - min) / (max - min)) * 100;
    }, [value, min, max]);

    const resolvedDisplayValue = useMemo(() => {
        if (!showValue) return "";
        if (valueDisplay !== undefined) return valueDisplay;
        if (formatValue) return formatValue(value);
        return String(value);
    }, [showValue, valueDisplay, formatValue, value]);

    const normalizedFlags = useMemo(() => {
        if (flags && flags.length > 0) {
            return flags.map((flag, idx) => {
                if (typeof flag === "string") {
                    const inferredValue =
                        flags.length > 1
                            ? min + (idx / (flags.length - 1)) * (max - min)
                            : min;
                    return { label: flag, value: inferredValue };
                }
                return flag;
            });
        }
        if (minLabel || maxLabel) {
            return [
                { label: minLabel ?? "", value: min },
                { label: maxLabel ?? "", value: max },
            ];
        }
        return [];
    }, [flags, minLabel, maxLabel, min, max]);

    const handleValueChange = (val: number) => {
        if (disabled) return;
        if (haptics && val !== value) {
            Haptics.selectionAsync();
        }
        onValueChange(val);
    };

    const CustomSliderTrack = (
        <View
            className="relative flex-1 justify-center"
            style={{ height: Math.max(thumbConfig.size + 10, 32) }}
        >
            {/* 1. Background Visual Track */}
            <View
                className={cn(
                    "w-full rounded-full bg-border overflow-hidden",
                    TRACK_HEIGHTS[size],
                )}
            >
                {/* Filled Active Track */}
                <View
                    className={trackFillVariants({ variant })}
                    style={{ width: `${percentage}%` }}
                />
            </View>

            {/* Optional Tick Dots along the track */}
            {showTicks && normalizedFlags.length > 1 && (
                <View
                    pointerEvents="none"
                    className="absolute left-0 right-0 flex-row justify-between items-center px-1"
                >
                    {normalizedFlags.map((_, i) => (
                        <View
                            key={i}
                            className="w-1 h-1 rounded-full bg-foreground-muted/40"
                        />
                    ))}
                </View>
            )}

            {/* 2. Custom Pointer / Thumb */}
            <View
                pointerEvents="none"
                className="absolute left-0 right-0 justify-center"
                style={{ marginHorizontal: thumbRadius }}
            >
                <View
                    className={cn(
                        thumbVariants({ variant, thumbVariant }),
                        thumbConfig.className,
                    )}
                    style={{
                        left: `${percentage}%`,
                        marginLeft: -thumbRadius,
                    }}
                />
            </View>

            {/* 3. Invisible Native Slider */}
            <Slider
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    opacity: 0.011,
                }}
                minimumValue={min}
                maximumValue={max}
                step={step}
                value={value}
                disabled={disabled}
                onValueChange={handleValueChange}
                onSlidingComplete={onSlidingComplete}
            />
        </View>
    );

    // --- Inline Pill Layout ---
    if (inline) {
        return (
            <View
                className={cn("w-full", disabled && "opacity-50", className)}
                style={style}
            >
                {label && (
                    <Text
                        className={cn(
                            "text-xs font-semibold text-foreground-muted mb-2",
                            labelClassName,
                        )}
                    >
                        {label}
                    </Text>
                )}
                <View className="flex-row items-center bg-surface border border-border rounded-full h-12 pl-4 pr-3 gap-3">
                    {showValue && (
                        <Text
                            className={cn(
                                "text-sm font-bold text-foreground min-w-[42px]",
                                valueClassName,
                            )}
                        >
                            {resolvedDisplayValue}
                        </Text>
                    )}
                    {CustomSliderTrack}
                </View>
                {error && (
                    <Text className="mt-1.5 px-1 text-xs text-destructive">
                        {error}
                    </Text>
                )}
            </View>
        );
    }

    // --- Standard Stacked Layout ---
    const hasHeader = !!label || (showValue && !!resolvedDisplayValue);

    return (
        <View
            className={cn("w-full mb-4", disabled && "opacity-50", className)}
            style={style}
        >
            {hasHeader && (
                <View className="flex-row justify-between items-center mb-2">
                    {label ? (
                        <Text
                            className={cn(
                                "text-sm font-medium text-foreground",
                                labelClassName,
                            )}
                        >
                            {label}
                        </Text>
                    ) : (
                        <View />
                    )}

                    {showValue && resolvedDisplayValue ? (
                        <Text
                            className={cn(
                                "text-lg font-bold text-foreground",
                                valueClassName,
                            )}
                        >
                            {resolvedDisplayValue}
                        </Text>
                    ) : null}
                </View>
            )}

            {CustomSliderTrack}

            {normalizedFlags.length > 0 && (
                <View className="flex-row justify-between items-center mt-0.5">
                    {normalizedFlags.map((flag, index) => {
                        const isClickable =
                            flag.value !== undefined && !disabled;

                        return (
                            <Pressable
                                key={index}
                                disabled={!isClickable}
                                onPress={() => {
                                    if (flag.value !== undefined) {
                                        handleValueChange(
                                            Math.round(flag.value / step) *
                                                step,
                                        );
                                    }
                                }}
                            >
                                <Text className="text-[11px] font-medium text-foreground-muted">
                                    {flag.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            )}

            {error && (
                <Text className="mt-1.5 px-1 text-xs text-destructive">
                    {error}
                </Text>
            )}
        </View>
    );
};
ValueSlider.displayName = "ValueSlider";

// --- Controlled Version ---

export interface ControlledValueSliderProps<T extends FieldValues>
    extends
        UseControllerProps<T>,
        Omit<ValueSliderProps, "value" | "onValueChange"> {}

export function ControlledValueSlider<T extends FieldValues>({
    control,
    name,
    rules,
    defaultValue,
    disabled,
    ...sliderProps
}: ControlledValueSliderProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            defaultValue={defaultValue}
            disabled={disabled}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ValueSlider
                    value={Number(value) || sliderProps.min}
                    onValueChange={onChange}
                    disabled={disabled}
                    error={error?.message}
                    {...sliderProps}
                />
            )}
        />
    );
}
ControlledValueSlider.displayName = "ControlledValueSlider";
