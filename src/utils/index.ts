import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const enumToString = (str: string): string =>
  str.replace(/_+/g, " ").toLowerCase();

export const secondsToMinutesAndSeconds = (seconds: number) => {
  return {
    minutes: Math.floor(seconds / 60),
    seconds: ("0" + (seconds % 60)).slice(-2),
  };
};
