import React, { forwardRef, useMemo } from "react";
import { View, StyleSheet } from "react-native";

import { PageScrollView } from "./page-scrollview";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface PageContainerProps {
    children: React.ReactNode;
    topSpacing?: number;
    extraBottom?: number;
    isScrollable?: boolean;
}

export const PageContainer = forwardRef<View, PageContainerProps>(
    (
        {
            children,
            extraBottom = 0,
            topSpacing = 0,
            isScrollable = false,
            style,
            ...props
        },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);

        return (
            <View
                ref={ref}
                style={[
                    styles.container,
                    { paddingTop: topSpacing, paddingBottom: extraBottom },
                    style,
                ]}
                {...props}
            >
                {isScrollable ? (
                    <PageScrollView>{children}</PageScrollView>
                ) : (
                    children
                )}
            </View>
        );
    },
);
PageContainer.displayName = "PageContainer";

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 20,
            backgroundColor: theme.background,
        },
    });
