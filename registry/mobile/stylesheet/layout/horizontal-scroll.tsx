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
    scroll: { flexGrow: 0, marginVertical: 8, marginBottom: 10 },
    content: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 4,
    },
});
