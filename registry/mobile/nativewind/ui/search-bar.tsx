import React, { forwardRef } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    TextInputProps,
} from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { cn } from "@/lib/utils";

export interface SearchBarProps extends TextInputProps {
    onFilterPress?: () => void;
    containerClassName?: string; // Allows overriding the outer wrapper
}

export const SearchBar = forwardRef<TextInput, SearchBarProps>(
    (
        {
            value,
            onChangeText,
            onFilterPress,
            containerClassName,
            placeholder = "Search...",
            className,
            ...props
        },
        ref,
    ) => {
        return (
            <View
                className={cn(
                    "flex-row items-center bg-surface-muted rounded-2xl px-4 py-1 border-[0.5px] border-border",
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
                    className={cn(
                        "flex-1 text-sm font-medium text-foreground",
                        className,
                    )}
                    {...props}
                />

                {/* Auto-render Clear button if there is text */}
                {!!value && value.length > 0 && (
                    <TouchableOpacity
                        onPress={() => onChangeText?.("")}
                        hitSlop={10}
                        className="ml-2"
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
                        <TouchableOpacity onPress={onFilterPress} hitSlop={10}>
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
