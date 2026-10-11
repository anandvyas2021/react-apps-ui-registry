import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    forwardRef,
} from "react";
import {
    Text,
    View,
    Platform,
    Keyboard,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    NativeSyntheticEvent,
    TextLayoutEventData,
    ViewStyle,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn, type IconName } from "@/lib/utils";

const inputWrapperVariants = cva("border bg-surface overflow-hidden", {
    variants: {
        variant: {
            default: "border-border",
            error: "border-destructive",
        },
        disabled: {
            true: "opacity-50 bg-surface-muted",
        },
    },
    defaultVariants: {
        variant: "default",
        disabled: false,
    },
});

export interface DateProps {
    minimumDate?: Date | string;
    maximumDate?: Date | string;
}

export interface InputProps
    extends
        Omit<TextInputProps, "onChangeText">,
        VariantProps<typeof inputWrapperVariants> {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    inputType?: "default" | "multiline" | "AI";
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
    containerClassName?: string;
    containerStyle?: ViewStyle;
    className?: string;
    dateProps?: DateProps;
    roundness?: "default" | "full";

    showAddIcon?: boolean;
    onAdd?: () => void;
    showSpeakIcon?: boolean;
    onSpeak?: () => void;
    showSendIcon?: boolean;
    onSend?: () => void;
    sendIcon?: IconName | string;
}

export const parseFlexibleDate = (dateString: string | Date | null): Date => {
    if (!dateString) return new Date();
    if (dateString instanceof Date) return dateString;
    const parts = dateString.split(/[-/]/);

    if (parts.length === 3) {
        let day: string, month: string, year: string;

        if (parts[0].length === 4) {
            [year, month, day] = parts;
        } else {
            [day, month, year] = parts;
            if (year.length === 2) {
                year = `20${year}`;
            }
        }

        const parsedDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
        );

        if (!isNaN(parsedDate.getTime())) {
            return parsedDate;
        }
    }

    const fallback = new Date(dateString);
    return isNaN(fallback.getTime()) ? new Date() : fallback;
};

export const Input = forwardRef<TextInput, InputProps>(
    (
        {
            label,
            value = "",
            inputType = "default",
            type = "text",
            placeholder,
            maxLength,
            onChangeText,
            error,
            disabled,
            autoFocus = false,
            prefix = type === "mobile" ? "+91" : "",
            containerClassName,
            containerStyle,
            className,
            style: textInputStyle,
            dateProps,
            multiline = false,
            roundness = "default",
            showAddIcon = false,
            onAdd,
            showSpeakIcon = false,
            onSpeak,
            showSendIcon = false,
            onSend,
            sendIcon = "Send",
            onContentSizeChange,
            ...rest
        },
        ref,
    ) => {
        const [showSecureText, setShowSecureText] = useState(true);
        const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
        const [isMultilineActive, setIsMultilineActive] = useState(false);

        const hasError = !!error;
        const isDateType = type === "date";
        const isAIType = inputType === "AI";
        const isAlwaysMultiline = inputType === "multiline";
        const hasTrimmedValue = !!value?.trim();

        const leftInset = useMemo(() => {
            let inset = 14;
            if (type === "mobile") inset += 54;
            else if (type === "money") inset += 36;
            if (showAddIcon) inset += 36;
            return inset;
        }, [type, showAddIcon]);

        const rightInset = useMemo(() => {
            let inset = 14;
            if (type === "password") inset += 34;
            if (isDateType) inset += 34;
            if (showSpeakIcon) inset += 34;
            if (showSendIcon) inset += 42;
            return inset;
        }, [type, isDateType, showSpeakIcon, showSendIcon]);

        useEffect(() => {
            const trimmed = value?.trim() || "";
            if (!trimmed) {
                setIsMultilineActive(false);
            } else if (value.includes("\n")) {
                setIsMultilineActive(true);
            }
        }, [value]);

        const isExpanded = useMemo(() => {
            if (isAlwaysMultiline) return true;
            if (isAIType) return isMultilineActive || value.includes("\n");
            if (inputType === "default" && multiline) {
                return isMultilineActive || value.includes("\n");
            }
            return false;
        }, [
            isAlwaysMultiline,
            isAIType,
            isMultilineActive,
            inputType,
            multiline,
            value,
        ]);

        const handleMirrorTextLayout = useCallback(
            (event: NativeSyntheticEvent<TextLayoutEventData>) => {
                const lineCount = event.nativeEvent.lines.length;
                const hasNewline = value.includes("\n");
                const shouldBeExpanded = lineCount > 1 || hasNewline;
                setIsMultilineActive((prev) =>
                    prev === shouldBeExpanded ? prev : shouldBeExpanded,
                );
            },
            [value],
        );

        const handleSpeakPress = useCallback(() => {
            Keyboard.dismiss();
            onSpeak?.();
        }, [onSpeak]);

        const handleSendPress = useCallback(() => {
            Keyboard.dismiss();
            onSend?.();
        }, [onSend]);

        const resolvedMinDate = useMemo(
            () =>
                dateProps?.minimumDate
                    ? parseFlexibleDate(dateProps.minimumDate)
                    : undefined,
            [dateProps?.minimumDate],
        );
        const resolvedMaxDate = useMemo(
            () =>
                dateProps?.maximumDate
                    ? parseFlexibleDate(dateProps.maximumDate)
                    : undefined,
            [dateProps?.maximumDate],
        );

        const handleOpenDatePicker = useCallback(
            () => setDatePickerVisibility(true),
            [],
        );
        const handleConfirm = useCallback(
            (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");

                onChangeText(`${day}-${month}-${year}`);
                setDatePickerVisibility(false);
            },
            [onChangeText],
        );

        const InputWrapper = isDateType ? TouchableOpacity : View;
        const roundnessClass =
            roundness === "full" ? "rounded-full" : "rounded-xl";

        return (
            <View
                className={cn("w-full mb-5", containerClassName)}
                style={containerStyle}
            >
                {label && (
                    <Text className="text-xs font-medium text-foreground-muted mb-2">
                        {label}
                    </Text>
                )}

                <InputWrapper
                    className={cn(
                        inputWrapperVariants({
                            variant: hasError ? "error" : "default",
                            disabled,
                        }),
                        isExpanded
                            ? "flex-col rounded-[24px] p-3"
                            : cn(
                                  "flex-row items-center px-3.5 py-1",
                                  roundnessClass,
                              ),
                        className,
                    )}
                    onPress={isDateType ? handleOpenDatePicker : undefined}
                    activeOpacity={isDateType ? 0.7 : 1}
                >
                    {/* Prefix Zone */}
                    {(type === "mobile" || type === "money") && (
                        <View
                            className={cn(
                                "justify-center pr-3",
                                type === "mobile" &&
                                    "border-r border-border mr-2",
                            )}
                        >
                            <Text className="text-base font-semibold text-foreground-muted">
                                {prefix}
                            </Text>
                        </View>
                    )}

                    {/* Single Line: Left Add (+) Button */}
                    {!isExpanded && showAddIcon && (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={onAdd}
                            hitSlop={8}
                            className="mr-1.5 p-1"
                        >
                            <DynamicIcon
                                name="Plus"
                                size={22}
                                className="text-foreground-muted"
                            />
                        </TouchableOpacity>
                    )}

                    {/* Text Input Container */}
                    <View
                        className={isExpanded ? "w-full" : "flex-1"}
                        pointerEvents={isDateType ? "none" : "auto"}
                    >
                        <TextInput
                            ref={ref}
                            className="text-sm font-semibold text-foreground bg-transparent"
                            style={[
                                {
                                    paddingHorizontal: 8,
                                    textAlignVertical: isExpanded
                                        ? "top"
                                        : "center",
                                    ...(isExpanded
                                        ? {
                                              minHeight: 52,
                                              maxHeight: 144,
                                              paddingTop: 8,
                                              paddingBottom: 8,
                                          }
                                        : isAIType
                                          ? {
                                                height: 40,
                                                paddingTop:
                                                    Platform.OS === "ios"
                                                        ? 10
                                                        : 0,
                                                paddingBottom:
                                                    Platform.OS === "ios"
                                                        ? 10
                                                        : 0,
                                            }
                                          : {
                                                paddingVertical:
                                                    Platform.OS === "ios"
                                                        ? 8
                                                        : 4,
                                            }),
                                },
                                textInputStyle,
                            ]}
                            placeholder={placeholder}
                            maxLength={maxLength}
                            placeholderTextColor="#94a3b8"
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
                            multiline={
                                isAIType || isAlwaysMultiline || multiline
                            }
                            value={value}
                            onChangeText={onChangeText}
                            onContentSizeChange={onContentSizeChange}
                            autoFocus={autoFocus}
                            editable={!disabled}
                            scrollEnabled={isExpanded}
                            {...rest}
                        />
                    </View>

                    {/* AI composer measurement mirror */}
                    {isAIType && (
                        <View
                            pointerEvents="none"
                            style={{
                                position: "absolute",
                                left: leftInset,
                                right: rightInset,
                                top: 0,
                                height: 0,
                                opacity: 0,
                            }}
                        >
                            <Text
                                accessible={false}
                                aria-hidden={true}
                                onTextLayout={handleMirrorTextLayout}
                                style={{
                                    fontSize: 14,
                                    fontWeight: "600",
                                    lineHeight: 20,
                                    paddingHorizontal: 8,
                                }}
                            >
                                {value || " "}
                            </Text>
                        </View>
                    )}

                    {/* Single-Line Trailing Icons Zone */}
                    {!isExpanded && (
                        <View className="flex-row items-center gap-2.5">
                            {type === "password" && value?.length > 0 && (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() =>
                                        setShowSecureText((prev) => !prev)
                                    }
                                >
                                    <DynamicIcon
                                        name={
                                            showSecureText ? "EyeClosed" : "Eye"
                                        }
                                        size={20}
                                        className="text-foreground-muted"
                                    />
                                </TouchableOpacity>
                            )}

                            {isDateType && (
                                <DynamicIcon
                                    name="Calendar"
                                    size={20}
                                    className="text-foreground-muted"
                                />
                            )}

                            {showSpeakIcon && (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={handleSpeakPress}
                                >
                                    <DynamicIcon
                                        name="Mic"
                                        size={20}
                                        className="text-foreground-muted"
                                    />
                                </TouchableOpacity>
                            )}

                            {showSendIcon && (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={handleSendPress}
                                    disabled={disabled || !hasTrimmedValue}
                                    className={cn(
                                        "w-8 h-8 rounded-full items-center justify-center transition-colors",
                                        hasTrimmedValue
                                            ? "bg-primary"
                                            : "bg-surface-muted",
                                    )}
                                >
                                    <DynamicIcon
                                        name={sendIcon as string}
                                        size={16}
                                        className={
                                            hasTrimmedValue
                                                ? "text-primary-foreground"
                                                : "text-foreground-muted"
                                        }
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* Multiline Bottom Action Toolbar */}
                    {isExpanded && (
                        <View className="w-full flex-row items-center justify-between mt-2 pt-1">
                            <View className="flex-row items-center">
                                {showAddIcon && (
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={onAdd}
                                        hitSlop={8}
                                        className="p-1"
                                    >
                                        <DynamicIcon
                                            name="Plus"
                                            size={22}
                                            className="text-foreground-muted"
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View className="flex-row items-center gap-3">
                                {showSpeakIcon && (
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={handleSpeakPress}
                                    >
                                        <DynamicIcon
                                            name="Mic"
                                            size={20}
                                            className="text-foreground-muted"
                                        />
                                    </TouchableOpacity>
                                )}
                                {showSendIcon && (
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={handleSendPress}
                                        disabled={disabled || !hasTrimmedValue}
                                        className={cn(
                                            "w-8 h-8 rounded-full items-center justify-center transition-colors",
                                            hasTrimmedValue
                                                ? "bg-primary"
                                                : "bg-surface-muted",
                                        )}
                                    >
                                        <DynamicIcon
                                            name={sendIcon as string}
                                            size={16}
                                            className={
                                                hasTrimmedValue
                                                    ? "text-primary-foreground"
                                                    : "text-foreground-muted"
                                            }
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}
                </InputWrapper>

                {hasError && (
                    <Text className="text-xs mt-1.5 font-medium text-destructive ml-1">
                        {error}
                    </Text>
                )}

                {isDateType && !disabled && (
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible && !disabled}
                        mode="date"
                        onConfirm={(date) => {
                            if (disabled) return;
                            handleConfirm(date);
                        }}
                        onCancel={() => setDatePickerVisibility(false)}
                        date={parseFlexibleDate(value)}
                        minimumDate={resolvedMinDate}
                        maximumDate={resolvedMaxDate}
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                    />
                )}
            </View>
        );
    },
);
Input.displayName = "Input";

export interface ControlledInputProps<T extends FieldValues> extends Omit<
    InputProps,
    "value" | "onChangeText"
> {
    control: Control<T>;
    name: Path<T>;
}

export function ControlledInput<T extends FieldValues>({
    control,
    name,
    type,
    ...rest
}: ControlledInputProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
                const stringValue =
                    value !== undefined && value !== null ? String(value) : "";

                return (
                    <Input
                        type={type}
                        value={stringValue}
                        onChangeText={onChange}
                        error={error?.message}
                        {...rest}
                    />
                );
            }}
        />
    );
}
ControlledInput.displayName = "ControlledInput";
