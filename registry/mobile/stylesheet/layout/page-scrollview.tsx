import React, { forwardRef } from "react";
import { ScrollView, ScrollViewProps, StyleSheet } from "react-native";

export interface PageScrollViewProps extends ScrollViewProps {
    children: React.ReactNode;
    nestedScroll?: boolean;
}

export const PageScrollView = forwardRef<ScrollView, PageScrollViewProps>(
    (
        { children, nestedScroll, style, contentContainerStyle, ...props },
        ref,
    ) => {
        return (
            <ScrollView
                ref={ref}
                style={[styles.container, style]}
                contentContainerStyle={[styles.content, contentContainerStyle]}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={nestedScroll}
                contentInsetAdjustmentBehavior={
                    nestedScroll ? "automatic" : "never"
                }
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                {...props}
            >
                {children}
            </ScrollView>
        );
    },
);
PageScrollView.displayName = "PageScrollView";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingTop: 10,
        paddingBottom: 20,
    },
});
