import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

import { typeScale } from "@/lib/theme/type-scale";

// Register the type styles as font sizes. Otherwise tailwind-merge reads `text-body-md`
// as a color and drops it when a color such as `text-muted-foreground` follows.
const twMerge = extendTailwindMerge({
	extend: { theme: { text: Object.keys(typeScale) } },
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
