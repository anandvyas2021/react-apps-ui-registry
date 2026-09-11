import React, { useRef, forwardRef, useMemo } from "react";
import {
    Text,
    View,
    Animated,
    PanResponder,
    LayoutChangeEvent,
    ViewProps,
    StyleSheet,
} from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface SlideToActionProps extends ViewProps {
    text?: string;
    onComplete: () => void;
}

const KNOB_SIZE = 54;
const TRACK_PADDING = 6;

export const SlideToAction = forwardRef<
    React.ElementRef<typeof View>,
    SlideToActionProps
>(
    (
        { text = "Swipe right to get started", onComplete, style, ...props },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);

        const pan = useRef(new Animated.Value(0)).current;
        const maxSlideRef = useRef(0);

        const panResponder = useRef(
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onPanResponderMove: (_, gestureState) => {
                    const maxSlide = maxSlideRef.current;
                    if (
                        maxSlide > 0 &&
                        gestureState.dx > 0 &&
                        gestureState.dx <= maxSlide
                    ) {
                        pan.setValue(gestureState.dx);
                    }
                },
                onPanResponderRelease: (_, gestureState) => {
                    const maxSlide = maxSlideRef.current;
                    if (maxSlide > 0 && gestureState.dx > maxSlide * 0.75) {
                        Animated.timing(pan, {
                            toValue: maxSlide,
                            duration: 150,
                            useNativeDriver: true,
                        }).start(() => {
                            onComplete();
                        });
                    } else {
                        Animated.spring(pan, {
                            toValue: 0,
                            useNativeDriver: true,
                            bounciness: 12,
                        }).start();
                    }
                },
            }),
        ).current;

        const handleLayout = (event: LayoutChangeEvent) => {
            const { width } = event.nativeEvent.layout;
            maxSlideRef.current = width - KNOB_SIZE - TRACK_PADDING * 2;
        };

        return (
            <View
                ref={ref}
                style={[styles.container, style]}
                onLayout={handleLayout}
                {...props}
            >
                <View style={styles.textWrapper}>
                    <Text style={styles.text}>{text}</Text>
                    <DynamicIcon
                        name="MoveRight"
                        size={24}
                        color={theme.foreground}
                    />
                </View>

                <Animated.View
                    style={[styles.knob, { transform: [{ translateX: pan }] }]}
                    {...panResponder.panHandlers}
                >
                    <DynamicIcon
                        name="ChevronsRight"
                        size={24}
                        color={theme.primary}
                    />
                </Animated.View>
            </View>
        );
    },
);
SlideToAction.displayName = "SlideToAction";

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            width: "100%",
            height: 66,
            borderRadius: 9999,
            justifyContent: "center",
            paddingHorizontal: TRACK_PADDING,
            backgroundColor: theme.primary,
        },
        textWrapper: {
            position: "absolute",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            marginLeft: 20,
        },
        text: {
            fontSize: 18,
            fontWeight: "600",
            zIndex: 1,
            color: theme.foreground,
        },
        knob: {
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            borderRadius: 9999,
            backgroundColor: theme.foreground,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
        },
    });
