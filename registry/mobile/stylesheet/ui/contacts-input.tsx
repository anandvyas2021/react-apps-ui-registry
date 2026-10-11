import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    Modal,
    Platform,
    TextInput,
    Pressable,
    TouchableOpacity,
    StyleSheet,
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
import { useTheme } from "@/theme/ThemeProvider";
import type { ThemeTokens } from "@/theme/tokens";

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
    style,
}: ContactsInputProps) {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [permissionModalVisible, setPermissionModalVisible] = useState(false);

    const launchPicker = async () => {
        try {
            const contact: any = await Contact.presentPicker();
            if (!contact) return;

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
            if (Platform.OS === "ios") {
                await launchPicker();
                return;
            }

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
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputWrapper,
                    error ? styles.inputErrorBorder : null,
                ]}
            >
                <TextInput
                    style={styles.textInput}
                    placeholder={placeholder}
                    placeholderTextColor={theme.foregroundMuted}
                    value={displayString}
                    onChangeText={(val) => onContactSelected(val, "")}
                />

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={triggerContactPicker}
                    style={styles.pickerButton}
                >
                    <DynamicIcon
                        name="Contact"
                        size={20}
                        color={theme.primary}
                    />
                </TouchableOpacity>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Modal */}
            <Modal
                transparent
                visible={permissionModalVisible}
                animationType="slide"
                statusBarTranslucent
                onRequestClose={() => setPermissionModalVisible(false)}
            >
                <Pressable
                    onPress={() => setPermissionModalVisible(false)}
                    style={styles.modalBackdrop}
                >
                    <Pressable
                        onPress={(e) => e.stopPropagation()}
                        style={styles.sheetContainer}
                    >
                        <View style={styles.sheetHeader}>
                            <View style={styles.sheetHandle} />
                            <View style={styles.iconCircle}>
                                <DynamicIcon
                                    name="BookUser"
                                    size={30}
                                    color={theme.primary}
                                />
                            </View>
                            <Text style={styles.sheetTitle}>{modalTitle}</Text>
                            <Text style={styles.sheetDescription}>
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
        />
    );
}

const createStyles = (theme: ThemeTokens) =>
    StyleSheet.create({
        container: {
            width: "100%",
            marginBottom: 16,
        },
        label: {
            fontSize: 12,
            fontWeight: "500",
            color: theme.foregroundMuted,
            marginBottom: 8,
        },
        inputWrapper: {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.surface,
            overflow: "hidden",
        },
        inputErrorBorder: {
            borderColor: theme.destructive,
        },
        textInput: {
            flex: 1,
            paddingLeft: 16,
            paddingVertical: 14,
            fontSize: 14,
            fontWeight: "500",
            color: theme.foreground,
            backgroundColor: theme.surface,
        },
        pickerButton: {
            padding: 8,
            marginRight: 6,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: `${theme.primary}1A`,
        },
        errorText: {
            fontSize: 12,
            fontWeight: "500",
            color: theme.destructive,
            marginTop: 6,
            marginLeft: 4,
        },
        modalBackdrop: {
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
        },
        sheetContainer: {
            padding: 20,
            paddingBottom: 32,
            marginHorizontal: 12,
            marginBottom: 24,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.surface,
            elevation: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
        },
        sheetHeader: {
            alignItems: "center",
            marginBottom: 20,
        },
        sheetHandle: {
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.border,
            marginBottom: 20,
        },
        iconCircle: {
            width: 64,
            height: 64,
            borderRadius: 16,
            backgroundColor: `${theme.primary}1A`,
            borderWidth: 1,
            borderColor: `${theme.primary}33`,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
        },
        sheetTitle: {
            fontSize: 18,
            fontWeight: "700",
            color: theme.foreground,
            textAlign: "center",
        },
        sheetDescription: {
            fontSize: 12,
            color: theme.foregroundMuted,
            textAlign: "center",
            marginTop: 6,
            paddingHorizontal: 16,
            lineHeight: 18,
        },
    });
