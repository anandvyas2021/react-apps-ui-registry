import { useState, forwardRef } from "react";
import {
    Text,
    View,
    Platform,
    TextInput,
    TextInputProps,
    TouchableOpacity,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Controller, FieldValues, Control, Path } from "react-hook-form";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn } from "@/lib/utils";

const inputWrapperVariants = cva(
    "flex-row items-center rounded-xl border bg-surface overflow-hidden",
    {
        variants: {
            variant: {
                default: "border-border",
                error: "border-destructive",
            },
            disabled: {
                true: "opacity-50 bg-slate-800/50",
            },
        },
        defaultVariants: {
            variant: "default",
            disabled: false,
        },
    },
);

export interface InputProps
    extends
        Omit<TextInputProps, "onChangeText">,
        VariantProps<typeof inputWrapperVariants> {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    type?:
        | "mobile"
        | "email"
        | "password"
        | "number"
        | "text"
        | "date"
        | "money"
        | string;
    prefix?: string;
    className?: string; // Standardize user overrides
}

export interface ControlledInputProps<T extends FieldValues> extends Omit<
    InputProps,
    "value" | "onChangeText"
> {
    control: Control<T>;
    name: Path<T>;
}

export const Input = forwardRef<TextInput, InputProps>(
    (
        {
            label,
            value,
            type = "text",
            placeholder,
            maxLength,
            onChangeText,
            error,
            disabled,
            autoFocus = false,
            prefix = type === "mobile" ? "+91" : "",
            className,
            ...rest
        },
        ref,
    ) => {
        const [showSecureText, setShowSecureText] = useState(true);
        const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

        const hasError = !!error;
        const isDateType = type === "date";

        const handleConfirm = (date: Date) => {
            // Format to YYYY-MM-DD securely avoiding timezone shift bugs
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            onChangeText(`${year}-${month}-${day}`);
            setDatePickerVisibility(false);
        };

        // Dynamically switch wrapper based on type to enable tapping for dates
        const InputWrapper = isDateType ? TouchableOpacity : View;

        return (
            <View className="mb-5">
                <Text className="text-xs font-medium text-foreground-muted mb-2">
                    {label}
                </Text>

                <InputWrapper
                    className={cn(
                        inputWrapperVariants({
                            variant: hasError ? "error" : "default",
                            disabled,
                        }),
                        className,
                    )}
                    onPress={
                        isDateType
                            ? () => setDatePickerVisibility(true)
                            : undefined
                    }
                    activeOpacity={isDateType ? 0.7 : 1}
                >
                    {(type === "mobile" || type === "money") && (
                        <View
                            className={`justify-center px-4  ${type === "money" ? "" : "border-r border-foreground-muted"}`}
                        >
                            <Text className="text-base font-medium text-foreground-muted">
                                {prefix}
                            </Text>
                        </View>
                    )}
                    <View
                        style={{ flex: 1 }}
                        pointerEvents={isDateType ? "none" : "auto"}
                    >
                        <TextInput
                            ref={ref}
                            className="flex-1 px-4 py-4 text-base font-medium text-foreground-muted bg-surface"
                            placeholder={placeholder}
                            maxLength={maxLength}
                            placeholderTextColor="#64748b"
                            secureTextEntry={
                                type === "password" && showSecureText
                            }
                            numberOfLines={1}
                            keyboardType={
                                type === "mobile" ||
                                type === "money" ||
                                type === "number"
                                    ? "number-pad"
                                    : type === "email"
                                      ? "email-address"
                                      : "default"
                            }
                            autoCapitalize={
                                type === "email" || type === "password"
                                    ? "none"
                                    : "sentences"
                            }
                            value={value}
                            onChangeText={onChangeText}
                            autoFocus={autoFocus}
                            editable={!disabled}
                            {...rest}
                        />
                    </View>

                    {type === "password" && value?.length ? (
                        <DynamicIcon
                            name={showSecureText ? "EyeClosed" : "Eye"}
                            size={20}
                            color="#94a3b8"
                            style={{ paddingHorizontal: 16 }}
                            onPress={() => setShowSecureText((prev) => !prev)}
                        />
                    ) : null}
                    {isDateType ? (
                        <DynamicIcon
                            name="Calendar"
                            size={20}
                            // color={"text-foreground"}
                            className="text-foreground"
                            // style={{ marginRight: 16 }}
                        />
                    ) : null}
                </InputWrapper>
                {hasError ? (
                    <Text className="text-xs mt-1.5 font-medium text-destructive">
                        {error}
                    </Text>
                ) : null}

                {isDateType && (
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={() => setDatePickerVisibility(false)}
                        date={value ? new Date(value) : new Date()}
                        maximumDate={new Date()} // Restricts future dates
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        isDarkModeEnabled={true}
                        themeVariant="dark"
                    />
                )}
            </View>
        );
    },
);
Input.displayName = "Input";

export function ControlledInput<T extends FieldValues>({
    control,
    name,
    ...rest
}: ControlledInputProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                    value={value as string}
                    onChangeText={onChange}
                    error={error?.message}
                    {...rest}
                />
            )}
        />
    );
}
ControlledInput.displayName = "ControlledInput";
