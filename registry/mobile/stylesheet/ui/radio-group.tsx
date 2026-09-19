import React, { useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
} from "react-native";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";
import type { IconName } from "@/lib/utils";

export type RadioIconVariant =
    | "default"
    | "primary"
    | "secondary"
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

export interface RadioCardProps {
    option: RadioOption;
    isSelected: boolean;
    onSelect: (value: string) => void;
    radioPosition?: "left" | "right";
    style?: ViewStyle;
}

export function RadioCard({
    option,
    isSelected,
    onSelect,
    radioPosition = "right",
    style,
}: RadioCardProps) {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const handlePress = () => {
        if (option.disabled) return;
        onSelect(option.value);
    };

    const RadioCircle = (
        <View
            style={[
                styles.radioCircle,
                isSelected
                    ? styles.radioCircleSelected
                    : styles.radioCircleUnselected,
                option.disabled && styles.disabledOpacity,
            ]}
        >
            {isSelected && <View style={styles.radioInnerCircle} />}
        </View>
    );

    const activeVariant = option?.iconOptions?.variant || "default";
    const variantStyles = {
        default: { bg: theme.surfaceMuted, text: theme.foreground },
        primary: { bg: `${theme.primary}1A`, text: theme.primary },
        secondary: { bg: theme.secondary, text: theme.secondaryForeground },
        destructive: { bg: `${theme.destructive}1A`, text: theme.destructive },
    };

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={handlePress}
            disabled={option.disabled}
            style={[
                styles.card,
                isSelected ? styles.cardSelected : styles.cardUnselected,
                option.disabled && styles.disabledOpacity,
                style,
            ]}
        >
            {option.cornerBadge && (
                <View style={styles.cornerBadgeContainer}>
                    <Text style={styles.cornerBadgeText}>
                        {option.cornerBadge}
                    </Text>
                </View>
            )}

            <View style={styles.leftZone}>
                {radioPosition === "left" && (
                    <View style={styles.leftRadio}>{RadioCircle}</View>
                )}

                {option.iconOptions?.icon && (
                    <View
                        style={[
                            styles.iconContainer,
                            {
                                backgroundColor:
                                    variantStyles[activeVariant].bg,
                            },
                        ]}
                    >
                        <DynamicIcon
                            name={option.iconOptions.icon as string}
                            size={20}
                            color={variantStyles[activeVariant].text}
                        />
                    </View>
                )}

                <View style={styles.titleContainer}>
                    <View style={styles.titleRow}>
                        <Text style={styles.titleText} numberOfLines={1}>
                            {option.title}
                        </Text>
                        {option.badge && (
                            <View style={styles.inlineBadge}>
                                <Text style={styles.inlineBadgeText}>
                                    {option.badge}
                                </Text>
                            </View>
                        )}
                    </View>
                    {option.subtitle && (
                        <Text style={styles.subtitleText} numberOfLines={1}>
                            {option.subtitle}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.rightZone}>
                {(option.rightBlock?.label || option.rightBlock?.suffix) && (
                    <View style={styles.rightBlockContainer}>
                        <Text
                            style={[
                                styles.rightBlockLabel,
                                isSelected && styles.rightBlockLabelSelected,
                            ]}
                        >
                            {option.rightBlock.label}
                            {option.rightBlock.suffix && (
                                <Text style={styles.rightBlockSuffix}>
                                    {" "}
                                    {option.rightBlock.suffix}
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

export interface RadioGroupProps {
    options: RadioOption[];
    value: string;
    onValueChange: (value: string) => void;
    radioPosition?: "left" | "right";
    label?: string;
    error?: string;
    style?: ViewStyle;
}

export function RadioGroup({
    options,
    value,
    onValueChange,
    radioPosition = "right",
    label,
    error,
    style,
}: RadioGroupProps) {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={[styles.groupContainer, style]}>
            {label && <Text style={styles.groupLabel}>{label}</Text>}
            {options.map((option) => (
                <RadioCard
                    key={option.value}
                    option={option}
                    isSelected={value === option.value}
                    onSelect={onValueChange}
                    radioPosition={radioPosition}
                />
            ))}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

export interface ControlledRadioGroupProps<
    T extends FieldValues,
> extends UseControllerProps<T> {
    options: RadioOption[];
    radioPosition?: "left" | "right";
    label?: string;
}

export function ControlledRadioGroup<T extends FieldValues>({
    control,
    name,
    options,
    radioPosition,
    label,
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
                />
            )}
        />
    );
}

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        groupContainer: {
            width: "100%",
            marginBottom: 12,
        },
        groupLabel: {
            fontSize: 12,
            fontWeight: "500",
            color: theme.foregroundMuted,
            marginBottom: 8,
            marginLeft: 4,
        },
        card: {
            position: "relative",
            width: "100%",
            minHeight: 70,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            marginBottom: 12,
            borderRadius: 16,
            borderWidth: 1,
        },
        cardUnselected: {
            backgroundColor: theme.surface,
            borderColor: theme.border,
        },
        cardSelected: {
            backgroundColor: `${theme.primary}0D`, // 5% Opacity
            borderColor: theme.primary,
        },
        disabledOpacity: {
            opacity: 0.5,
        },
        cornerBadgeContainer: {
            position: "absolute",
            top: -12,
            right: 16,
            backgroundColor: theme.foreground,
            paddingHorizontal: 10,
            paddingVertical: 2,
            borderRadius: 9999,
            zIndex: 10,
        },
        cornerBadgeText: {
            fontSize: 10,
            fontWeight: "900",
            color: theme.background,
        },
        leftZone: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            marginRight: 12,
        },
        leftRadio: {
            marginRight: 14,
        },
        iconContainer: {
            height: 40,
            width: 36,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 14,
            borderRadius: 8,
        },
        titleContainer: {
            flex: 1,
            justifyContent: "center",
        },
        titleRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
        },
        titleText: {
            fontSize: 14,
            fontWeight: "700",
            color: theme.foreground,
        },
        inlineBadge: {
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 6,
            backgroundColor: `${theme.primary}1A`,
        },
        inlineBadgeText: {
            fontSize: 10,
            fontWeight: "700",
            color: theme.primary,
        },
        subtitleText: {
            fontSize: 12,
            color: theme.foregroundMuted,
            marginTop: 2,
        },
        rightZone: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        },
        rightBlockContainer: {
            alignItems: "flex-end",
        },
        rightBlockLabel: {
            fontSize: 12,
            fontWeight: "700",
            color: theme.foreground,
            letterSpacing: -0.2,
        },
        rightBlockLabelSelected: {
            color: theme.primary,
        },
        rightBlockSuffix: {
            fontSize: 12,
            fontWeight: "600",
            color: theme.foregroundMuted,
        },
        radioCircle: {
            height: 20,
            width: 20,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            borderWidth: 3,
        },
        radioCircleUnselected: {
            borderColor: theme.border,
            backgroundColor: "transparent",
        },
        radioCircleSelected: {
            borderColor: theme.primary,
            backgroundColor: theme.primary,
        },
        radioInnerCircle: {
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: "#FFFFFF",
        },
        errorText: {
            fontSize: 12,
            color: theme.destructive,
            marginTop: 4,
            marginLeft: 4,
            fontWeight: "500",
        },
    });
