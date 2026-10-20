import type * as React from "react";

import { cn } from "@/lib/utils/utils";

/** Native checkbox in the theme color. Wrap it in a `Label` to give it text. */
function Checkbox({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
	return (
		<input
			type="checkbox"
			className={cn(
				"size-4 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

export { Checkbox };
