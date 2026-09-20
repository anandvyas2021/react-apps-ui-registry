import React, { forwardRef } from "react";
import { ScrollView, ScrollViewProps } from "react-native";

import { cn } from "@/lib/utils";

export interface HorizontalScrollProps extends ScrollViewProps {
    children: React.ReactNode;
    contentClassName?: string;
}

export const HorizontalScroll = forwardRef<ScrollView, HorizontalScrollProps>(
    ({ children, className, contentClassName, style, ...props }, ref) => {
        return (
            <ScrollView
                ref={ref}
                horizontal
                showsHorizontalScrollIndicator={false}
                // flex-grow-0 prevents the ScrollView from expanding vertically
                className={cn("my-2 flex-grow-0", className)}
                style={[{ flexGrow: 0 }, style]}
                contentContainerClassName={cn(
                    "flex-row items-center gap-2.5 px-1",
                    contentClassName,
                )}
                {...props}
            >
                {children}
            </ScrollView>
        );
    },
);
HorizontalScroll.displayName = "HorizontalScroll";
