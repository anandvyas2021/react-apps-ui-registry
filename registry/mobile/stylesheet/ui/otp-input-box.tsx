import React, { useRef, forwardRef, useImperativeHandle, useMemo } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ViewProps,
    StyleSheet,
} from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface OTPInputBoxProps extends ViewProps {
    code: string;
    setCode: (code: string) => void;
    length?: number;
}

export interface OTPInputRef {
    focus: () => void;
    blur: () => void;
    clear: () => void;
}

export const OTPInputBox = forwardRef<OTPInputRef, OTPInputBoxProps>(
    ({ code, setCode, length = 6, style, ...props }, ref) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);
        const inputRef = useRef<TextInput>(null);

        useImperativeHandle(ref, () => ({
            focus: () => inputRef.current?.focus(),
            blur: () => inputRef.current?.blur(),
            clear: () => setCode(""),
        }));

        const handlePress = () => {
            if (inputRef.current?.isFocused()) {
                inputRef.current.blur();
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 50);
            } else {
                inputRef.current?.focus();
            }
        };

        return (
            <View style={[styles.container, style]} {...props}>
                <Pressable
                    style={styles.pressableContainer}
                    onPress={handlePress}
                >
                    {Array(length)
                        .fill(0)
                        .map((_, index) => {
                            const digit = code[index] || "";
                            const isCurrentDigit = index === code.length;
                            const isLastDigit = index === length - 1;
                            const isCodeComplete = code.length === length;
                            const isFocused =
                                isCurrentDigit ||
                                (isCodeComplete && isLastDigit);

                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.digitBox,
                                        isFocused
                                            ? styles.digitBoxFocused
                                            : styles.digitBoxDefault,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.digitText,
                                            isFocused &&
                                                styles.digitTextFocused,
                                        ]}
                                    >
                                        {digit}
                                    </Text>
                                </View>
                            );
                        })}
                </Pressable>

                <TextInput
                    ref={inputRef}
                    value={code}
                    onChangeText={(text) => {
                        const numericValue = text.replace(/[^0-9]/g, "");
                        if (numericValue.length <= length)
                            setCode(numericValue);
                    }}
                    keyboardType="number-pad"
                    autoFocus
                    textContentType="oneTimeCode"
                    style={styles.hiddenInput}
                />
            </View>
        );
    },
);
OTPInputBox.displayName = "OTPInputBox";

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            width: "100%",
            alignItems: "center",
        },
        pressableContainer: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
        },
        digitBox: {
            height: 64,
            width: 56,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            borderWidth: 2,
        },
        digitBoxDefault: {
            backgroundColor: theme.surface,
            borderColor: "transparent",
        },
        digitBoxFocused: {
            backgroundColor: `${theme.primary}1A`, // 10% opacity
            borderColor: theme.primary,
        },
        digitText: {
            fontSize: 24,
            fontWeight: "500",
            color: theme.foreground,
        },
        digitTextFocused: {
            color: theme.primary,
        },
        hiddenInput: {
            position: "absolute",
            height: 0,
            width: 0,
            opacity: 0,
        },
    });
