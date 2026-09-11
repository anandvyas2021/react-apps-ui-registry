import { useState, forwardRef } from "react";
import { Text, TextInput, View, TextInputProps } from "react-native";
import { Controller, FieldValues, Control, Path } from "react-hook-form";
import { cva, type VariantProps } from "class-variance-authority";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn } from "@/lib/utils";

const inputWrapperVariants = cva(
    "flex-row items-center rounded-xl border bg-slate-900 overflow-hidden",
    {
        variants: {
            variant: {
                default: "border-slate-800",
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
    type?: "mobile" | "email" | "password" | "number" | "text";
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
            prefix = "+91",
            className,
            ...rest
        },
        ref,
    ) => {
        const [showSecureText, setShowSecureText] = useState(true);
        const hasError = !!error;

        return (
            <View className="mb-5">
                <Text className="text-xs font-medium text-slate-400 mb-2">
                    {label}
                </Text>

                <View
                    className={cn(
                        inputWrapperVariants({
                            variant: hasError ? "error" : "default",
                            disabled,
                        }),
                        className,
                    )}
                >
                    {type === "mobile" && (
                        <View className="justify-center px-4 border-r border-slate-800">
                            <Text className="text-base font-medium text-white">
                                {prefix}
                            </Text>
                        </View>
                    )}

                    <TextInput
                        ref={ref}
                        className="flex-1 px-4 py-4 text-base font-medium text-white"
                        placeholder={placeholder}
                        maxLength={maxLength}
                        placeholderTextColor="#64748b"
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
                            color="#94a3b8"
                            style={{ paddingHorizontal: 16 }}
                            onPress={() => setShowSecureText((prev) => !prev)}
                        />
                    ) : null}
                </View>

                {hasError ? (
                    <Text className="text-xs mt-1.5 font-medium text-destructive">
                        {error}
                    </Text>
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
            render={({
                field: { onChange, value },
                fieldState: { fieldError },
            }) => (
                <Input
                    value={value as string}
                    onChangeText={onChange}
                    error={fieldError?.message}
                    {...rest}
                />
            )}
        />
    );
}
ControlledInput.displayName = "ControlledInput";
