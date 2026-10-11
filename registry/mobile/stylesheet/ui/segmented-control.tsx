import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
    View,
    Text,
    Pressable,
    LayoutChangeEvent,
    StyleSheet,
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

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";
import type { IconName } from "@/lib/utils";

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
    size?: "sm" | "md" | "lg";
    error?: string;
    disabled?: boolean;
    style?: ViewStyle;
}

export function SegmentedControl<T extends string = string>({
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    label,
    size = "md",
    error,
    disabled = false,
    style,
}: SegmentedControlProps<T>) {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

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
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.track,
                    error && styles.trackError,
                    disabled && styles.disabled,
                ]}
            >
                <View
                    onLayout={handleContainerLayout}
                    style={styles.segmentsRow}
                >
                    <Animated.View
                        pointerEvents="none"
                        style={[styles.indicatorPill, animatedPillStyle]}
                    />

                    {options?.map((option) => {
                        const isSelected = option?.value === activeValue;
                        const iconColor = isSelected
                            ? theme.foreground
                            : theme.foregroundMuted;

                        return (
                            <Pressable
                                key={option?.value}
                                onPress={() => handleSelect(option?.value)}
                                disabled={disabled}
                                style={[
                                    styles.segmentButton,
                                    styles[`segment_${size}`],
                                ]}
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
                                        color={iconColor}
                                    />
                                )}
                                <Text
                                    style={[
                                        styles.labelText,
                                        styles[`text_${size}`],
                                        isSelected
                                            ? styles.textSelected
                                            : styles.textUnselected,
                                    ]}
                                    numberOfLines={1}
                                >
                                    {option?.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
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
                    style={style}
                />
            )}
        />
    );
}

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            width: "100%",
            marginBottom: 16,
        },
        label: {
            fontSize: 12,
            fontWeight: "500",
            color: theme.foregroundMuted,
            marginBottom: 8,
        },
        track: {
            width: "100%",
            borderRadius: 16,
            padding: 4,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.surfaceMuted,
        },
        trackError: {
            borderColor: theme.destructive,
        },
        disabled: {
            opacity: 0.5,
        },
        segmentsRow: {
            position: "relative",
            flexDirection: "row",
            alignItems: "center",
        },
        indicatorPill: {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.surface,
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
        },
        segmentButton: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            zIndex: 10,
        },
        segment_sm: {
            paddingHorizontal: 8,
            paddingVertical: 6,
        },
        segment_md: {
            paddingHorizontal: 12,
            paddingVertical: 8,
        },
        segment_lg: {
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        labelText: {
            letterSpacing: -0.2,
        },
        text_sm: {
            fontSize: 11,
        },
        text_md: {
            fontSize: 12,
        },
        text_lg: {
            fontSize: 14,
        },
        textSelected: {
            color: theme.foreground,
            fontWeight: "700",
        },
        textUnselected: {
            color: theme.foregroundMuted,
            fontWeight: "500",
        },
        errorText: {
            fontSize: 12,
            fontWeight: "500",
            color: theme.destructive,
            marginTop: 6,
            marginLeft: 4,
        },
    });
