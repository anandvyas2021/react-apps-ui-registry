import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { icons } from "lucide-react-native";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type IconName = keyof typeof icons;
