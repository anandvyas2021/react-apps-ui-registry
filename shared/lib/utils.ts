import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as LucideIcons from "lucide-react-native";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Global Icon Type for the component registry
export type IconName = keyof typeof LucideIcons;
