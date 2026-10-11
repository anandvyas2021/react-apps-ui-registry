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
    StyleSheet,
    ViewStyle,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
    Controller,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";

import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";
import type { IconName } from "@/lib/utils";

export interface DateProps {
    minimumDate?: Date | string;
    maximumDate?: Date | string;
}

export interface InputProps extends Omit<TextInputProps, "onChangeText"> {
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
    containerStyle?: ViewStyle;
    dateProps?: DateProps;
    roundness?: "default" | "full";
    disabled?: boolean;

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
            disabled = false,
            autoFocus = false,
            prefix = type === "mobile" ? "+91" : "",
            containerStyle,
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
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);

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
        const borderRadiusValue = roundness === "full" ? 9999 : 12;

        return (
            <View style={[styles.container, containerStyle]}>
                {label && <Text style={styles.label}>{label}</Text>}

                <InputWrapper
                    style={[
                        styles.inputWrapper,
                        { borderRadius: isExpanded ? 24 : borderRadiusValue },
                        isExpanded
                            ? styles.wrapperExpanded
                            : styles.wrapperCompact,
                        hasError && styles.wrapperError,
                        disabled && styles.wrapperDisabled,
                    ]}
                    onPress={isDateType ? handleOpenDatePicker : undefined}
                    activeOpacity={isDateType ? 0.7 : 1}
                >
                    {/* Prefix Zone */}
                    {(type === "mobile" || type === "money") && (
                        <View
                            style={[
                                styles.prefixContainer,
                                type === "mobile" && styles.mobilePrefixDivider,
                            ]}
                        >
                            <Text style={styles.prefixText}>{prefix}</Text>
                        </View>
                    )}

                    {/* Left Add (+) Button */}
                    {!isExpanded && showAddIcon && (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={onAdd}
                            hitSlop={8}
                            style={styles.addIconButton}
                        >
                            <DynamicIcon
                                name="Plus"
                                size={22}
                                color={theme.foregroundMuted}
                            />
                        </TouchableOpacity>
                    )}

                    {/* Text Input Container */}
                    <View
                        style={
                            isExpanded
                                ? styles.fullWidthInput
                                : styles.flexInput
                        }
                        pointerEvents={isDateType ? "none" : "auto"}
                    >
                        <TextInput
                            ref={ref}
                            style={[
                                styles.textInput,
                                isExpanded
                                    ? styles.textInputExpanded
                                    : isAIType
                                      ? styles.textInputAI
                                      : styles.textInputDefault,
                                textInputStyle,
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

                    {/* AI measurement mirror */}
                    {isAIType && (
                        <View
                            pointerEvents="none"
                            style={[
                                styles.mirrorContainer,
                                { left: leftInset, right: rightInset },
                            ]}
                        >
                            <Text
                                accessible={false}
                                aria-hidden={true}
                                onTextLayout={handleMirrorTextLayout}
                                style={styles.mirrorText}
                            >
                                {value || " "}
                            </Text>
                        </View>
                    )}

                    {/* Single-Line Trailing Icons Zone */}
                    {!isExpanded && (
                        <View style={styles.trailingIconsRow}>
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
                                        color={theme.foregroundMuted}
                                    />
                                </TouchableOpacity>
                            )}

                            {isDateType && (
                                <DynamicIcon
                                    name="Calendar"
                                    size={20}
                                    color={theme.foregroundMuted}
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
                                        color={theme.foregroundMuted}
                                    />
                                </TouchableOpacity>
                            )}

                            {showSendIcon && (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={handleSendPress}
                                    disabled={disabled || !hasTrimmedValue}
                                    style={[
                                        styles.sendButton,
                                        hasTrimmedValue
                                            ? styles.sendButtonActive
                                            : styles.sendButtonInactive,
                                    ]}
                                >
                                    <DynamicIcon
                                        name={sendIcon as string}
                                        size={16}
                                        color={
                                            hasTrimmedValue
                                                ? theme.primaryForeground
                                                : theme.foregroundMuted
                                        }
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* Multiline Bottom Action Toolbar */}
                    {isExpanded && (
                        <View style={styles.expandedToolbar}>
                            <View>
                                {showAddIcon && (
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={onAdd}
                                        hitSlop={8}
                                        style={styles.toolbarAddButton}
                                    >
                                        <DynamicIcon
                                            name="Plus"
                                            size={22}
                                            color={theme.foregroundMuted}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.expandedToolbarRight}>
                                {showSpeakIcon && (
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={handleSpeakPress}
                                    >
                                        <DynamicIcon
                                            name="Mic"
                                            size={20}
                                            color={theme.foregroundMuted}
                                        />
                                    </TouchableOpacity>
                                )}
                                {showSendIcon && (
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={handleSendPress}
                                        disabled={disabled || !hasTrimmedValue}
                                        style={[
                                            styles.sendButton,
                                            hasTrimmedValue
                                                ? styles.sendButtonActive
                                                : styles.sendButtonInactive,
                                        ]}
                                    >
                                        <DynamicIcon
                                            name={sendIcon as string}
                                            size={16}
                                            color={
                                                hasTrimmedValue
                                                    ? theme.primaryForeground
                                                    : theme.foregroundMuted
                                            }
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}
                </InputWrapper>

                {hasError && <Text style={styles.errorText}>{error}</Text>}

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

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            width: "100%",
            marginBottom: 20,
        },
        label: {
            fontSize: 12,
            fontWeight: "500",
            color: theme.foregroundMuted,
            marginBottom: 8,
        },
        inputWrapper: {
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.surface,
            overflow: "hidden",
        },
        wrapperCompact: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            paddingVertical: 4,
        },
        wrapperExpanded: {
            flexDirection: "column",
            padding: 12,
        },
        wrapperError: {
            borderColor: theme.destructive,
        },
        wrapperDisabled: {
            opacity: 0.5,
            backgroundColor: theme.surfaceMuted,
        },
        prefixContainer: {
            justifyContent: "center",
            paddingRight: 12,
        },
        mobilePrefixDivider: {
            borderRightWidth: 1,
            borderRightColor: theme.border,
            marginRight: 8,
        },
        prefixText: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.foregroundMuted,
        },
        addIconButton: {
            marginRight: 6,
            padding: 4,
        },
        flexInput: {
            flex: 1,
        },
        fullWidthInput: {
            width: "100%",
        },
        textInput: {
            fontSize: 14,
            fontWeight: "600",
            color: theme.foreground,
            backgroundColor: "transparent",
            paddingHorizontal: 8,
        },
        textInputExpanded: {
            minHeight: 52,
            maxHeight: 144,
            paddingTop: 8,
            paddingBottom: 8,
            textAlignVertical: "top",
        },
        textInputAI: {
            height: 40,
            paddingTop: Platform.OS === "ios" ? 10 : 0,
            paddingBottom: Platform.OS === "ios" ? 10 : 0,
            textAlignVertical: "center",
        },
        textInputDefault: {
            paddingVertical: Platform.OS === "ios" ? 8 : 4,
            textAlignVertical: "center",
        },
        mirrorContainer: {
            position: "absolute",
            top: 0,
            height: 0,
            opacity: 0,
        },
        mirrorText: {
            fontSize: 14,
            fontWeight: "600",
            lineHeight: 20,
            paddingHorizontal: 8,
        },
        trailingIconsRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },
        sendButton: {
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
        },
        sendButtonActive: {
            backgroundColor: theme.primary,
        },
        sendButtonInactive: {
            backgroundColor: theme.surfaceMuted,
        },
        expandedToolbar: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 8,
            paddingTop: 4,
        },
        toolbarAddButton: {
            padding: 4,
        },
        expandedToolbarRight: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        },
        errorText: {
            fontSize: 12,
            fontWeight: "500",
            color: theme.destructive,
            marginTop: 6,
            marginLeft: 4,
        },
    });
