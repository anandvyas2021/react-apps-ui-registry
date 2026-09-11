import React, { useState, useEffect, forwardRef } from "react";
import { View, Text, TouchableOpacity, ViewProps } from "react-native";

import { cn } from "@/lib/utils";

export interface CountdownTimerProps extends ViewProps {
    initialMinutes?: number;
    initialSeconds?: number;
    onResend: () => void;
}

export const CountdownTimer = forwardRef<
    React.ElementRef<typeof View>,
    CountdownTimerProps
>(
    (
        {
            initialMinutes = 0,
            initialSeconds = 60,
            onResend,
            className,
            ...props
        },
        ref,
    ) => {
        const totalStartingSeconds = initialMinutes * 60 + initialSeconds;
        const [timeLeft, setTimeLeft] = useState(totalStartingSeconds);

        useEffect(() => {
            if (timeLeft <= 0) return;

            const interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        }, [timeLeft]);

        const handleResendPress = () => {
            setTimeLeft(totalStartingSeconds);
            onResend();
        };

        const formatTime = () => {
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        };

        return (
            <View
                ref={ref}
                className={cn(
                    "flex-row items-center justify-center",
                    className,
                )}
                {...props}
            >
                <Text className="text-sm text-foreground-muted">
                    Resend code in{" "}
                </Text>
                <TouchableOpacity
                    onPress={handleResendPress}
                    disabled={timeLeft > 0}
                >
                    <Text
                        className={cn(
                            "font-bold text-primary",
                            timeLeft > 0 ? "text-base" : "text-sm",
                        )}
                    >
                        {timeLeft > 0 ? formatTime() : "Resend Now"}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    },
);
CountdownTimer.displayName = "CountdownTimer";
