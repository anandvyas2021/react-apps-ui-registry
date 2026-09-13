import React, { useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ViewProps,
    StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface NavigatorHeaderProps extends ViewProps {
    title?: string;
    haveBackButton?: boolean;
    inMainWrapper?: boolean;
    onBackPress?: () => void;
}

export function NavigatorHeader({
    title,
    haveBackButton = true,
    inMainWrapper = true,
    onBackPress,
    style,
    ...props
}: NavigatorHeaderProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const handleBack = () => {
        if (onBackPress) onBackPress();
        else router.back();
    };

    return (
        <View
            style={[
                styles.container,
                { paddingTop: inMainWrapper ? 0 : insets.top + 16 },
                style,
            ]}
            {...props}
        >
            {haveBackButton ? (
                <TouchableOpacity
                    onPress={handleBack}
                    activeOpacity={0.7}
                    style={styles.backButton}
                >
                    <DynamicIcon
                        name="ArrowLeft"
                        size={20}
                        color={theme.foreground}
                    />
                </TouchableOpacity>
            ) : (
                <View style={styles.spacer} />
            )}

            <Text
                style={[
                    styles.title,
                    {
                        color: haveBackButton
                            ? theme.foreground
                            : theme.primary,
                    },
                ]}
            >
                {title}
            </Text>

            <View style={styles.spacer} />
        </View>
    );
}

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 8,
            paddingHorizontal: 24,
            backgroundColor: "transparent",
            zIndex: 10,
        },
        backButton: {
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            backgroundColor: theme.surface,
        },
        spacer: {
            width: 48,
            height: 48,
        },
        title: {
            fontSize: 18,
            fontWeight: "700",
        },
    });
