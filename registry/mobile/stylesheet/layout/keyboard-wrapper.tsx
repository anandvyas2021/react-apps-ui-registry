import React, { forwardRef, useMemo } from "react";
import {
    View,
    Platform,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    StyleSheet,
    ViewStyle,
} from "react-native";

import { PageScrollView } from "./page-scrollview";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface KeyboardWrapperProps {
    children: React.ReactNode;
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
            style,
            contentContainerStyle,
            keyboardOffset = Platform.OS === "ios" ? 10 : 0,
            behavior = Platform.OS === "ios" ? "padding" : undefined,
            dismissKeyboardOnTap = true,
            scrollable = true,
        },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);

        return (
            <KeyboardAvoidingView
                ref={ref}
                style={[styles.container, style]}
                behavior={behavior}
                keyboardVerticalOffset={keyboardOffset}
            >
                {scrollable ? (
                    <PageScrollView
                        contentContainerStyle={contentContainerStyle}
                        keyboardDismissMode={
                            dismissKeyboardOnTap ? "interactive" : "none"
                        }
                    >
                        {children}
                    </PageScrollView>
                ) : (
                    <TouchableWithoutFeedback
                        onPress={
                            dismissKeyboardOnTap ? Keyboard.dismiss : undefined
                        }
                        accessible={false}
                    >
                        <View style={styles.inner}>{children}</View>
                    </TouchableWithoutFeedback>
                )}
            </KeyboardAvoidingView>
        );
    },
);
KeyboardWrapper.displayName = "KeyboardWrapper";

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        inner: {
            flex: 1,
        },
    });
