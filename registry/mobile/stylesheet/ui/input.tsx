import { useState, forwardRef, useMemo } from "react";
import {
    Text,
    View,
    Platform,
    TextInput,
    StyleSheet,
    TextInputProps,
    TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Controller, FieldValues, Control, Path } from "react-hook-form";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface InputProps extends Omit<TextInputProps, "onChangeText"> {
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
    disabled?: boolean;
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
            ...rest
        },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);

        const [showSecureText, setShowSecureText] = useState(true);
        const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

        const hasError = !!error;
        const isDateType = type === "date";

        const handleConfirm = (date: Date) => {
            // Format to DD-MM-YYYY securely avoiding timezone shift bugs
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            onChangeText(`${day}-${month}-${year}`);
            setDatePickerVisibility(false);
        };

        // Dynamically switch wrapper based on type to enable tapping for dates
        const InputWrapper = isDateType ? TouchableOpacity : View;

        return (
            <View style={styles.container}>
                <Text style={styles.label}>{label}</Text>

                <InputWrapper
                    style={[
                        styles.inputContainer,
                        error && styles.inputContainerError,
                        disabled && styles.inputContainerDisabled,
                    ]}
                    onPress={
                        isDateType
                            ? () => setDatePickerVisibility(true)
                            : undefined
                    }
                    activeOpacity={isDateType ? 0.7 : 1}
                >
                    {(type === "mobile" || type === "money") && (
                        <View
                            style={[
                                styles.prefixContainer,
                                type === "mobile"
                                    ? {
                                          paddingRight: 16,
                                          borderRightWidth: 1,
                                          borderRightColor: theme.border,
                                      }
                                    : {},
                            ]}
                        >
                            <Text style={styles.prefixText}>{prefix}</Text>
                        </View>
                    )}
                    <View
                        style={{ flex: 1 }}
                        pointerEvents={isDateType ? "none" : "auto"}
                    >
                        <TextInput
                            ref={ref}
                            style={[
                                styles.input,
                                type === "mobile" ? { paddingLeft: 16 } : {},
                            ]}
                            placeholder={placeholder}
                            maxLength={maxLength}
                            placeholderTextColor={theme.foregroundMuted}
                            secureTextEntry={
                                type === "password" && showSecureText
                            }
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
                            color={theme.foregroundMuted}
                            style={styles.icon}
                            onPress={() => setShowSecureText((prev) => !prev)}
                        />
                    ) : null}
                    {isDateType ? (
                        <DynamicIcon
                            name="Calendar"
                            size={20}
                            color={theme.foreground}
                        />
                    ) : null}
                </InputWrapper>

                {hasError ? (
                    <Text style={styles.errorText}>{error}</Text>
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

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: { marginBottom: 20 },
        label: {
            fontSize: 12,
            fontWeight: "500",
            color: theme.foregroundMuted,
            marginBottom: 8,
        },
        inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.background,
            overflow: "hidden",
        },
        inputContainerError: { borderColor: theme.destructive },
        inputContainerDisabled: { opacity: 0.5 },
        prefixContainer: {
            justifyContent: "center",
            paddingLeft: 16,
        },
        prefixText: {
            fontSize: 16,
            fontWeight: "500",
            color: theme.foregroundMuted,
        },
        input: {
            flex: 1,
            paddingHorizontal: 16,
            paddingRight: 16,
            fontSize: 16,
            fontWeight: "500",
            color: theme.foregroundMuted,
            backgroundColor: theme.surface,
        },
        icon: { paddingHorizontal: 16, color: theme.foregroundMuted },
        errorText: {
            fontSize: 12,
            marginTop: 6,
            fontWeight: "500",
            color: theme.destructive,
        },
    });
