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

import type { IconName } from "@/lib/utils";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

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
    style?: ViewStyle;
}

export function CheckboxCard({
    option,
    isSelected,
    onToggle,
    checkboxPosition = "right",
    style,
}: CheckboxCardProps) {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const handlePress = () => {
        if (option?.disabled) return;
        onToggle(option?.value);
    };

    const CheckboxSquare = (
        <View
            style={[
                styles.square,
                isSelected ? styles.squareSelected : styles.squareUnselected,
                option?.disabled && styles.disabledOpacity,
            ]}
        >
            {isSelected && (
                <DynamicIcon
                    name="Check"
                    size={14}
                    strokeWidth={3}
                    color={theme.primaryForeground}
                />
            )}
        </View>
    );

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={handlePress}
            disabled={option?.disabled}
            style={[
                styles.card,
                isSelected ? styles.cardSelected : styles.cardUnselected,
                option?.disabled && styles.disabledOpacity,
                style,
            ]}
        >
            {option?.cornerBadge && (
                <View style={styles.cornerBadge}>
                    <Text style={styles.cornerBadgeText}>
                        {option?.cornerBadge}
                    </Text>
                </View>
            )}

            <View style={styles.leftZone}>
                {checkboxPosition === "left" && (
                    <View style={styles.leftCheckbox}>{CheckboxSquare}</View>
                )}

                {option?.icon && (
                    <View
                        style={[
                            styles.iconContainer,
                            isSelected
                                ? styles.iconContainerSelected
                                : styles.iconContainerUnselected,
                        ]}
                    >
                        <DynamicIcon
                            name={option?.icon as string}
                            size={20}
                            color={
                                isSelected
                                    ? theme.primary
                                    : theme.foregroundMuted
                            }
                        />
                    </View>
                )}

                <View style={styles.titleContainer}>
                    <View style={styles.titleRow}>
                        <Text
                            style={[
                                styles.titleText,
                                isSelected && styles.titleTextSelected,
                            ]}
                            numberOfLines={1}
                        >
                            {option?.title}
                        </Text>
                        {option?.badge && (
                            <View style={styles.inlineBadge}>
                                <Text style={styles.inlineBadgeText}>
                                    {option?.badge}
                                </Text>
                            </View>
                        )}
                    </View>
                    {option?.subtitle && (
                        <Text style={styles.subtitleText} numberOfLines={1}>
                            {option?.subtitle}
                        </Text>
                    )}
                </View>
            </View>

            {checkboxPosition === "right" && CheckboxSquare}
        </TouchableOpacity>
    );
}

export interface CheckboxProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    style?: ViewStyle;
}

export function Checkbox({
    checked,
    onCheckedChange,
    label,
    description,
    disabled = false,
    style,
}: CheckboxProps) {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const handlePress = () => {
        if (disabled) return;
        onCheckedChange(!checked);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={handlePress}
            disabled={disabled}
            style={[
                styles.simpleCheckboxContainer,
                disabled && styles.disabledOpacity,
                style,
            ]}
        >
            <View
                style={[
                    styles.square,
                    checked ? styles.squareSelected : styles.squareUnselected,
                ]}
            >
                {checked && (
                    <DynamicIcon
                        name="Check"
                        size={14}
                        strokeWidth={3}
                        color={theme.primaryForeground}
                    />
                )}
            </View>

            {(label || description) && (
                <View style={styles.simpleTextContainer}>
                    {label && <Text style={styles.simpleLabel}>{label}</Text>}
                    {description && (
                        <Text style={styles.simpleDescription}>
                            {description}
                        </Text>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
}

export interface CheckboxGroupProps {
    options: CheckboxOption[];
    values: string[];
    onValuesChange: (values: string[]) => void;
    checkboxPosition?: "left" | "right";
    label?: string;
    error?: string;
    style?: ViewStyle;
}

export function CheckboxGroup({
    options,
    values = [],
    onValuesChange,
    checkboxPosition = "right",
    label,
    error,
    style,
}: CheckboxGroupProps) {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const handleToggle = (value: string) => {
        if (values.includes(value)) {
            onValuesChange(values.filter((v) => v !== value));
        } else {
            onValuesChange([...values, value]);
        }
    };

    return (
        <View style={[styles.groupContainer, style]}>
            {label && <Text style={styles.groupLabel}>{label}</Text>}
            {options?.map((option) => (
                <CheckboxCard
                    key={option?.value}
                    option={option}
                    isSelected={values.includes(option?.value)}
                    onToggle={handleToggle}
                    checkboxPosition={checkboxPosition}
                />
            ))}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

export interface ControlledCheckboxGroupProps<
    T extends FieldValues,
> extends UseControllerProps<T> {
    options: CheckboxOption[];
    checkboxPosition?: "left" | "right";
    label?: string;
}

export function ControlledCheckboxGroup<T extends FieldValues>({
    control,
    name,
    options,
    checkboxPosition,
    label,
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
            minHeight: 60,
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
        cornerBadge: {
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
        leftCheckbox: {
            marginRight: 14,
        },
        iconContainer: {
            height: 44,
            width: 44,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 14,
            borderRadius: 12,
        },
        iconContainerSelected: {
            backgroundColor: `${theme.primary}1A`,
        },
        iconContainerUnselected: {
            backgroundColor: theme.surfaceMuted,
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
        titleTextSelected: {
            color: theme.primary,
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
        square: {
            height: 20,
            width: 20,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
            borderWidth: 2,
        },
        squareUnselected: {
            borderColor: theme.border,
            backgroundColor: "transparent",
        },
        squareSelected: {
            borderColor: theme.primary,
            backgroundColor: theme.primary,
        },
        simpleCheckboxContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingVertical: 8,
        },
        simpleTextContainer: {
            flex: 1,
            justifyContent: "center",
        },
        simpleLabel: {
            fontSize: 14,
            fontWeight: "600",
            color: theme.foreground,
        },
        simpleDescription: {
            fontSize: 12,
            color: theme.foregroundMuted,
            marginTop: 2,
        },
        errorText: {
            fontSize: 12,
            color: theme.destructive,
            marginTop: 4,
            marginLeft: 4,
            fontWeight: "500",
        },
    });
