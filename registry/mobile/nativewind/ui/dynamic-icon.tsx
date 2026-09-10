import React from "react";
import * as LucideIcons from "lucide-react-native";
import { cssInterop } from "nativewind";

// Embedded types for 100% portability
export interface DynamicIconProps {
    name: string;
    size?: number;
    className?: string;
    color?: string;
}

const interopedIcons = new Set<string>();

export function DynamicIcon({
    name,
    className,
    color,
    size = 20,
}: DynamicIconProps) {
    // Grab the specific icon from the Lucide object using bracket notation
    const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as any;

    // Fallback just in case a typo is passed
    if (!IconComponent) {
        console.warn(`Icon "${name}" does not exist in lucide-react-native.`);
        return null;
    }

    if (!interopedIcons.has(name)) {
        cssInterop(IconComponent, {
            className: {
                target: "style",
                nativeStyleToProp: {
                    color: true,
                    opacity: true,
                },
            },
        });
        // Add to cache so this block never runs for this icon again
        interopedIcons.add(name);
    }

    // Note: We pass color here as a fallback in case className doesn't dictate it
    return <IconComponent className={className} size={size} color={color} />;
}
