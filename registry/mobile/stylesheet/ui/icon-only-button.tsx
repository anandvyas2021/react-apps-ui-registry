import React, { forwardRef, useMemo } from "react";
import {
    TouchableOpacity,
    TouchableOpacityProps,
    StyleSheet,
} from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

import type { IconName } from "@/lib/utils";

export interface IconOnlyButtonProps extends Omit<
    TouchableOpacityProps,
    "style" | "onPress"
> {
    icon: IconName | string;
    onPress: () => void;
    variant?: "default" | "ghost";
    size?: "sm" | "default" | "lg";
    iconColor?: string;
}

export const IconOnlyButton = forwardRef<
    React.ElementRef<typeof TouchableOpacity>,
    IconOnlyButtonProps
>(
    (
        {
            icon,
            variant = "default",
            size = "default",
            iconColor,
            onPress,
            ...props
        },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);

        const iconSize = size === "sm" ? 20 : size === "lg" ? 32 : 24;

        return (
            <TouchableOpacity
                ref={ref}
                activeOpacity={0.7}
                style={[
                    styles.base,
                    styles[`${size}Size`],
                    styles[`${variant}Styles`],
                ]}
                onPress={onPress}
                {...props}
            >
                <DynamicIcon
                    name={icon as string}
                    size={iconSize}
                    color={iconColor || theme.foregroundMuted}
                />
            </TouchableOpacity>
        );
    },
);
IconOnlyButton.displayName = "IconOnlyButton";

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        base: {
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
        },
        sm: { width: 48, height: 48, borderRadius: 12 },
        defaultSize: { width: 64, height: 64, borderRadius: 16 },
        lg: { width: 80, height: 80, borderRadius: 24 },
        defaultStyles: {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        ghost: {
            backgroundColor: "transparent",
            borderColor: "transparent",
        },
    });
