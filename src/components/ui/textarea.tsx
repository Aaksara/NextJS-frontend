import type * as React from "react";

import { cn } from "@/lib/utils/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"flex min-h-20 w-full min-w-0 rounded-lg border border-transparent bg-muted px-3 py-2 text-body-lg outline-none transition-[color,background-color,box-shadow] placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-body-md",
				"focus-visible:border-ring focus-visible:bg-card focus-visible:ring-[3px] focus-visible:ring-ring/50",
				"aria-invalid:border-destructive aria-invalid:ring-destructive/20",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
