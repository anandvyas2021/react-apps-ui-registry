import { useMemo, useState } from "react";
import {
    View,
    Text,
    Platform,
    ViewStyle,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn } from "@/lib/utils";

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
    className?: string;
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
    className,
    style,
    zIndex = 10,
}: DropdownSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (val: string) => {
        onSelect(val);
        setIsOpen(false);
    };

    const selectedLabel = useMemo(() => {
        const selected = options?.find((opt) => opt?.value === selectedValue);
        return selected ? selected.label : "";
    }, [selectedValue, options]);

    const dynamicZIndex = isOpen ? 999 : zIndex;

    return (
        <View
            className={cn("w-full mb-4", className)}
            style={[
                {
                    zIndex: dynamicZIndex,
                    // Android requires elevation alongside zIndex to layer above following views
                    elevation:
                        Platform.OS === "android" ? dynamicZIndex : undefined,
                },
                style,
            ]}
        >
            {label && (
                <Text className="text-xs font-medium text-foreground-muted mb-2">
                    {label}
                </Text>
            )}

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex-row justify-between items-center px-4 py-3.5 rounded-2xl border bg-surface",
                    error
                        ? "border-destructive"
                        : isOpen
                          ? "border-primary"
                          : "border-border",
                )}
            >
                <Text
                    className={cn(
                        "text-sm font-medium",
                        selectedLabel
                            ? "text-foreground"
                            : "text-foreground-disabled",
                    )}
                    numberOfLines={1}
                >
                    {selectedLabel || placeholder}
                </Text>
                <DynamicIcon
                    name={isOpen ? "ChevronUp" : "ChevronDown"}
                    size={20}
                    className="text-foreground-muted"
                />
            </TouchableOpacity>

            {isOpen && options?.length > 0 && (
                <View
                    className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl overflow-hidden"
                    style={{
                        zIndex: 1000,
                        elevation: Platform.OS === "android" ? 1000 : 10,
                    }}
                >
                    <ScrollView
                        nestedScrollEnabled
                        bounces={false}
                        className="max-h-56"
                        keyboardShouldPersistTaps="handled"
                    >
                        {options?.map((option, index) => {
                            const isSelected = selectedValue === option?.value;
                            return (
                                <TouchableOpacity
                                    key={option?.value}
                                    activeOpacity={0.7}
                                    onPress={() => handleSelect(option?.value)}
                                    className={cn(
                                        "px-4 py-3.5 flex-row items-center justify-between",
                                        index !== options?.length - 1 &&
                                            "border-b border-border",
                                        isSelected && "bg-primary-lighter",
                                    )}
                                >
                                    <Text
                                        className={cn(
                                            "text-sm",
                                            isSelected
                                                ? "text-primary font-bold"
                                                : "text-foreground font-medium",
                                        )}
                                    >
                                        {option?.label}
                                    </Text>
                                    {isSelected && (
                                        <DynamicIcon
                                            name="Check"
                                            size={18}
                                            className="text-primary"
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            )}

            {error && (
                <Text className="text-destructive text-sm font-medium mt-1.5 ml-1">
                    {error}
                </Text>
            )}
        </View>
    );
}

export interface ControlledDropdownSelectProps<
    T extends FieldValues,
> extends UseControllerProps<T> {
    label?: string;
    options: DropdownOption[];
    placeholder?: string;
    className?: string;
    zIndex?: number;
}

export function ControlledDropdownSelect<T extends FieldValues>({
    control,
    name,
    label,
    options,
    placeholder,
    className,
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
                    className={className}
                    zIndex={zIndex}
                />
            )}
        />
    );
}
