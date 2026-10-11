import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    forwardRef,
} from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";
import type { IconName } from "@/lib/utils";

const SEC_IN_MIN = 60;
const SEC_IN_HOUR = 3600;
const SEC_IN_DAY = 86400;
const SEC_IN_MONTH = 2592000;
const SEC_IN_YEAR = 31536000;

export type CountdownTimerVariant = "plain" | "badge" | "pill" | "boxes";
export type CountdownTimerIntent =
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "destructive";
export type CountdownTimerSize = "xs" | "sm" | "default" | "lg";

export interface CountdownTimerProps {
    initialYears?: number;
    initialMonths?: number;
    initialDays?: number;
    initialHours?: number;
    initialMinutes?: number;
    initialSeconds?: number;
    targetDate?: Date | string;
    variant?: CountdownTimerVariant;
    intent?: CountdownTimerIntent;
    size?: CountdownTimerSize;
    format?: "colon" | "units";
    maxUnits?: number;
    padZero?: boolean;
    showSeconds?: boolean;
    icon?: IconName | string;
    timerText?: string;
    expiredText?: string;
    onResend?: () => void;
    onComplete?: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    labelStyle?: TextStyle;
}

export const CountdownTimer = forwardRef<
    React.ElementRef<typeof View>,
    CountdownTimerProps
>(
    (
        {
            initialYears = 0,
            initialMonths = 0,
            initialDays = 0,
            initialHours = 0,
            initialMinutes = 0,
            initialSeconds = 0,
            targetDate,
            variant = "plain",
            intent = "primary",
            size = "default",
            format,
            maxUnits,
            padZero = false,
            showSeconds = true,
            icon,
            timerText,
            expiredText,
            onResend,
            onComplete,
            style,
            textStyle,
            labelStyle,
        },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);
        const resolvedFormat = format ?? (onResend ? "colon" : "units");

        const calculateInitialSeconds = useCallback(() => {
            if (targetDate) {
                const target =
                    targetDate instanceof Date
                        ? targetDate.getTime()
                        : new Date(targetDate).getTime();
                return Math.max(0, Math.floor((target - Date.now()) / 1000));
            }

            const hasAnyInitial =
                initialYears > 0 ||
                initialMonths > 0 ||
                initialDays > 0 ||
                initialHours > 0 ||
                initialMinutes > 0 ||
                initialSeconds > 0;

            if (!hasAnyInitial) return 60;

            return (
                initialYears * SEC_IN_YEAR +
                initialMonths * SEC_IN_MONTH +
                initialDays * SEC_IN_DAY +
                initialHours * SEC_IN_HOUR +
                initialMinutes * SEC_IN_MIN +
                initialSeconds
            );
        }, [
            targetDate,
            initialYears,
            initialMonths,
            initialDays,
            initialHours,
            initialMinutes,
            initialSeconds,
        ]);

        const [timeLeft, setTimeLeft] = useState<number>(
            calculateInitialSeconds,
        );

        useEffect(() => {
            setTimeLeft(calculateInitialSeconds());
        }, [calculateInitialSeconds]);

        useEffect(() => {
            if (timeLeft <= 0) return;

            const interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        onComplete?.();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }, [timeLeft > 0, onComplete]);

        const handleResendPress = () => {
            if (timeLeft > 0 || !onResend) return;
            setTimeLeft(calculateInitialSeconds());
            onResend();
        };

        const timeUnits = useMemo(() => {
            let remaining = timeLeft;

            const years = Math.floor(remaining / SEC_IN_YEAR);
            remaining %= SEC_IN_YEAR;

            const months = Math.floor(remaining / SEC_IN_MONTH);
            remaining %= SEC_IN_MONTH;

            const days = Math.floor(remaining / SEC_IN_DAY);
            remaining %= SEC_IN_DAY;

            const hours = Math.floor(remaining / SEC_IN_HOUR);
            remaining %= SEC_IN_HOUR;

            const minutes = Math.floor(remaining / SEC_IN_MIN);
            const seconds = remaining % SEC_IN_MIN;

            const raw = [
                { key: "y", value: years },
                { key: "mo", value: months },
                { key: "d", value: days },
                { key: "h", value: hours },
                { key: "m", value: minutes },
                ...(showSeconds ? [{ key: "s", value: seconds }] : []),
            ];

            const minKeep = resolvedFormat === "colon" ? 2 : 1;
            const firstNonZeroIdx = raw.findIndex((u) => u.value > 0);
            const sliceStart =
                firstNonZeroIdx === -1
                    ? Math.max(0, raw.length - minKeep)
                    : Math.min(
                          firstNonZeroIdx,
                          Math.max(0, raw.length - minKeep),
                      );

            const active = raw.slice(sliceStart);
            return maxUnits ? active.slice(0, maxUnits) : active;
        }, [timeLeft, showSeconds, resolvedFormat, maxUnits]);

        const formattedString = useMemo(() => {
            if (resolvedFormat === "colon") {
                return timeUnits
                    .map((u) => String(u.value).padStart(2, "0"))
                    .join(":");
            }
            return timeUnits
                .map((u) => {
                    const val = padZero
                        ? String(u.value).padStart(2, "0")
                        : String(u.value);
                    return `${val}${u.key}`;
                })
                .join(" ");
        }, [timeUnits, resolvedFormat, padZero]);

        const iconSize =
            size === "xs" ? 10 : size === "sm" ? 12 : size === "lg" ? 16 : 14;

        const isExpired = timeLeft <= 0;
        const fallbackExpiredText = onResend
            ? "Resend Now"
            : expiredText || formattedString;

        const colorMap = {
            default: {
                text: theme.foreground,
                bg: theme.surfaceMuted,
                border: theme.border,
            },
            primary: {
                text: theme.primary,
                bg: `${theme.primary}1A`,
                border: `${theme.primary}33`,
            },
            success: {
                text: "#10B981",
                bg: "rgba(16, 185, 129, 0.1)",
                border: "rgba(16, 185, 129, 0.3)",
            },
            warning: {
                text: "#F59E0B",
                bg: "rgba(245, 158, 11, 0.1)",
                border: "rgba(245, 158, 11, 0.3)",
            },
            destructive: {
                text: theme.destructive,
                bg: `${theme.destructive}1A`,
                border: `${theme.destructive}33`,
            },
        };

        const activeColors = colorMap[intent];

        const containerShapeStyle = [
            styles.baseContainer,
            styles[`size_${size}`],
            variant === "badge" && [
                styles.variant_badge,
                {
                    backgroundColor: activeColors.bg,
                    borderColor: activeColors.border,
                },
            ],
            variant === "pill" && [
                styles.variant_pill,
                {
                    backgroundColor: activeColors.bg,
                    borderColor: activeColors.border,
                },
            ],
            (variant === "plain" || variant === "boxes") &&
                styles.variant_plain,
            style,
        ];

        return (
            <View ref={ref} style={containerShapeStyle}>
                {icon && (
                    <DynamicIcon
                        name={icon as string}
                        size={iconSize}
                        color={activeColors.text}
                    />
                )}
                {timerText && (
                    <Text
                        style={[
                            styles.labelText,
                            styles[`label_${size}`],
                            labelStyle,
                        ]}
                    >
                        {timerText}{" "}
                    </Text>
                )}

                {variant === "boxes" && !isExpired ? (
                    <View style={styles.boxesRow}>
                        {timeUnits.map((unit) => (
                            <View
                                key={unit.key}
                                style={[
                                    styles.boxUnit,
                                    styles[`boxUnit_${size}`],
                                    {
                                        backgroundColor: activeColors.bg,
                                        borderColor: activeColors.border,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.timerText,
                                        styles[`text_${size}`],
                                        { color: activeColors.text },
                                        textStyle,
                                    ]}
                                >
                                    {padZero
                                        ? String(unit.value).padStart(2, "0")
                                        : unit.value}
                                    <Text style={styles.unitKeyText}>
                                        {unit.key}
                                    </Text>
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Pressable
                        onPress={handleResendPress}
                        disabled={!isExpired || !onResend}
                    >
                        <Text
                            style={[
                                styles.timerText,
                                styles[`text_${size}`],
                                { color: activeColors.text },
                                isExpired && onResend && styles.underline,
                                textStyle,
                            ]}
                        >
                            {isExpired ? fallbackExpiredText : formattedString}
                        </Text>
                    </Pressable>
                )}
            </View>
        );
    },
);
CountdownTimer.displayName = "CountdownTimer";

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        baseContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        },
        size_xs: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            gap: 4,
        },
        size_sm: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            gap: 6,
        },
        size_default: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            gap: 6,
        },
        size_lg: {
            paddingHorizontal: 14,
            paddingVertical: 6,
            gap: 8,
        },
        variant_plain: {
            backgroundColor: "transparent",
            borderWidth: 0,
            paddingHorizontal: 0,
            paddingVertical: 0,
        },
        variant_badge: {
            borderRadius: 6,
            borderWidth: 1,
        },
        variant_pill: {
            borderRadius: 9999,
            borderWidth: 1,
        },
        boxesRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
        },
        boxUnit: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            borderWidth: 1,
        },
        boxUnit_xs: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            minWidth: 26,
        },
        boxUnit_sm: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            minWidth: 32,
        },
        boxUnit_default: {
            paddingHorizontal: 10,
            paddingVertical: 6,
            minWidth: 40,
        },
        boxUnit_lg: {
            paddingHorizontal: 12,
            paddingVertical: 8,
            minWidth: 48,
        },
        labelText: {
            color: theme.foregroundMuted,
        },
        label_xs: {
            fontSize: 10,
        },
        label_sm: {
            fontSize: 12,
        },
        label_default: {
            fontSize: 14,
        },
        label_lg: {
            fontSize: 16,
        },
        timerText: {
            fontWeight: "700",
            fontVariant: ["tabular-nums"],
            letterSpacing: -0.2,
        },
        text_xs: {
            fontSize: 10,
        },
        text_sm: {
            fontSize: 12,
        },
        text_default: {
            fontSize: 14,
        },
        text_lg: {
            fontSize: 16,
        },
        unitKeyText: {
            fontSize: 10,
            fontWeight: "600",
            opacity: 0.75,
        },
        underline: {
            textDecorationLine: "underline",
        },
    });
