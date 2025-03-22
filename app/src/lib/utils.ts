import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export function cn(...input: any[]) { //takes iall inputs and gathers as an array, recall that clsx handles arrays
    return twMerge(clsx(input));
}