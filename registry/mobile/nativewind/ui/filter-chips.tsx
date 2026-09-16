import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { HorizontalScroll } from "@/components/layout/horizontal-scroll";

import { cn } from "@/lib/utils";

export interface FilterChipsProps {
    filters: { label: string; value: string }[];
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    className?: string;
}

export function FilterChips({
    filters,
    activeFilter,
    onFilterChange,
    className,
}: FilterChipsProps) {
    return (
        <HorizontalScroll className={className}>
            {filters?.map((filter) => {
                const isActive = activeFilter === filter?.value;
                return (
                    <TouchableOpacity
                        key={filter?.value}
                        onPress={() => onFilterChange(filter?.value)}
                        activeOpacity={0.7}
                        className={cn(
                            "px-4 py-2.5 rounded-[18px] border-[1.3px]",
                            isActive
                                ? "border-primary bg-primary-lighter"
                                : "border-transparent bg-surface-muted ",
                        )}
                    >
                        <Text
                            className={cn(
                                "text-xs font-semibold",
                                isActive ? "text-primary" : "text-foreground",
                            )}
                        >
                            {filter?.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </HorizontalScroll>
    );
}
