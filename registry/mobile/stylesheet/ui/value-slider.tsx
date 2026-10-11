import React, { useMemo } from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    type ViewStyle,
    type TextStyle,
} from "react-native";
import Slider from "@react-native-community/slider";
import {
    Controller,
    type FieldValues,
    type UseControllerProps,
} from "react-hook-form";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export type SliderFlag = string | { label: string; value?: number };

const THUMB_DIMENSIONS = {
    sm: 16,
    md: 22,
    lg: 28,
};

const TRACK_HEIGHTS = {
    sm: 4,
    md: 6,
    lg: 10,
};

export interface ValueSliderProps {
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

    variant?: "primary" | "success" | "warning" | "destructive";
    thumbVariant?: "ring" | "solid";
    size?: "sm" | "md" | "lg";
    thumbSize?: "sm" | "md" | "lg";
    inline?: boolean;
    showValue?: boolean;
    showTicks?: boolean;
    disabled?: boolean;
    haptics?: boolean;
    error?: string;
    style?: ViewStyle;
    labelStyle?: TextStyle;
    valueStyle?: TextStyle;
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
    style,
    labelStyle,
    valueStyle,
}: ValueSliderProps) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const activeThumbSize = thumbSize || size;
    const thumbPixelSize = THUMB_DIMENSIONS[activeThumbSize];
    const thumbRadius = thumbPixelSize / 2;

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

    const variantColorMap = {
        primary: theme.primary,
        success: "#10B981",
        warning: "#F59E0B",
        destructive: theme.destructive,
    };
    const activeColor = variantColorMap[variant];

    const CustomSliderTrack = (
        <View
            style={[
                styles.trackContainer,
                { height: Math.max(thumbPixelSize + 10, 32) },
            ]}
        >
            {/* 1. Background Visual Track */}
            <View
                style={[
                    styles.trackBackground,
                    { height: TRACK_HEIGHTS[size] },
                ]}
            >
                <View
                    style={[
                        styles.trackFill,
                        {
                            width: `${percentage}%`,
                            backgroundColor: activeColor,
                        },
                    ]}
                />
            </View>

            {/* Optional Tick Dots */}
            {showTicks && normalizedFlags.length > 1 && (
                <View pointerEvents="none" style={styles.ticksContainer}>
                    {normalizedFlags.map((_, i) => (
                        <View key={i} style={styles.tickDot} />
                    ))}
                </View>
            )}

            {/* 2. Custom Pointer / Thumb */}
            <View
                pointerEvents="none"
                style={[styles.thumbWrapper, { marginHorizontal: thumbRadius }]}
            >
                <View
                    style={[
                        styles.thumb,
                        {
                            width: thumbPixelSize,
                            height: thumbPixelSize,
                            borderRadius: thumbRadius,
                            left: `${percentage}%`,
                            marginLeft: -thumbRadius,
                            borderColor: activeColor,
                            backgroundColor:
                                thumbVariant === "ring"
                                    ? "#FFFFFF"
                                    : activeColor,
                            borderWidth: thumbVariant === "ring" ? 3 : 0,
                        },
                    ]}
                />
            </View>

            {/* 3. Invisible Native Slider */}
            <Slider
                style={styles.nativeSliderOverlay}
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

    // --- Inline Layout ---
    if (inline) {
        return (
            <View
                style={[styles.container, disabled && styles.disabled, style]}
            >
                {label && (
                    <Text style={[styles.inlineLabel, labelStyle]}>
                        {label}
                    </Text>
                )}
                <View style={styles.inlinePill}>
                    {showValue && (
                        <Text style={[styles.inlineValue, valueStyle]}>
                            {resolvedDisplayValue}
                        </Text>
                    )}
                    {CustomSliderTrack}
                </View>
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        );
    }

    // --- Standard Stacked Layout ---
    const hasHeader = !!label || (showValue && !!resolvedDisplayValue);

    return (
        <View
            style={[
                styles.container,
                styles.stackedMargin,
                disabled && styles.disabled,
                style,
            ]}
        >
            {hasHeader && (
                <View style={styles.headerRow}>
                    {label ? (
                        <Text style={[styles.headerLabel, labelStyle]}>
                            {label}
                        </Text>
                    ) : (
                        <View />
                    )}

                    {showValue && resolvedDisplayValue ? (
                        <Text style={[styles.headerValue, valueStyle]}>
                            {resolvedDisplayValue}
                        </Text>
                    ) : null}
                </View>
            )}

            {CustomSliderTrack}

            {normalizedFlags.length > 0 && (
                <View style={styles.flagsRow}>
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
                                <Text style={styles.flagText}>
                                    {flag.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
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

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            width: "100%",
        },
        stackedMargin: {
            marginBottom: 16,
        },
        disabled: {
            opacity: 0.5,
        },
        headerRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
        },
        headerLabel: {
            fontSize: 14,
            fontWeight: "500",
            color: theme.foreground,
        },
        headerValue: {
            fontSize: 18,
            fontWeight: "700",
            color: theme.foreground,
        },
        inlineLabel: {
            fontSize: 12,
            fontWeight: "600",
            color: theme.foregroundMuted,
            marginBottom: 8,
        },
        inlinePill: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 9999,
            height: 48,
            paddingLeft: 16,
            paddingRight: 12,
            gap: 12,
        },
        inlineValue: {
            fontSize: 14,
            fontWeight: "700",
            color: theme.foreground,
            minWidth: 42,
        },
        trackContainer: {
            position: "relative",
            flex: 1,
            justifyContent: "center",
        },
        trackBackground: {
            width: "100%",
            borderRadius: 9999,
            backgroundColor: theme.border,
            overflow: "hidden",
        },
        trackFill: {
            height: "100%",
            borderRadius: 9999,
        },
        ticksContainer: {
            position: "absolute",
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 4,
        },
        tickDot: {
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.foregroundMuted,
            opacity: 0.4,
        },
        thumbWrapper: {
            position: "absolute",
            left: 0,
            right: 0,
            justifyContent: "center",
        },
        thumb: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 3,
        },
        nativeSliderOverlay: {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: 0.011,
        },
        flagsRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 4,
        },
        flagText: {
            fontSize: 11,
            fontWeight: "500",
            color: theme.foregroundMuted,
        },
        errorText: {
            marginTop: 6,
            paddingHorizontal: 4,
            fontSize: 12,
            color: theme.destructive,
        },
    });
