import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

import { cn, type IconName } from "@/lib/utils";

export interface SectionCardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function SectionCard({ title, children, className }: SectionCardProps) {
    return (
        <View className={cn("mb-6 w-full", className)}>
            {title && (
                <Text className="text-sm font-bold text-primary mb-2 ml-1">
                    {title}
                </Text>
            )}
            <View className="px-4 rounded-2xl border-[0.4px] border-border shadow-sm bg-surface overflow-hidden">
                {children}
            </View>
        </View>
    );
}

export interface SectionRowProps {
    icon: IconName | string;
    title: string;
    subtitle?: string;
    titlePosition?: "top" | "bottom";
    onPress?: () => void;
    disabled?: boolean;
    type?: "info" | "navigate" | "toggle" | "custom";
    toggleValue?: boolean;
    onToggle?: (val: boolean) => void;
    rightElement?: React.ReactNode;
    isLast?: boolean;
    customToggleIcons?: { iconOn?: IconName; iconOff?: IconName };
}

export const SectionRow = ({
    icon,
    title,
    subtitle,
    titlePosition = "bottom",
    onPress,
    disabled = false,
    type = "info",
    toggleValue,
    onToggle,
    rightElement,
    isLast = false,
    customToggleIcons,
}: SectionRowProps) => {
    const isClickable = (type === "navigate" || onPress) && type !== "toggle";

    const RowContent = (
        <View
            className={cn(
                "flex-row items-center justify-between py-2.5",
                disabled && "opacity-50",
            )}
        >
            <View className="w-11 h-11 items-center justify-center mr-4 rounded-xl bg-primary/10">
                <DynamicIcon
                    name={icon as string}
                    size={20}
                    className="text-primary"
                />
            </View>

            <View className="flex-1 justify-center">
                {titlePosition === "top" ? (
                    <>
                        <Text className="text-[10px] font-medium text-slate-400 mb-0.5">
                            {title}
                        </Text>
                        {subtitle && (
                            <Text className="text-sm font-bold text-foreground-muted">
                                {subtitle}
                            </Text>
                        )}
                    </>
                ) : (
                    <>
                        <Text className="text-[14px] font-bold text-foreground mb-0.5">
                            {title}
                        </Text>
                        {subtitle && (
                            <Text className="text-xs font-medium text-foreground-muted">
                                {subtitle}
                            </Text>
                        )}
                    </>
                )}
            </View>

            <View className="ml-2">
                {type === "navigate" && (
                    <DynamicIcon
                        name="ChevronRight"
                        size={20}
                        className="text-foreground-muted"
                    />
                )}
                {type === "toggle" && (
                    <ToggleSwitch
                        value={!!toggleValue}
                        onValueChange={(val) => onToggle?.(val)}
                        disabled={disabled}
                        customIcons={customToggleIcons}
                    />
                )}
                {type === "custom" && rightElement}
            </View>
        </View>
    );

    return (
        <View>
            {isClickable ? (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onPress}
                    disabled={disabled}
                >
                    {RowContent}
                </TouchableOpacity>
            ) : (
                <View>{RowContent}</View>
            )}
            {!isLast && <View className="border-b-[0.4px] border-border" />}
        </View>
    );
};
