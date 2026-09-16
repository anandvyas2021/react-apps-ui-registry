import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

export interface NavigatorHeaderProps {
    title?: string;
    haveBackButton?: boolean;
    inMainWrapper?: boolean;
    onBackPress?: () => void;
    navigatorOptions?: {
        rightBlock?: [{ name?: string; onPress?: () => void; icon?: string }];
    };
}

export function NavigatorHeader({
    title,
    haveBackButton = true,
    inMainWrapper = true,
    onBackPress,
    style,
    navigatorOptions,
    ...props
}: NavigatorHeaderProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const handleBack = () => {
        if (onBackPress) onBackPress();
        else router.back();
    };

    return (
        <View
            style={[
                styles.container,
                { paddingTop: inMainWrapper ? 0 : insets.top + 16 },
                style,
            ]}
            {...props}
        >
            <View style={styles.leftBlock}>
                {haveBackButton && (
                    <TouchableOpacity
                        onPress={handleBack}
                        activeOpacity={0.7}
                        style={styles.backButton}
                    >
                        <DynamicIcon
                            name="ArrowLeft"
                            size={20}
                            color={theme.foreground}
                            className="text-foreground"
                        />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.centralBlock}>
                {title && (
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.title,
                            {
                                color: haveBackButton
                                    ? theme.foreground
                                    : theme.primary,
                            },
                        ]}
                    >
                        {title}
                    </Text>
                )}
            </View>
            <View style={styles.rightBlockStyles}>
                {navigatorOptions?.rightBlock?.length &&
                    navigatorOptions?.rightBlock?.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={item?.onPress}
                                activeOpacity={0.7}
                                style={styles.rightBlockItems}
                            >
                                {item?.name ? (
                                    <DynamicIcon
                                        name={item?.icon as string}
                                        size={20}
                                        color={theme.primary}
                                        className="text-primary"
                                    />
                                ) : item?.name ? (
                                    <Text style={styles.rightBlockNames}>
                                        {item.name}
                                    </Text>
                                ) : null}
                            </TouchableOpacity>
                        );
                    })}
            </View>
        </View>
    );
}

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 8,
            paddingHorizontal: 24,
            backgroundColor: "transparent",
            zIndex: 10,
        },

        leftBlock: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
        backButton: {
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            backgroundColor: theme.surface,
        },

        centralBlock: {
            flex: 2,
            alignItems: "center",
            justifyContent: "center",
        },
        title: {
            fontSize: 18,
            fontWeight: "700",
        },

        rightBlockStyles: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 12,
        },
        rightBlockItems: {
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            backgroundColor: theme.primaryLighter,
        },
        rightBlockNames: {
            fontSize: 14,
            fontWeight: "700",
            paddingHorizontal: 8,
            color: theme.foreground,
        },
    });
