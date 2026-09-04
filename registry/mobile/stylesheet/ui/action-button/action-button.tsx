import React, { useMemo } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
    TextStyle,
} from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

import { DynamicIcon } from "../dynamic-icon/dynamic-icon";
import { WaveDotsLoader } from "../wave-dots-loader/wave-dots-loader";

export interface ActionButtonProps extends TouchableOpacityProps {
    title: string;
    icon?: string;
    variant?: "primary" | "secondary";
    iconPosition?: "pre" | "post";
    isLoading?: boolean;
    extraStyles?: ViewStyle;
    textStyles?: TextStyle;
    borderRadius?: number;
}

export const ActionButton = React.forwardRef<
    React.ElementRef<typeof TouchableOpacity>,
    ActionButtonProps
>(
    (
        {
            title,
            icon,
            onPress,
            disabled,
            variant = "primary",
            iconPosition = "post",
            isLoading = false,
            extraStyles,
            textStyles,
            borderRadius = 30,
            ...props
        },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);
        const isDisabled = disabled || isLoading;
        const isSecondary = variant === "secondary";

        const iconColor = isDisabled
            ? theme.colors.foregroundDisabled
            : isSecondary
              ? theme.colors.secondary.foreground
              : theme.colors.primary.foreground;

        return (
            <TouchableOpacity
                ref={ref}
                style={[
                    styles.actionButton,
                    { borderRadius },
                    isSecondary && styles.actionButtonSecondary,
                    isDisabled && styles.actionButtonDisabled,
                    extraStyles,
                ]}
                onPress={onPress}
                activeOpacity={0.8}
                disabled={isDisabled}
                {...props}
            >
                {isLoading ? (
                    <WaveDotsLoader />
                ) : (
                    <>
                        {icon && iconPosition === "pre" && (
                            <DynamicIcon
                                name={icon}
                                size={20}
                                color={iconColor}
                            />
                        )}
                        <Text
                            style={[
                                styles.actionButtonText,
                                isSecondary && styles.actionButtonTextSecondary,
                                isDisabled && styles.disabledButtonText,
                                textStyles,
                            ]}
                        >
                            {title}
                        </Text>
                        {icon && iconPosition === "post" && (
                            <DynamicIcon
                                name={icon}
                                size={20}
                                color={iconColor}
                            />
                        )}
                    </>
                )}
            </TouchableOpacity>
        );
    },
);
ActionButton.displayName = "ActionButton";

const createStyles = (theme: any) =>
    StyleSheet.create({
        actionButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.primary.DEFAULT,
            paddingVertical: 16,
            gap: 8,
            width: "100%",
            marginBottom: 12,
        },
        actionButtonSecondary: {
            backgroundColor: theme.colors.secondary.DEFAULT,
            borderWidth: 1,
            borderColor: theme.colors.secondary.foreground,
        },
        actionButtonText: {
            color: theme.colors.primary.foreground,
            fontSize: 14,
            fontFamily: "Inter_700Bold",
        },
        actionButtonTextSecondary: { color: theme.colors.secondary.foreground },
        actionButtonDisabled: {
            backgroundColor: theme.colors.surface.muted,
            borderColor: "transparent",
            opacity: 0.5,
        },
        disabledButtonText: { color: theme.colors.foregroundDisabled },
    });
