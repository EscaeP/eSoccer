import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRelativeDateColor = (dateString: string, uniqueDates: string[]) => {
  const index = uniqueDates.indexOf(dateString);
  const total = uniqueDates.length;
  // Hue from 0 (Red) to 120 (Green)
  const hue = total <= 1 ? 0 : (index / (total - 1)) * 120;
  const color = `hsl(${hue}, 84%, 55%)`;
  
  return {
    color,
    bgStyle: { backgroundColor: color },
    textStyle: { color },
    activeContainerStyle: {
      backgroundColor: `hsl(${hue}, 84%, 12%)`,
      borderColor: `hsl(${hue}, 84%, 30%)`,
      boxShadow: `0 0 0 1px hsl(${hue}, 84%, 20%)`,
      backgroundImage: `linear-gradient(to right, hsl(${hue}, 84%, 15%), transparent)`
    }
  };
};

