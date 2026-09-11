import React, { forwardRef, useMemo } from "react";
import {
    Pressable,
    Text,
    PressableProps,
    StyleSheet,
    View,
} from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";
import type { IconName } from "@/lib/utils";

export interface IconChipProps extends Omit<PressableProps, "style"> {
    label: string;
    icon?: IconName;
    iconPosition?: "pre" | "post";
    variant?: "primary" | "success" | "destructive" | "warning" | "muted";
    copyable?: boolean;
}

export const IconChip = forwardRef<
    React.ElementRef<typeof View>,
    IconChipProps
>(
    (
        {
            label,
            variant = "primary",
            icon,
            iconPosition = "pre",
            copyable = false,
            onPress,
            ...props
        },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);

        const handlePress = (e: any) => {
            if (copyable) {
                console.log(`Copied: ${label}`);
            }
            if (onPress) onPress(e);
        };

        const variantStyles = styles[variant];

        return (
            <Pressable
                ref={ref}
                onPress={handlePress}
                disabled={!copyable && !onPress}
                style={[
                    styles.base,
                    variantStyles.container,
                    iconPosition === "post" && styles.reverse,
                ]}
                {...props}
            >
                {icon && (
                    <DynamicIcon
                        name={icon as string}
                        size={14}
                        color={variantStyles.color}
                    />
                )}
                <Text style={[styles.text, { color: variantStyles.color }]}>
                    {label}
                </Text>
            </Pressable>
        );
    },
);
IconChip.displayName = "IconChip";

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        base: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 9999,
            borderWidth: 1,
            alignSelf: "flex-start",
        },
        reverse: {
            flexDirection: "row-reverse",
        },
        text: {
            fontSize: 12,
            fontWeight: "800",
        },
        primary: {
            container: {
                backgroundColor: `${theme.primaryLighter}`,
                borderColor: `${theme.primary}`,
            },
            color: theme.primary,
        },
        success: {
            container: {
                backgroundColor: `${theme.successBackground}`,
                borderColor: `${theme.success}`,
            },
            color: theme.success,
        },
        warning: {
            container: {
                backgroundColor: `${theme.warning}`,
                borderColor: `${theme.warning}`,
            },
            color: theme.warning,
        },
        destructive: {
            container: {
                backgroundColor: `${theme.destructiveBackground}`,
                borderColor: `${theme.destructive}`,
            },
            color: theme.destructive,
        },
        muted: {
            container: {
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.border,
            },
            color: theme.foregroundMuted,
        },
    });
