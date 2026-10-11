import React, { useEffect, useState, forwardRef, useMemo } from "react";
import { Pressable, View, Text, StyleSheet, ViewStyle } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor,
} from "react-native-reanimated";
import {
    Controller,
    type FieldValues,
    type UseControllerProps,
} from "react-hook-form";
import * as Haptics from "expo-haptics";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";
import type { IconName } from "@/lib/utils";

const SWITCH_SIZES = {
    sm: {
        trackW: 36,
        trackH: 20,
        thumb: 16,
        transOn: 18,
        transOff: 2,
        iconSize: 10,
    },
    default: {
        trackW: 44,
        trackH: 24,
        thumb: 20,
        transOn: 22,
        transOff: 2,
        iconSize: 12,
    },
    lg: {
        trackW: 52,
        trackH: 28,
        thumb: 24,
        transOn: 26,
        transOff: 2,
        iconSize: 16,
    },
};

export interface ToggleSwitchProps {
    value?: boolean;
    defaultValue?: boolean;
    onValueChange?: (value: boolean) => void;
    size?: "sm" | "default" | "lg";
    customIcons?: {
        iconOn?: IconName;
        iconOff?: IconName;
    };
    showIcons?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    activeColor?: string;
    inactiveColor?: string;
}

export const ToggleSwitch = forwardRef<
    React.ElementRef<typeof View>,
    ToggleSwitchProps
>(
    (
        {
            value,
            defaultValue = false,
            onValueChange,
            size = "default",
            customIcons = { iconOn: "Check", iconOff: "X" },
            showIcons = true,
            disabled = false,
            style,
            activeColor = "#5f84e0",
            inactiveColor = "#D1D5DB",
        },
        ref,
    ) => {
        const isControlled = value !== undefined;
        const [internalValue, setInternalValue] = useState(defaultValue);
        const isOn = isControlled ? value : internalValue;

        const dimensions = SWITCH_SIZES[size];

        const translateX = useSharedValue(
            isOn ? dimensions.transOn : dimensions.transOff,
        );
        const progress = useSharedValue(isOn ? 1 : 0);

        useEffect(() => {
            translateX.value = withSpring(
                isOn ? dimensions.transOn : dimensions.transOff,
                {
                    damping: 20,
                    stiffness: 250,
                    mass: 0.5,
                },
            );
            progress.value = withTiming(isOn ? 1 : 0, { duration: 200 });
        }, [isOn, dimensions, translateX, progress]);

        const handlePress = () => {
            if (disabled) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const nextValue = !isOn;

            if (!isControlled) {
                setInternalValue(nextValue);
            }
            onValueChange?.(nextValue);
        };

        const trackAnimatedStyle = useAnimatedStyle(() => {
            const backgroundColor = interpolateColor(
                progress.value,
                [0, 1],
                [inactiveColor, activeColor],
            );
            return { backgroundColor };
        });

        const thumbAnimatedStyle = useAnimatedStyle(() => {
            return {
                transform: [{ translateX: translateX.value }],
            };
        });

        const iconOn = customIcons?.iconOn ?? "Check";
        const iconOff = customIcons?.iconOff ?? "X";

        return (
            <Pressable
                ref={ref}
                onPress={handlePress}
                disabled={disabled}
                style={[
                    styles.trackPressable,
                    { width: dimensions.trackW, height: dimensions.trackH },
                    disabled && styles.disabledTrack,
                    style,
                ]}
            >
                <Animated.View
                    style={[styles.trackBackground, trackAnimatedStyle]}
                />

                <Animated.View
                    style={[
                        styles.thumb,
                        thumbAnimatedStyle,
                        { width: dimensions.thumb, height: dimensions.thumb },
                    ]}
                >
                    {showIcons &&
                        (isOn ? (
                            <DynamicIcon
                                name={iconOn as string}
                                size={dimensions.iconSize}
                                color={activeColor}
                            />
                        ) : (
                            <DynamicIcon
                                name={iconOff as string}
                                size={dimensions.iconSize}
                                color={inactiveColor}
                            />
                        ))}
                </Animated.View>
            </Pressable>
        );
    },
);
ToggleSwitch.displayName = "ToggleSwitch";

export interface ControlledToggleSwitchProps<T extends FieldValues>
    extends
        UseControllerProps<T>,
        Omit<ToggleSwitchProps, "value" | "defaultValue" | "onValueChange"> {
    label?: string;
    subtitle?: string;
    containerStyle?: ViewStyle;
}

export function ControlledToggleSwitch<T extends FieldValues>({
    control,
    name,
    rules,
    defaultValue,
    disabled,
    label,
    subtitle,
    containerStyle,
    ...switchProps
}: ControlledToggleSwitchProps<T>) {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            defaultValue={defaultValue}
            disabled={disabled}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
                const switchElement = (
                    <ToggleSwitch
                        value={Boolean(value)}
                        onValueChange={onChange}
                        disabled={disabled}
                        {...switchProps}
                    />
                );

                if (!label && !subtitle && !error) {
                    return switchElement;
                }

                return (
                    <View style={[styles.container, containerStyle]}>
                        <Pressable
                            disabled={disabled}
                            onPress={() => !disabled && onChange(!value)}
                            style={styles.pressableRow}
                        >
                            <View style={styles.textContainer}>
                                {label && (
                                    <Text style={styles.label}>{label}</Text>
                                )}
                                {subtitle && (
                                    <Text style={styles.subtitle}>
                                        {subtitle}
                                    </Text>
                                )}
                            </View>
                            {switchElement}
                        </Pressable>

                        {error?.message && (
                            <Text style={styles.errorText}>
                                {error.message}
                            </Text>
                        )}
                    </View>
                );
            }}
        />
    );
}
ControlledToggleSwitch.displayName = "ControlledToggleSwitch";

const styles = StyleSheet.create({
    trackPressable: {
        borderRadius: 9999,
        justifyContent: "center",
    },
    disabledTrack: {
        opacity: 0.5,
    },
    trackBackground: {
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: 9999,
    },
    thumb: {
        backgroundColor: "#FFFFFF",
        borderRadius: 9999,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 2,
    },
});

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            width: "100%",
            marginBottom: 12,
        },
        pressableRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
        },
        textContainer: {
            flex: 1,
        },
        label: {
            fontSize: 14,
            fontWeight: "700",
            color: theme.foreground,
        },
        subtitle: {
            fontSize: 12,
            color: theme.foregroundMuted,
            marginTop: 2,
        },
        errorText: {
            fontSize: 12,
            color: theme.destructive,
            marginTop: 4,
        },
    });
