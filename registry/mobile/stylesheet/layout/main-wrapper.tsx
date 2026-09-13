import React, { useMemo } from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HomeHeader } from "./home-header";
import { NavigatorHeader } from "./navigator-header";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface MainWrapperProps extends ViewProps {
    children: React.ReactNode;
    homeHeader?: boolean;
    navigatorHeader?: boolean;
    heading?: string;
    topSpacing?: boolean;
    style: any;
    fullScreen?: boolean;
}

export function MainWrapper({
    children,
    homeHeader = false,
    navigatorHeader = true,
    heading,
    topSpacing,
    fullScreen = false,
    style,
    ...props
}: MainWrapperProps) {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const safeBottomPadding = Math.max(insets.bottom, 10);

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: fullScreen
                        ? 0
                        : topSpacing
                          ? insets.top + 30
                          : insets.top + 16,
                    paddingBottom: fullScreen ? 0 : safeBottomPadding,
                },
                style,
            ]}
            {...props}
        >
            <View style={styles.inner}>
                {homeHeader ? (
                    <HomeHeader inMainWrapper />
                ) : navigatorHeader ? (
                    <NavigatorHeader title={heading ?? ""} inMainWrapper />
                ) : heading ? (
                    <NavigatorHeader
                        title={heading ?? ""}
                        inMainWrapper
                        haveBackButton={false}
                    />
                ) : null}

                {children}
            </View>
        </View>
    );
}

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
