import React, { forwardRef, useMemo } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    TextInputProps,
    StyleSheet,
    ViewStyle,
} from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface SearchBarProps extends TextInputProps {
    onFilterPress?: () => void;
    containerStyle?: ViewStyle;
}

export const SearchBar = forwardRef<TextInput, SearchBarProps>(
    (
        {
            value,
            onChangeText,
            onFilterPress,
            containerStyle,
            placeholder = "Search...",
            style,
            ...props
        },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);

        return (
            <View style={[styles.container, containerStyle]}>
                <DynamicIcon
                    name="Search"
                    size={20}
                    color={theme.mutedForeground}
                    style={styles.searchIcon}
                />

                <TextInput
                    ref={ref}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.mutedForeground}
                    style={[styles.input, style]}
                    {...props}
                />

                {!!value && value.length > 0 && (
                    <TouchableOpacity
                        onPress={() => onChangeText?.("")}
                        hitSlop={10}
                        style={styles.iconButton}
                    >
                        <DynamicIcon
                            name="XCircle"
                            size={18}
                            color={theme.mutedForeground}
                        />
                    </TouchableOpacity>
                )}

                {onFilterPress && (
                    <>
                        <View style={styles.divider} />
                        <TouchableOpacity
                            onPress={onFilterPress}
                            hitSlop={10}
                            style={styles.iconButton}
                        >
                            <DynamicIcon
                                name="SlidersHorizontal"
                                size={20}
                                color={theme.foreground}
                            />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        );
    },
);
SearchBar.displayName = "SearchBar";

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.surfaceMuted,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 4,
            borderWidth: 0.5,
            borderColor: theme.border,
        },
        searchIcon: {
            marginRight: 12,
        },
        input: {
            flex: 1,
            fontSize: 14,
            fontWeight: "700",
            color: theme.foreground,
            height: "100%",
        },
        iconButton: {
            marginLeft: 8,
        },
        divider: {
            width: 1,
            height: 24,
            backgroundColor: theme.border,
            marginHorizontal: 12,
        },
    });
