import React, { useState, useCallback, useEffect } from "react";
import {
    View,
    Text,
    Pressable,
    LayoutChangeEvent,
    ViewStyle,
} from "react-native";
import {
    Controller,
    type FieldValues,
    type UseControllerProps,
} from "react-hook-form";
import Animated, {
    withSpring,
    withTiming,
    useSharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn, type IconName } from "@/lib/utils";

const INDICATOR_SPRING = {
    damping: 24,
    stiffness: 300,
    mass: 0.6,
    overshootClamping: true,
};

export interface SegmentedOption<T extends string = string> {
    label: string;
    value: T;
    icon?: IconName | string;
}

export interface SegmentedControlProps<T extends string = string> {
    options: SegmentedOption<T>[];
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
    label?: string;
    className?: string;
    style?: ViewStyle;
    size?: "sm" | "md" | "lg";
    error?: string;
    disabled?: boolean;
}

export function SegmentedControl<T extends string = string>({
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    label,
    className,
    style,
    size = "md",
    error,
    disabled = false,
}: SegmentedControlProps<T>) {
    const [internalValue, setInternalValue] = useState<T>(
        defaultValue ?? options[0]?.value,
    );

    const isControlled = controlledValue !== undefined;
    const activeValue = isControlled ? controlledValue : internalValue;

    const [containerWidth, setContainerWidth] = useState(0);

    const activeIndex = Math.max(
        0,
        options.findIndex((option) => option.value === activeValue),
    );

    const translateX = useSharedValue(0);
    const indicatorWidth = useSharedValue(0);
    const indicatorOpacity = useSharedValue(0);

    const handleContainerLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const { width } = event.nativeEvent.layout;
            if (width !== containerWidth) {
                setContainerWidth(width);
            }
        },
        [containerWidth],
    );

    useEffect(() => {
        if (containerWidth > 0 && options?.length > 0) {
            const segmentWidth = containerWidth / options.length;
            const targetX = activeIndex * segmentWidth;

            indicatorWidth.value = withSpring(segmentWidth, INDICATOR_SPRING);
            translateX.value = withSpring(targetX, INDICATOR_SPRING);
            indicatorOpacity.value = withTiming(1, { duration: 150 });
        }
    }, [
        containerWidth,
        activeIndex,
        options,
        indicatorWidth,
        translateX,
        indicatorOpacity,
    ]);

    const animatedPillStyle = useAnimatedStyle(() => ({
        width: indicatorWidth.value,
        opacity: indicatorOpacity.value,
        transform: [{ translateX: translateX.value }],
    }));

    const handleSelect = (val: T) => {
        if (disabled || val === activeValue) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (!isControlled) {
            setInternalValue(val);
        }
        onChange?.(val);
    };

    return (
        <View className={cn("w-full mb-4", className)} style={style}>
            {label && (
                <Text className="text-xs font-medium text-foreground-muted mb-2">
                    {label}
                </Text>
            )}

            <View
                className={cn(
                    "w-full rounded-2xl p-1 border bg-surface-muted",
                    error ? "border-destructive" : "border-border",
                    disabled && "opacity-50",
                )}
            >
                <View
                    onLayout={handleContainerLayout}
                    className="relative flex-row items-center"
                >
                    <Animated.View
                        pointerEvents="none"
                        style={animatedPillStyle}
                        className="absolute top-0 bottom-0 left-0 rounded-xl border border-border/40 bg-surface shadow-sm"
                    />

                    {options?.map((option) => {
                        const isSelected = option?.value === activeValue;

                        return (
                            <Pressable
                                key={option?.value}
                                onPress={() => handleSelect(option?.value)}
                                disabled={disabled}
                                className={cn(
                                    "flex-1 flex-row items-center justify-center gap-2 z-10",
                                    size === "sm" && "px-2 py-1.5",
                                    size === "md" && "px-3 py-2",
                                    size === "lg" && "px-4 py-3",
                                )}
                            >
                                {option?.icon && (
                                    <DynamicIcon
                                        name={option.icon as string}
                                        size={
                                            size === "sm"
                                                ? 14
                                                : size === "lg"
                                                  ? 18
                                                  : 16
                                        }
                                        strokeWidth={2.5}
                                        className={cn(
                                            isSelected
                                                ? "text-foreground"
                                                : "text-foreground-muted",
                                        )}
                                    />
                                )}
                                <Text
                                    className={cn(
                                        "font-semibold tracking-tight transition-colors",
                                        size === "sm" && "text-[11px]",
                                        size === "md" && "text-xs",
                                        size === "lg" && "text-sm",
                                        isSelected
                                            ? "text-foreground font-bold"
                                            : "text-foreground-muted",
                                    )}
                                    numberOfLines={1}
                                >
                                    {option?.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            {error && (
                <Text className="text-xs mt-1.5 font-medium text-destructive ml-1">
                    {error}
                </Text>
            )}
        </View>
    );
}

export interface ControlledSegmentedControlProps<
    T extends FieldValues,
    V extends string = string,
> extends UseControllerProps<T> {
    label?: string;
    options: SegmentedOption<V>[];
    size?: "sm" | "md" | "lg";
    className?: string;
    style?: ViewStyle;
}

export function ControlledSegmentedControl<
    T extends FieldValues,
    V extends string = string,
>({
    control,
    name,
    options,
    label,
    size,
    disabled,
    className,
    style,
}: ControlledSegmentedControlProps<T, V>) {
    return (
        <Controller
            control={control}
            name={name}
            disabled={disabled}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <SegmentedControl
                    options={options}
                    value={value as V}
                    onChange={onChange}
                    label={label}
                    size={size}
                    error={error?.message}
                    disabled={disabled}
                    className={className}
                    style={style}
                />
            )}
        />
    );
}
