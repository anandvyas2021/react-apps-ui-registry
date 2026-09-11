import React, { useState, forwardRef } from "react";
import {
    View,
    Text,
    Modal,
    FlatList,
    Pressable,
    TextInput,
    TouchableOpacity,
    ViewProps,
} from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";

import { cn } from "@/lib/utils";

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
            countries = COUNTRIES, // Defaults to the imported list if not provided
            className,
            ...props
        },
        ref,
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [isPickerVisible, setPickerVisible] = useState(false);

        const handleTextChange = (text: string) => {
            const numericValue = text.replace(/[^0-9]/g, "");
            if (numericValue.length <= selectedCountry.maxLength) {
                onChangeText(numericValue);
            }
        };

        return (
            <View ref={ref} className={cn("mb-6", className)} {...props}>
                <Text className="text-sm font-medium text-foreground-muted mb-2 ml-1">
                    Enter your phone number
                </Text>

                <View
                    className={cn(
                        "flex-row items-center bg-surface rounded-2xl border-[1.5px] h-16",
                        isFocused ? "border-primary" : "border-transparent",
                    )}
                >
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setPickerVisible(true)}
                        className="flex-row items-center h-full pl-4 rounded-l-2xl"
                    >
                        <Text className="text-2xl mr-2">
                            {selectedCountry.flag}
                        </Text>
                        <Text className="text-foreground text-lg font-semibold mr-1">
                            {selectedCountry.dialCode}
                        </Text>
                        <DynamicIcon
                            name="ChevronDown"
                            size={18}
                            className="text-foreground-muted"
                        />
                    </TouchableOpacity>

                    <View className="w-[1px] h-8 bg-border mx-2" />

                    <TextInput
                        value={value}
                        onChangeText={handleTextChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        keyboardType="number-pad"
                        placeholder="000 000 0000"
                        placeholderTextColor="#9ca3af" // Tailwind gray-400
                        className="flex-1 h-full text-foreground text-lg font-semibold px-2"
                        maxLength={selectedCountry.maxLength}
                    />
                </View>

                <Modal
                    visible={isPickerVisible}
                    transparent
                    animationType="slide"
                >
                    <Pressable
                        className="flex-1 bg-black/50 justify-end"
                        onPress={() => setPickerVisible(false)}
                    >
                        <View className="bg-background rounded-t-[32px] max-h-[70%] overflow-hidden">
                            <View className="w-full items-center pt-4 pb-2">
                                <View className="w-12 h-1.5 bg-surface-muted rounded-full" />
                            </View>

                            <Text className="text-xl font-bold text-foreground px-6 py-4">
                                Select Country
                            </Text>

                            <FlatList
                                data={countries}
                                keyExtractor={(item) => item.id}
                                className="px-4 pb-8"
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            onCountryChange(item);
                                            setPickerVisible(false);
                                        }}
                                        className={cn(
                                            "flex-row items-center justify-between p-4 rounded-2xl mb-2",
                                            selectedCountry.id === item.id
                                                ? "bg-surface-muted"
                                                : "bg-transparent",
                                        )}
                                    >
                                        <View className="flex-row items-center">
                                            <Text className="text-3xl mr-4">
                                                {item.flag}
                                            </Text>
                                            <Text className="text-foreground font-semibold text-lg">
                                                {item.name}
                                            </Text>
                                        </View>
                                        <Text className="text-foreground-muted font-medium">
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
