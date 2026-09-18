import React, { forwardRef } from "react";
import { View, ViewProps } from "react-native";

import { PageScrollView } from "./page-scrollview";

import { cn } from "@/lib/utils";

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
            className,
            style,
            ...props
        },
        ref,
    ) => {
        return (
            <View
                ref={ref}
                className={cn("flex-1 px-5 bg-background", className)}
                style={[
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
