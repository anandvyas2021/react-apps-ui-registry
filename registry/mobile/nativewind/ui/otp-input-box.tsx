import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { View, Text, TextInput, Pressable, ViewProps } from "react-native";

import { cn } from "@/lib/utils";

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
    ({ code, setCode, length = 6, className, ...props }, ref) => {
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
            <View className={cn("w-full items-center", className)} {...props}>
                <Pressable
                    className="w-full flex-row justify-between"
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
                                    className={cn(
                                        "h-16 w-14 items-center justify-center rounded-xl border-2",
                                        isFocused
                                            ? "border-primary bg-primary-lighter"
                                            : "bg-surface border-transparent",
                                    )}
                                >
                                    <Text
                                        className={cn(
                                            "text-2xl font-medium",
                                            isFocused
                                                ? "text-primary"
                                                : "text-foreground",
                                        )}
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
                    className="absolute h-0 w-0 opacity-0"
                />
            </View>
        );
    },
);
OTPInputBox.displayName = "OTPInputBox";
