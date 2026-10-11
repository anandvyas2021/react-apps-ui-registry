import React, { forwardRef } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    TextInputProps,
    ViewStyle,
    Platform,
} from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { cn } from "@/lib/utils";

export interface SearchBarProps extends TextInputProps {
    onFilterPress?: () => void;
    containerClassName?: string;
    containerStyle?: ViewStyle;
}

export const SearchBar = forwardRef<TextInput, SearchBarProps>(
    (
        {
            value,
            onChangeText,
            onFilterPress,
            containerClassName,
            containerStyle,
            placeholder = "Search...",
            className,
            style,
            ...props
        },
        ref,
    ) => {
        return (
            <View
                style={containerStyle}
                className={cn(
                    "flex-row items-center bg-surface-muted rounded-2xl px-4 py-1.5 border border-border min-h-[48px]",
                    containerClassName,
                )}
            >
                <DynamicIcon
                    name="Search"
                    size={20}
                    className="text-foreground-muted mr-3"
                />

                <TextInput
                    ref={ref}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#94a3b8"
                    style={[
                        {
                            paddingVertical: Platform.OS === "ios" ? 6 : 2,
                        },
                        style,
                    ]}
                    className={cn(
                        "flex-1 text-sm font-medium text-foreground bg-transparent",
                        className,
                    )}
                    {...props}
                />

                {/* Auto-render Clear button if text exists */}
                {!!value && value.length > 0 && (
                    <TouchableOpacity
                        onPress={() => onChangeText?.("")}
                        hitSlop={10}
                        className="ml-2"
                        activeOpacity={0.7}
                    >
                        <DynamicIcon
                            name="XCircle"
                            size={18}
                            className="text-foreground-muted"
                        />
                    </TouchableOpacity>
                )}

                {/* Auto-render Filter button & Divider if onFilterPress is provided */}
                {onFilterPress && (
                    <>
                        <View className="w-[1px] h-6 bg-border mx-3" />
                        <TouchableOpacity
                            onPress={onFilterPress}
                            hitSlop={10}
                            activeOpacity={0.7}
                        >
                            <DynamicIcon
                                name="SlidersHorizontal"
                                size={20}
                                className="text-foreground"
                            />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        );
    },
);
SearchBar.displayName = "SearchBar";
