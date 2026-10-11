import React, { useState } from "react";
import {
    View,
    Text,
    Modal,
    Platform,
    TextInput,
    Pressable,
    TouchableOpacity,
    ViewStyle,
} from "react-native";
import {
    Contact,
    getPermissionsAsync,
    requestPermissionsAsync,
} from "expo-contacts";
import {
    useController,
    type Control,
    type FieldValues,
    type Path,
} from "react-hook-form";

import { ActionButton } from "@/components/ui/action-button";
import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { cn } from "@/lib/utils";

export interface ContactsInputProps {
    nameValue: string;
    phoneValue?: string;
    onContactSelected: (name: string, phone: string) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    modalTitle?: string;
    modalDescription?: string;
    allowButtonTitle?: string;
    cancelButtonTitle?: string;
    className?: string;
    style?: ViewStyle;
}

export function ContactsInput({
    nameValue,
    phoneValue,
    onContactSelected,
    label = "Contact",
    placeholder = "Enter name or pick contact",
    error,
    modalTitle = "Connect Contact",
    modalDescription = "Access to your contacts is needed to quickly select and auto-fill contact details.",
    allowButtonTitle = "Allow Contact Access",
    cancelButtonTitle = "Enter Manually Instead",
    className,
    style,
}: ContactsInputProps) {
    const [permissionModalVisible, setPermissionModalVisible] = useState(false);

    const launchPicker = async () => {
        try {
            const contact: any = await Contact.presentPicker();
            if (!contact) return;

            // Supports both getter methods (SDK 51+) and static property fallbacks
            const fullName =
                typeof contact.getFullName === "function"
                    ? await contact.getFullName()
                    : contact.name;
            const givenName =
                typeof contact.getGivenName === "function"
                    ? await contact.getGivenName()
                    : contact.firstName;
            const familyName =
                typeof contact.getFamilyName === "function"
                    ? await contact.getFamilyName()
                    : contact.lastName;
            const phones =
                typeof contact.getPhones === "function"
                    ? await contact.getPhones()
                    : contact.phoneNumbers;

            const resolvedName =
                fullName?.trim() ||
                `${givenName ?? ""} ${familyName ?? ""}`.trim() ||
                "Unknown";

            const rawPhone = phones?.[0]?.number ?? "";
            const cleanPhone = rawPhone.replace(/\s+/g, " ").trim();

            onContactSelected(resolvedName, cleanPhone);
        } catch (err) {
            console.warn("Contact picker error:", err);
        }
    };

    const triggerContactPicker = async () => {
        try {
            // iOS native contact picker can be displayed without full contact-book permission
            if (Platform.OS === "ios") {
                await launchPicker();
                return;
            }

            // Android requires explicit READ_CONTACTS permission
            const permission = await getPermissionsAsync();
            if (!permission.granted) {
                setPermissionModalVisible(true);
                return;
            }

            await launchPicker();
        } catch (err) {
            console.warn("Contact permission/picker error:", err);
            setPermissionModalVisible(true);
        }
    };

    const requestPermissionFromModal = async () => {
        try {
            const permission = await requestPermissionsAsync();
            setPermissionModalVisible(false);

            if (permission.granted) {
                await launchPicker();
            } else {
                console.warn("Contacts permission was not granted.");
            }
        } catch (err) {
            console.warn("Contact permission request error:", err);
            setPermissionModalVisible(false);
        }
    };

    const displayString = nameValue
        ? `${nameValue}${phoneValue ? ` (\${phoneValue})` : ""}`
        : "";

    return (
        <View className={cn("w-full mb-4", className)} style={style}>
            {label && (
                <Text className="text-xs font-medium text-foreground-muted mb-2">
                    {label}
                </Text>
            )}

            <View
                className={cn(
                    "flex-row items-center rounded-2xl border bg-surface overflow-hidden",
                    error ? "border-destructive" : "border-border",
                )}
            >
                <TextInput
                    className="flex-1 pl-4 py-3.5 text-sm font-medium text-foreground bg-surface"
                    placeholder={placeholder}
                    placeholderTextColor="#94a3b8"
                    value={displayString}
                    onChangeText={(val) => onContactSelected(val, "")}
                />

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={triggerContactPicker}
                    className="p-2 mr-1.5 items-center justify-center rounded-xl border border-border bg-primary/10"
                >
                    <DynamicIcon
                        name="Contact"
                        size={20}
                        className="text-primary"
                    />
                </TouchableOpacity>
            </View>

            {error && (
                <Text className="text-xs mt-1.5 font-medium text-destructive">
                    {error}
                </Text>
            )}

            {/* Permission Bottom Sheet Modal */}
            <Modal
                transparent
                visible={permissionModalVisible}
                animationType="slide"
                statusBarTranslucent
                onRequestClose={() => setPermissionModalVisible(false)}
            >
                <Pressable
                    onPress={() => setPermissionModalVisible(false)}
                    className="flex-1 justify-end bg-black/80"
                >
                    <Pressable
                        onPress={(e) => e.stopPropagation()}
                        className="p-5 pb-8 mx-3 mb-6 rounded-[28px] border border-border bg-surface shadow-2xl"
                    >
                        <View className="items-center mb-5">
                            <View className="w-10 h-1 bg-border rounded-full mb-5" />
                            <View className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center mb-3">
                                <DynamicIcon
                                    name="BookUser"
                                    size={30}
                                    className="text-primary"
                                />
                            </View>
                            <Text className="text-lg font-bold text-foreground text-center">
                                {modalTitle}
                            </Text>
                            <Text className="text-xs text-foreground-muted text-center mt-1.5 px-4 leading-relaxed">
                                {modalDescription}
                            </Text>
                        </View>

                        <ActionButton
                            title={allowButtonTitle}
                            variant="primary"
                            onPress={requestPermissionFromModal}
                        />
                        <ActionButton
                            title={cancelButtonTitle}
                            variant="secondary"
                            onPress={() => setPermissionModalVisible(false)}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

export interface ControlledContactsInputProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    phoneName: Path<T>;
    label?: string;
    placeholder?: string;
    modalTitle?: string;
    modalDescription?: string;
    allowButtonTitle?: string;
    cancelButtonTitle?: string;
    className?: string;
}

export function ControlledContactsInput<T extends FieldValues>({
    control,
    name,
    phoneName,
    label = "Contact",
    placeholder,
    modalTitle,
    modalDescription,
    allowButtonTitle,
    cancelButtonTitle,
    className,
}: ControlledContactsInputProps<T>) {
    const { field: nameField, fieldState: nameFieldState } = useController({
        control,
        name,
    });

    const { field: phoneField, fieldState: phoneFieldState } = useController({
        control,
        name: phoneName,
    });

    const error =
        nameFieldState.error?.message ?? phoneFieldState.error?.message;

    const handleContactSelected = (
        resolvedName: string,
        cleanPhone: string,
    ) => {
        nameField.onChange(resolvedName);
        phoneField.onChange(cleanPhone);
        nameField.onBlur();
        phoneField.onBlur();
    };

    return (
        <ContactsInput
            nameValue={
                typeof nameField.value === "string" ? nameField.value : ""
            }
            phoneValue={
                typeof phoneField.value === "string" ? phoneField.value : ""
            }
            onContactSelected={handleContactSelected}
            label={label}
            placeholder={placeholder}
            error={error}
            modalTitle={modalTitle}
            modalDescription={modalDescription}
            allowButtonTitle={allowButtonTitle}
            cancelButtonTitle={cancelButtonTitle}
            className={className}
        />
    );
}
