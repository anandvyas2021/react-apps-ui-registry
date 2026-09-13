import { useState, forwardRef, useMemo } from "react";
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    TextInputProps,
} from "react-native";
import { Controller, FieldValues, Control, Path } from "react-hook-form";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface InputProps extends Omit<TextInputProps, "onChangeText"> {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    type?: "mobile" | "email" | "password" | "number" | "text";
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
            prefix = "+91",
            ...rest
        },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);

        const [showSecureText, setShowSecureText] = useState(true);
        const hasError = !!error;

        return (
            <View style={styles.container}>
                <Text style={styles.label}>{label}</Text>

                <View
                    style={[
                        styles.inputContainer,
                        error && styles.inputContainerError,
                        disabled && styles.inputContainerDisabled,
                    ]}
                >
                    {type === "mobile" && (
                        <View style={styles.prefixContainer}>
                            <Text style={styles.prefixText}>{prefix}</Text>
                        </View>
                    )}

                    <TextInput
                        ref={ref}
                        style={styles.input}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        placeholderTextColor={theme.mutedForeground}
                        secureTextEntry={type === "password" && showSecureText}
                        keyboardType={
                            type === "mobile" || type === "number"
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

                    {type === "password" && value?.length ? (
                        <DynamicIcon
                            name={showSecureText ? "EyeClosed" : "Eye"}
                            size={20}
                            color={theme.mutedForeground}
                            style={styles.icon}
                            onPress={() => setShowSecureText((prev) => !prev)}
                        />
                    ) : null}
                </View>

                {hasError ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : null}
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
            paddingHorizontal: 16,
            borderRightWidth: 1,
            borderRightColor: theme.border,
        },
        prefixText: {
            fontSize: 16,
            fontWeight: "500",
            color: theme.foreground,
        },
        input: {
            flex: 1,
            paddingHorizontal: 16,
            paddingVertical: 16,
            fontSize: 16,
            fontWeight: "500",
            color: theme.foreground,
        },
        icon: { paddingHorizontal: 16 },
        errorText: {
            fontSize: 12,
            marginTop: 6,
            fontWeight: "500",
            color: theme.destructive,
        },
    });
