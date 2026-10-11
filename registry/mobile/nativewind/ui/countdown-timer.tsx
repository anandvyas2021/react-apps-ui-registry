import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    forwardRef,
} from "react";
import { View, Text, Pressable, ViewProps, TextStyle } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { cn, type IconName } from "@/lib/utils";

// --- Time Constants (in seconds) ---
const SEC_IN_MIN = 60;
const SEC_IN_HOUR = 3600;
const SEC_IN_DAY = 86400;
const SEC_IN_MONTH = 2592000; // 30 days
const SEC_IN_YEAR = 31536000; // 365 days

// --- CVA Definitions ---
const containerVariants = cva("flex-row items-center justify-center", {
    variants: {
        variant: {
            plain: "bg-transparent",
            badge: "rounded-md border",
            pill: "rounded-full border",
            boxes: "gap-1.5",
        },
        intent: {
            default: "border-border bg-surface-muted",
            primary: "border-primary/20 bg-primary/10",
            success: "border-emerald-500/20 bg-emerald-500/10",
            warning: "border-amber-500/20 bg-amber-500/10",
            destructive: "border-destructive/20 bg-destructive/10",
        },
        size: {
            xs: "px-1.5 py-0.5 gap-1",
            sm: "px-2 py-1 gap-1.5",
            default: "px-2.5 py-1 gap-1.5",
            lg: "px-3.5 py-1.5 gap-2",
        },
    },
    compoundVariants: [
        {
            variant: ["plain", "boxes"],
            className: "bg-transparent border-0 px-0 py-0",
        },
    ],
    defaultVariants: {
        variant: "plain",
        intent: "primary",
        size: "default",
    },
});

const timerTextVariants = cva("font-bold tracking-tight tabular-nums", {
    variants: {
        intent: {
            default: "text-foreground",
            primary: "text-primary",
            success: "text-emerald-500",
            warning: "text-amber-500",
            destructive: "text-destructive",
        },
        size: {
            xs: "text-[10px]",
            sm: "text-xs",
            default: "text-sm",
            lg: "text-base",
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "default",
    },
});

const boxUnitVariants = cva("items-center justify-center rounded-lg border", {
    variants: {
        intent: {
            default: "bg-surface border-border",
            primary: "bg-primary/10 border-primary/30",
            success: "bg-emerald-500/10 border-emerald-500/30",
            warning: "bg-amber-500/10 border-amber-500/30",
            destructive: "bg-destructive/10 border-destructive/30",
        },
        size: {
            xs: "px-1.5 py-0.5 min-w-[26px]",
            sm: "px-2 py-1 min-w-[32px]",
            default: "px-2.5 py-1.5 min-w-[40px]",
            lg: "px-3 py-2 min-w-[48px]",
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "default",
    },
});

export interface CountdownTimerProps
    extends ViewProps, VariantProps<typeof containerVariants> {
    initialYears?: number;
    initialMonths?: number;
    initialDays?: number;
    initialHours?: number;
    initialMinutes?: number;
    initialSeconds?: number;
    targetDate?: Date | string;
    format?: "colon" | "units";
    maxUnits?: number;
    padZero?: boolean;
    showSeconds?: boolean;
    icon?: IconName | string;

    timerText?: string;
    expiredText?: string;
    onResend?: () => void;
    onComplete?: () => void;

    className?: string;
    textClassName?: string;
    labelClassName?: string;
    textStyle?: TextStyle;
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
            className,
            textClassName,
            labelClassName,
            style,
            textStyle,
            ...props
        },
        ref,
    ) => {
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

        return (
            <View
                ref={ref}
                className={cn(
                    containerVariants({ variant, intent, size }),
                    className,
                )}
                style={style}
                {...props}
            >
                {icon && (
                    <DynamicIcon
                        name={icon as string}
                        size={iconSize}
                        className={cn(
                            timerTextVariants({ intent, size }),
                            textClassName,
                        )}
                    />
                )}
                {timerText && (
                    <Text
                        className={cn(
                            "text-foreground-muted",
                            size === "xs"
                                ? "text-[10px]"
                                : size === "sm"
                                  ? "text-xs"
                                  : "text-sm",
                            labelClassName,
                        )}
                    >
                        {timerText}{" "}
                    </Text>
                )}

                {variant === "boxes" && !isExpired ? (
                    <View className="flex-row items-center gap-1.5">
                        {timeUnits.map((unit) => (
                            <View
                                key={unit.key}
                                className={boxUnitVariants({ intent, size })}
                            >
                                <Text
                                    style={textStyle}
                                    className={cn(
                                        timerTextVariants({ intent, size }),
                                        textClassName,
                                    )}
                                >
                                    {padZero
                                        ? String(unit.value).padStart(2, "0")
                                        : unit.value}
                                    <Text className="text-[10px] font-semibold opacity-75">
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
                            style={textStyle}
                            className={cn(
                                timerTextVariants({ intent, size }),
                                isExpired && onResend && "underline",
                                textClassName,
                            )}
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
