import React, { useRef, forwardRef } from "react";
import {
    Text,
    View,
    Animated,
    PanResponder,
    LayoutChangeEvent,
    ViewProps,
} from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn } from "@/lib/utils";

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
        {
            text = "Swipe right to get started",
            onComplete,
            className,
            ...props
        },
        ref,
    ) => {
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
                className={cn(
                    "w-full h-[66px] rounded-full justify-center px-[6px] bg-primary",
                    className,
                )}
                onLayout={handleLayout}
                {...props}
            >
                <View className="absolute flex-row items-center justify-center gap-2 w-full text-center ml-5">
                    <Text className="text-lg font-semibold z-[1] text-foreground">
                        {text}
                    </Text>
                    <DynamicIcon
                        name="MoveRight"
                        size={24}
                        className="text-foreground"
                    />
                </View>

                <Animated.View
                    className="w-[54px] h-[54px] rounded-full bg-foreground justify-center items-center shadow-md shadow-black/20"
                    style={[{ transform: [{ translateX: pan }], elevation: 3 }]}
                    {...panResponder.panHandlers}
                >
                    <DynamicIcon
                        name="ChevronsRight"
                        size={24}
                        className="text-primary"
                    />
                </Animated.View>
            </View>
        );
    },
);
SlideToAction.displayName = "SlideToAction";
