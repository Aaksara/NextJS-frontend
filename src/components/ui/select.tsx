import { ChevronDown } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils/utils";

type SelectProps = React.ComponentProps<"select"> & {
	/** Applied to the wrapper, so it controls the width. */
	className?: string;
};

/** Native select styled like `Input`. Pass `<option>` elements as children. */
function Select({ className, children, ...props }: SelectProps) {
	return (
		<div className={cn("relative", className)}>
			<select
				data-slot="select"
				className={cn(
					"h-10 w-full min-w-0 cursor-pointer appearance-none truncate rounded-lg border border-transparent bg-muted pr-9 pl-3 text-body-md outline-none transition-[color,background-color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50",
					"focus-visible:border-ring focus-visible:bg-card focus-visible:ring-[3px] focus-visible:ring-ring/50",
				)}
				{...props}
			>
				{children}
			</select>
			<ChevronDown
				aria-hidden
				className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
			/>
		</div>
	);
}

export { Select };
