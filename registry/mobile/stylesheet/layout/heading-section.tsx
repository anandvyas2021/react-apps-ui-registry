import React, { useMemo } from "react";
import { Text, View, StyleSheet, ViewStyle } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface HeadingSectionProps {
    title?: string;
    desc?: string;
    children?: React.ReactNode;
    style?: ViewStyle;
}

export function HeadingSection({
    title,
    desc,
    children,
    style,
}: HeadingSectionProps) {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={[styles.container, style]}>
            <Text style={styles.title}>{title}</Text>
            {children ? (
                <>{children}</>
            ) : (
                <Text style={styles.desc}>{desc}</Text>
            )}
        </View>
    );
}

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            width: "100%",
            alignItems: "center",
        },
        title: {
            fontSize: 30,
            marginVertical: 12,
            fontWeight: "700",
            letterSpacing: -0.5,
            color: theme.foreground,
        },
        desc: {
            textAlign: "center",
            fontSize: 14,
            fontWeight: "500",
            color: theme.foregroundMuted,
        },
    });
