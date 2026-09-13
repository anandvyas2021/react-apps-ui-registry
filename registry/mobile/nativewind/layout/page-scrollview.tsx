import React, { forwardRef } from "react";
import { ScrollView, ScrollViewProps } from "react-native";

import { cn } from "@/lib/utils";

export interface PageScrollViewProps extends ScrollViewProps {
    children: React.ReactNode;
    nestedScroll?: boolean;
}

export const PageScrollView = forwardRef<ScrollView, PageScrollViewProps>(
    (
        { children, nestedScroll, className, contentContainerStyle, ...props },
        ref,
    ) => {
        return (
            <ScrollView
                ref={ref}
                className={cn("flex-1", className)}
                contentContainerStyle={[
                    { flexGrow: 1, paddingTop: 10, paddingBottom: 20 },
                    contentContainerStyle,
                ]}
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
