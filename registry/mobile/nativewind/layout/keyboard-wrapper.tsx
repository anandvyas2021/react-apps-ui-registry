import React, { forwardRef } from "react";
import {
    View,
    Platform,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    ViewStyle,
} from "react-native";

import { PageScrollView } from "./page-scrollview";

import { cn } from "@/lib/utils";

export interface KeyboardWrapperProps {
    children: React.ReactNode;
    className?: string;
    style?: ViewStyle;
    contentContainerStyle?: ViewStyle;
    keyboardOffset?: number;
    behavior?: "padding" | "height" | "position";
    dismissKeyboardOnTap?: boolean;
    scrollable?: boolean;
}

export const KeyboardWrapper = forwardRef<View, KeyboardWrapperProps>(
    (
        {
            children,
            className,
            style,
            contentContainerStyle,
            keyboardOffset = Platform.OS === "ios" ? 10 : 0,
            behavior = Platform.OS === "ios" ? "padding" : undefined,
            dismissKeyboardOnTap = true,
            scrollable = true,
        },
        ref,
    ) => {
        return (
            <KeyboardAvoidingView
                ref={ref}
                style={style}
                behavior={behavior}
                className={cn("flex-1 bg-background", className)}
                keyboardVerticalOffset={keyboardOffset}
            >
                {scrollable ? (
                    // ScrollView naturally handles its own keyboard dismissal via props
                    <PageScrollView
                        contentContainerStyle={contentContainerStyle}
                        keyboardDismissMode={
                            dismissKeyboardOnTap ? "interactive" : "none"
                        }
                    >
                        {children}
                    </PageScrollView>
                ) : (
                    // For static screens (e.g., OTP or simple login screens)
                    <TouchableWithoutFeedback
                        onPress={
                            dismissKeyboardOnTap ? Keyboard.dismiss : undefined
                        }
                        accessible={false}
                    >
                        <View className="flex-1">{children}</View>
                    </TouchableWithoutFeedback>
                )}
            </KeyboardAvoidingView>
        );
    },
);
KeyboardWrapper.displayName = "KeyboardWrapper";
