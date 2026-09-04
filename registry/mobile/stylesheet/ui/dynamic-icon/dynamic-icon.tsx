import React from "react";
import * as LucideIcons from "lucide-react-native";
import { StyleProp, ViewStyle } from "react-native";

export interface DynamicIconProps {
    name: string;
    color?: string;
    size?: number;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}

export function DynamicIcon({
    name,
    color = "#9ca3af",
    size = 20,
    style,
    onPress,
}: DynamicIconProps) {
    const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as any;

    if (!IconComponent) {
        console.warn(`Icon "${name}" does not exist in lucide-react-native.`);
        return null;
    }

    return (
        <IconComponent
            color={color}
            size={size}
            style={style}
            onPress={onPress}
        />
    );
}
