import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { DynamicIcon } from "@/components/custom/dynamic-icon";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

import { cn, type IconName } from "@/lib/utils";
import { VARIANT_TYPES } from "@/constants/data/static";

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
            <View
                className="rounded-[36px] overflow-hidden bg-surface"
                style={{}}
            >
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
    variant?: VARIANT_TYPES;
    customStyles?: {
        iconBg?: string;
        textColor?: string;
        backgroundColor?: string;
    };
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
    variant = "primary",
    customStyles,
    customToggleIcons,
}: SectionRowProps) => {
    const isClickable = (type === "navigate" || onPress) && type !== "toggle";

    const RowContent = (
        <View
            className={cn(
                "flex-row items-center justify-between py-3.5",
                disabled && "opacity-50",
            )}
        >
            <View
                className={`size-11 items-center justify-center mr-4 rounded-full ${customStyles?.iconBg ?? "bg-primary"}`}
            >
                <DynamicIcon
                    name={icon as string}
                    size={20}
                    className="text-white"
                />
            </View>

            <View className="flex-1 justify-center">
                {titlePosition === "top" ? (
                    <>
                        <Text className="text-[10px] font-medium text-slate-400 mb-0.5">
                            {title}
                        </Text>
                        {subtitle && (
                            <Text
                                className={`text-sm font-bold  ${customStyles?.textColor ?? "text-foreground-disabled"}`}
                            >
                                {subtitle}
                            </Text>
                        )}
                    </>
                ) : (
                    <>
                        <Text
                            className={`text-[12px] font-semibold mb-0.5 ${customStyles?.textColor ?? "text-foreground"}`}
                        >
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
        <View className={`px-4 ${customStyles?.backgroundColor}`}>
            {isClickable ? (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onPress}
                    disabled={disabled}
                    className="w-full"
                >
                    {RowContent}
                </TouchableOpacity>
            ) : (
                <View>{RowContent}</View>
            )}
            {!isLast && (
                <View className="self-end w-[85%] border-b-[0.8px] border-border" />
            )}
        </View>
    );
};

// import React from "react";
// import { View, Text, TouchableOpacity } from "react-native";

// import { DynamicIcon } from "@/components/custom/dynamic-icon";
// import { ToggleSwitch } from "@/components/ui/toggle-switch";

// import { cn, type IconName } from "@/lib/utils";

// export interface SectionCardProps {
//     title?: string;
//     children: React.ReactNode;
//     className?: string;
// }

// export function SectionCard({ title, children, className }: SectionCardProps) {
//     return (
//         <View className={cn("mb-6 w-full", className)}>
//             {title && (
//                 <Text className="text-sm font-bold text-primary mb-2 ml-1">
//                     {title}
//                 </Text>
//             )}
//             <View className="px-4 rounded-2xl border-[0.4px] border-border shadow-sm bg-surface overflow-hidden">
//                 {children}
//             </View>
//         </View>
//     );
// }

// export interface SectionRowProps {
//     icon: IconName | string;
//     title: string;
//     subtitle?: string;
//     titlePosition?: "top" | "bottom";
//     onPress?: () => void;
//     disabled?: boolean;
//     type?: "info" | "navigate" | "toggle" | "custom";
//     toggleValue?: boolean;
//     onToggle?: (val: boolean) => void;
//     rightElement?: React.ReactNode;
//     isLast?: boolean;
//     customToggleIcons?: { iconOn?: IconName; iconOff?: IconName };
// }

// export const SectionRow = ({
//     icon,
//     title,
//     subtitle,
//     titlePosition = "bottom",
//     onPress,
//     disabled = false,
//     type = "info",
//     toggleValue,
//     onToggle,
//     rightElement,
//     isLast = false,
//     customToggleIcons,
// }: SectionRowProps) => {
//     const isClickable = (type === "navigate" || onPress) && type !== "toggle";

//     const RowContent = (
//         <View
//             className={cn(
//                 "flex-row items-center justify-between py-2.5",
//                 disabled && "opacity-50",
//             )}
//         >
//             <View className="w-11 h-11 items-center justify-center mr-4 rounded-xl bg-primary-lighter">
//                 <DynamicIcon
//                     name={icon as string}
//                     size={20}
//                     className="text-primary"
//                 />
//             </View>

//             <View className="flex-1 justify-center">
//                 {titlePosition === "top" ? (
//                     <>
//                         <Text className="text-[10px] font-medium text-slate-400 mb-0.5">
//                             {title}
//                         </Text>
//                         {subtitle && (
//                             <Text className="text-sm font-bold text-foreground-muted">
//                                 {subtitle}
//                             </Text>
//                         )}
//                     </>
//                 ) : (
//                     <>
//                         <Text className="text-[14px] font-bold text-foreground mb-0.5">
//                             {title}
//                         </Text>
//                         {subtitle && (
//                             <Text className="text-xs font-medium text-foreground-muted">
//                                 {subtitle}
//                             </Text>
//                         )}
//                     </>
//                 )}
//             </View>

//             <View className="ml-2">
//                 {type === "navigate" && (
//                     <DynamicIcon
//                         name="ChevronRight"
//                         size={20}
//                         className="text-foreground-muted"
//                     />
//                 )}
//                 {type === "toggle" && (
//                     <ToggleSwitch
//                         value={!!toggleValue}
//                         onValueChange={(val) => onToggle?.(val)}
//                         disabled={disabled}
//                         customIcons={customToggleIcons}
//                     />
//                 )}
//                 {type === "custom" && rightElement}
//             </View>
//         </View>
//     );

//     return (
//         <View>
//             {isClickable ? (
//                 <TouchableOpacity
//                     activeOpacity={0.7}
//                     onPress={onPress}
//                     disabled={disabled}
//                 >
//                     {RowContent}
//                 </TouchableOpacity>
//             ) : (
//                 <View>{RowContent}</View>
//             )}
//             {!isLast && <View className="border-b-[0.4px] border-border" />}
//         </View>
//     );
// };
