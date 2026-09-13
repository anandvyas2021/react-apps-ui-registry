import React, { useState, useEffect, forwardRef, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ViewProps,
    StyleSheet,
} from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

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
        { initialMinutes = 0, initialSeconds = 60, onResend, style, ...props },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);

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
            <View ref={ref} style={[styles.container, style]} {...props}>
                <Text style={styles.prefixText}>Resend code in </Text>
                <TouchableOpacity
                    onPress={handleResendPress}
                    disabled={timeLeft > 0}
                >
                    <Text
                        style={[
                            styles.timerText,
                            timeLeft <= 0 && styles.resendText,
                        ]}
                    >
                        {timeLeft > 0 ? formatTime() : "Resend Now"}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    },
);
CountdownTimer.displayName = "CountdownTimer";

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        },
        prefixText: {
            fontSize: 14,
            fontWeight: "500",
            color: theme.foregroundMuted,
        },
        timerText: {
            fontSize: 16,
            fontWeight: "700",
            color: theme.primary,
        },
        resendText: {
            fontSize: 14,
        },
    });
