import React from "react";
import { Text, View } from "react-native";

import { cn } from "@/lib/utils";

export interface HeadingSectionProps {
    title?: string;
    desc?: string;
    children?: React.ReactNode;
    className?: string;
}

export function HeadingSection({
    title,
    desc,
    children,
    className,
}: HeadingSectionProps) {
    return (
        <View className={cn("w-full items-center", className)}>
            <Text className="text-3xl my-3 font-bold tracking-tight text-foreground">
                {title}
            </Text>
            {children ? (
                <>{children}</>
            ) : (
                <Text className="text-center text-sm font-medium text-foreground-muted">
                    {desc}
                </Text>
            )}
        </View>
    );
}
