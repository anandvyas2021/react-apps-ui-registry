import React from "react";
import { View, ViewProps } from "react-native";
import { useRouter } from "expo-router";
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
    bottomSpacing?: number;
    navigatorOptions?: {
        rightBlock?: [{ name?: string; onPress?: () => void; icon?: string }];
    };
    homeHeaderOptions?: any;
}

export function MainWrapper({
    children,
    homeHeader = false,
    navigatorHeader = true,
    heading,
    topSpacing,
    className,
    fullScreen = false,
    navigatorOptions,
    bottomSpacing = 10,
    homeHeaderOptions,
    ...props
}: MainWrapperProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const safeBottomPadding = Math.min(insets.bottom, bottomSpacing);

    const handleHomeHeaderRedirects = (route: string) => {
        router.push(route);
    };

    return (
        <View
            className={cn("flex-1 bg-background", className)}
            style={{
                paddingTop: fullScreen
                    ? 0
                    : topSpacing
                      ? insets.top + 30
                      : insets.top + 10,
                paddingBottom: fullScreen ? 0 : safeBottomPadding,
            }}
            {...props}
        >
            <View className="flex-1">
                {homeHeader ? (
                    <HomeHeader
                        inMainWrapper
                        homeHeaderOptions={homeHeaderOptions}
                        title="Zudhan"
                        onItemPress={handleHomeHeaderRedirects}
                    />
                ) : navigatorHeader ? (
                    <NavigatorHeader
                        title={heading ?? ""}
                        inMainWrapper
                        navigatorOptions={navigatorOptions}
                    />
                ) : heading ? (
                    <NavigatorHeader
                        title={heading ?? ""}
                        inMainWrapper
                        haveBackButton={false}
                        navigatorOptions={navigatorOptions}
                    />
                ) : null}

                {children}
            </View>
        </View>
    );
}
