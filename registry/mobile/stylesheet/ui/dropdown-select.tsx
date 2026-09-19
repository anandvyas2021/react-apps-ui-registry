import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ViewStyle,
} from "react-native";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface DropdownOption {
    label: string;
    value: string;
}

export interface DropdownSelectProps {
    label?: string;
    options: DropdownOption[];
    selectedValue: string;
    onSelect: (value: string) => void;
    error?: string;
    placeholder?: string;
    style?: ViewStyle;
    zIndex?: number;
}

export function DropdownSelect({
    label,
    options,
    selectedValue,
    onSelect,
    error,
    placeholder = "Select an option",
    style,
    zIndex = 10,
}: DropdownSelectProps) {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (val: string) => {
        onSelect(val);
        setIsOpen(false);
    };

    const selectedLabel = useMemo(() => {
        const selected = options.find((opt) => opt.value === selectedValue);
        return selected ? selected.label : "";
    }, [selectedValue, options]);

    return (
        <View
            style={[
                styles.container,
                { zIndex: isOpen ? zIndex + 50 : zIndex },
                style,
            ]}
        >
            {label && <Text style={styles.label}>{label}</Text>}

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsOpen(!isOpen)}
                style={[
                    styles.triggerButton,
                    isOpen && styles.triggerButtonActive,
                    error && styles.triggerButtonError,
                ]}
            >
                <Text
                    style={[
                        styles.triggerText,
                        !selectedLabel && styles.placeholderText,
                    ]}
                    numberOfLines={1}
                >
                    {selectedLabel || placeholder}
                </Text>
                <DynamicIcon
                    name={isOpen ? "ChevronUp" : "ChevronDown"}
                    size={20}
                    color={theme.foregroundMuted}
                />
            </TouchableOpacity>

            {isOpen && options?.length > 0 && (
                <View style={styles.dropdownMenu}>
                    <ScrollView
                        nestedScrollEnabled
                        bounces={false}
                        style={styles.scrollArea}
                        keyboardShouldPersistTaps="handled"
                    >
                        {options?.map((option, index) => {
                            const isSelected = selectedValue === option.value;
                            return (
                                <TouchableOpacity
                                    key={option.value}
                                    activeOpacity={0.7}
                                    onPress={() => handleSelect(option.value)}
                                    style={[
                                        styles.optionItem,
                                        index !== options.length - 1 &&
                                            styles.optionBorder,
                                        isSelected && styles.optionItemSelected,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            isSelected &&
                                                styles.optionTextSelected,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                    {isSelected && (
                                        <DynamicIcon
                                            name="Check"
                                            size={18}
                                            color={theme.primary}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

export interface ControlledDropdownSelectProps<
    T extends FieldValues,
> extends UseControllerProps<T> {
    label?: string;
    options: DropdownOption[];
    placeholder?: string;
    zIndex?: number;
}

export function ControlledDropdownSelect<T extends FieldValues>({
    control,
    name,
    label,
    options,
    placeholder,
    zIndex,
}: ControlledDropdownSelectProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <DropdownSelect
                    label={label}
                    options={options}
                    selectedValue={value || ""}
                    onSelect={onChange}
                    error={error?.message}
                    placeholder={placeholder}
                    zIndex={zIndex}
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
            position: "relative",
        },
        label: {
            fontSize: 12,
            fontWeight: "500",
            color: theme.foregroundMuted,
            marginBottom: 8,
        },
        triggerButton: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 14,
        },
        triggerButtonActive: {
            borderColor: theme.primary,
        },
        triggerButtonError: {
            borderColor: theme.destructive,
        },
        triggerText: {
            fontSize: 14,
            fontWeight: "500",
            color: theme.foreground,
            flex: 1,
            marginRight: 8,
        },
        placeholderText: {
            color: theme.foregroundMuted,
        },
        dropdownMenu: {
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 8,
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 12,
            overflow: "hidden",
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
        },
        scrollArea: {
            maxHeight: 240,
        },
        optionItem: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 14,
        },
        optionBorder: {
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
            opacity: 0.5, // Matches the border-border/50 logic
        },
        optionItemSelected: {
            backgroundColor: `${theme.primary}1A`, // 10% opacity in hex
        },
        optionText: {
            fontSize: 14,
            fontWeight: "500",
            color: theme.foreground,
        },
        optionTextSelected: {
            color: theme.primary,
            fontWeight: "700",
        },
        errorText: {
            color: theme.destructive,
            fontSize: 14,
            fontWeight: "500",
            marginTop: 6,
            marginLeft: 4,
        },
    });
