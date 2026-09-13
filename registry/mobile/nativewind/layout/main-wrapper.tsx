import React from "react";
import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HomeHeader } from "./home-header";
import { NavigatorHeader } from "./navigator-header";

import { cn } from "@/lib/utils";

export interface MainWrapperProps extends ViewProps {
    children: React.ReactNode;
    homeHeader?: boolean;
    navigatorHeader?: boolean;
    heading?: string;
    topSpacing?: boolean;
    className?: string;
    fullScreen?: boolean;
}

export function MainWrapper({
    children,
    homeHeader = false,
    navigatorHeader = true,
    heading,
    topSpacing,
    className,
    fullScreen = false,
    ...props
}: MainWrapperProps) {
    const insets = useSafeAreaInsets();
    const safeBottomPadding = Math.max(insets.bottom, 10);

    return (
        <View
            className={cn("flex-1 bg-background", className)}
            style={{
                paddingTop: fullScreen
                    ? 0
                    : topSpacing
                      ? insets.top + 30
                      : insets.top + 16,
                paddingBottom: fullScreen ? 0 : safeBottomPadding,
            }}
            {...props}
        >
            <View className="flex-1">
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
