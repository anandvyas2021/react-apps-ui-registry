import React, { useEffect, useState, forwardRef } from "react";
import { Pressable, View, Text, ViewStyle } from "react-native";
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
import { cn, type IconName } from "@/lib/utils";

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
    className?: string;
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
            className,
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
                className={cn(
                    "rounded-full justify-center",
                    disabled ? "opacity-50" : "opacity-100",
                    className,
                )}
                style={[
                    { width: dimensions.trackW, height: dimensions.trackH },
                    style,
                ]}
            >
                <Animated.View
                    style={[trackAnimatedStyle]}
                    className="absolute w-full h-full rounded-full"
                />

                <Animated.View
                    style={[
                        thumbAnimatedStyle,
                        { width: dimensions.thumb, height: dimensions.thumb },
                    ]}
                    className="bg-white rounded-full items-center justify-center shadow-sm"
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
    containerClassName?: string;
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
    containerClassName,
    containerStyle,
    ...switchProps
}: ControlledToggleSwitchProps<T>) {
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
                    <View
                        className={cn("w-full mb-3", containerClassName)}
                        style={containerStyle}
                    >
                        <Pressable
                            disabled={disabled}
                            onPress={() => !disabled && onChange(!value)}
                            className="flex-row items-center justify-between gap-3"
                        >
                            <View className="flex-1">
                                {label && (
                                    <Text className="text-sm font-bold text-foreground">
                                        {label}
                                    </Text>
                                )}
                                {subtitle && (
                                    <Text className="text-xs text-foreground-muted mt-0.5">
                                        {subtitle}
                                    </Text>
                                )}
                            </View>
                            {switchElement}
                        </Pressable>

                        {error?.message && (
                            <Text className="mt-1 text-xs text-destructive">
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
