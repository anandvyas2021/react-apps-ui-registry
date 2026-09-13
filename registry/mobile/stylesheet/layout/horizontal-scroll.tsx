import React, { forwardRef, useMemo } from "react";
import { ScrollView, ScrollViewProps, StyleSheet } from "react-native";

export interface HorizontalScrollProps extends ScrollViewProps {
    children: React.ReactNode;
}

export const HorizontalScroll = forwardRef<ScrollView, HorizontalScrollProps>(
    ({ children, style, contentContainerStyle, ...props }, ref) => {
        return (
            <ScrollView
                ref={ref}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[styles.scroll, style]}
                contentContainerStyle={[styles.content, contentContainerStyle]}
                {...props}
            >
                {children}
            </ScrollView>
        );
    },
);
HorizontalScroll.displayName = "HorizontalScroll";

const styles = StyleSheet.create({
    scroll: { marginTop: 24, marginBottom: 20 },
    content: { gap: 12, paddingHorizontal: 16 },
});
