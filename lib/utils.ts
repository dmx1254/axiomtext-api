import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const defaultLocale = "fr";
export const locales = ["fr", "en"] as const;
export type ValidLocale = (typeof locales)[number];


export const checkAmountOfSms = async (contact: string): Promise<number> => {
  if (contact.startsWith("+221")) {
    return 1;
  } else {
    return 3;
  }
};
