import React, { forwardRef } from "react";
import { ScrollView, ScrollViewProps } from "react-native";

import { cn } from "@/lib/utils";

export interface HorizontalScrollProps extends ScrollViewProps {
    children: React.ReactNode;
    contentClassName?: string;
}

export const HorizontalScroll = forwardRef<ScrollView, HorizontalScrollProps>(
    ({ children, className, contentClassName, ...props }, ref) => {
        return (
            <ScrollView
                ref={ref}
                horizontal
                showsHorizontalScrollIndicator={false}
                className={cn("mt-6 mb-5", className)}
                contentContainerClassName={cn("gap-3 px-4", contentClassName)}
                {...props}
            >
                {children}
            </ScrollView>
        );
    },
);
HorizontalScroll.displayName = "HorizontalScroll";
