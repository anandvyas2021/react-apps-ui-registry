import React, { useState, forwardRef, useMemo } from "react";
import {
    View,
    Text,
    Modal,
    FlatList,
    Pressable,
    TextInput,
    TouchableOpacity,
    ViewProps,
    StyleSheet,
} from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

import { COUNTRIES, type CountryProps } from "@/constants/data/countries";

export interface PhoneInputProps extends ViewProps {
    value: string;
    onChangeText: (text: string) => void;
    selectedCountry: CountryProps;
    onCountryChange: (country: CountryProps) => void;
    countries?: CountryProps[];
}

export const PhoneInput = forwardRef<
    React.ElementRef<typeof View>,
    PhoneInputProps
>(
    (
        {
            value,
            onChangeText,
            selectedCountry,
            onCountryChange,
            countries = COUNTRIES,
            style,
            ...props
        },
        ref,
    ) => {
        const theme = useTheme();
        const styles = useMemo(() => createStyles(theme), [theme]);

        const [isFocused, setIsFocused] = useState(false);
        const [isPickerVisible, setPickerVisible] = useState(false);

        const handleTextChange = (text: string) => {
            const numericValue = text.replace(/[^0-9]/g, "");
            if (numericValue.length <= selectedCountry.maxLength) {
                onChangeText(numericValue);
            }
        };

        return (
            <View ref={ref} style={[styles.container, style]} {...props}>
                <Text style={styles.label}>Enter your phone number</Text>

                <View
                    style={[
                        styles.inputSurface,
                        isFocused && styles.inputSurfaceFocused,
                    ]}
                >
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setPickerVisible(true)}
                        style={styles.countrySelector}
                    >
                        <Text style={styles.flagText}>
                            {selectedCountry.flag}
                        </Text>
                        <Text style={styles.dialCodeText}>
                            {selectedCountry.dialCode}
                        </Text>
                        <DynamicIcon
                            name="ChevronDown"
                            size={18}
                            color={theme.mutedForeground}
                        />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TextInput
                        value={value}
                        onChangeText={handleTextChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        keyboardType="number-pad"
                        placeholder="000 000 0000"
                        placeholderTextColor={theme.mutedForeground}
                        style={styles.textInput}
                        maxLength={selectedCountry.maxLength}
                    />
                </View>

                <Modal
                    visible={isPickerVisible}
                    transparent
                    animationType="slide"
                >
                    <Pressable
                        style={styles.modalBackdrop}
                        onPress={() => setPickerVisible(false)}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.dragIndicatorWrapper}>
                                <View style={styles.dragIndicator} />
                            </View>

                            <Text style={styles.modalTitle}>
                                Select Country
                            </Text>

                            <FlatList
                                data={countries}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={styles.listContainer}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            onCountryChange(item);
                                            setPickerVisible(false);
                                        }}
                                        style={[
                                            styles.listItem,
                                            selectedCountry.id === item.id &&
                                                styles.listItemSelected,
                                        ]}
                                    >
                                        <View style={styles.listItemLeft}>
                                            <Text style={styles.listItemFlag}>
                                                {item.flag}
                                            </Text>
                                            <Text style={styles.listItemName}>
                                                {item.name}
                                            </Text>
                                        </View>
                                        <Text style={styles.listItemDialCode}>
                                            {item.dialCode}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </Pressable>
                </Modal>
            </View>
        );
    },
);
PhoneInput.displayName = "PhoneInput";

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: { marginBottom: 24 },
        label: {
            fontSize: 14,
            fontWeight: "500",
            color: theme.foregroundMuted,
            marginBottom: 8,
            marginLeft: 4,
        },
        inputSurface: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.surface,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: "transparent",
            height: 64,
        },
        inputSurfaceFocused: {
            borderColor: theme.primary,
        },
        countrySelector: {
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
            paddingLeft: 16,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
        },
        flagText: { fontSize: 24, marginRight: 8 },
        dialCodeText: {
            color: theme.foreground,
            fontSize: 18,
            fontWeight: "600",
            marginRight: 4,
        },
        divider: {
            width: 1,
            height: 32,
            backgroundColor: theme.border,
            marginHorizontal: 8,
        },
        textInput: {
            flex: 1,
            height: "100%",
            color: theme.foreground,
            fontSize: 18,
            fontWeight: "600",
            paddingHorizontal: 8,
        },
        modalBackdrop: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
        },
        modalContent: {
            backgroundColor: theme.background,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            maxHeight: "70%",
            overflow: "hidden",
        },
        dragIndicatorWrapper: {
            width: "100%",
            alignItems: "center",
            paddingTop: 16,
            paddingBottom: 8,
        },
        dragIndicator: {
            width: 48,
            height: 6,
            backgroundColor: theme.surfaceMuted,
            borderRadius: 9999,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: theme.foreground,
            paddingHorizontal: 24,
            paddingVertical: 16,
        },
        listContainer: { paddingHorizontal: 16, paddingBottom: 32 },
        listItem: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            borderRadius: 16,
            marginBottom: 8,
            backgroundColor: "transparent",
        },
        listItemSelected: {
            backgroundColor: theme.surfaceMuted,
        },
        listItemLeft: { flexDirection: "row", alignItems: "center" },
        listItemFlag: { fontSize: 30, marginRight: 16 },
        listItemName: {
            color: theme.foreground,
            fontWeight: "600",
            fontSize: 18,
        },
        listItemDialCode: {
            color: theme.foregroundMuted,
            fontWeight: "500",
        },
    });
