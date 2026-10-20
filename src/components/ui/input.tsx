import type * as React from "react";

import { cn } from "@/lib/utils/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"flex h-10 w-full min-w-0 rounded-lg border border-transparent bg-muted px-3 py-1 text-body-lg outline-none transition-[color,background-color,box-shadow] placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-body-md",
				"focus-visible:border-ring focus-visible:bg-card focus-visible:ring-[3px] focus-visible:ring-ring/50",
				"aria-invalid:border-destructive aria-invalid:ring-destructive/20",
				// Browsers paint autofilled fields their own color; keep the theme's instead.
				"autofill:shadow-[inset_0_0_0_100px_var(--muted)] autofill:[-webkit-text-fill-color:var(--foreground)]",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
