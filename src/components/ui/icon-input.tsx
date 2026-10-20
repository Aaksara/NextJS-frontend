import type * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";

type IconInputProps = React.ComponentProps<"input"> & {
	/** Decorative icon inside the left edge. */
	startIcon?: React.ReactNode;
	/** Control inside the right edge, e.g. a small `IconButton`. */
	endAdornment?: React.ReactNode;
};

/** An `Input` with an icon and/or a control placed inside it. */
function IconInput({ startIcon, endAdornment, className, ...props }: IconInputProps) {
	return (
		<div className="relative">
			{startIcon && (
				<span
					aria-hidden
					className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground [&_svg:not([class*='size-'])]:size-4"
				>
					{startIcon}
				</span>
			)}
			<Input className={cn(startIcon && "pl-9", endAdornment && "pr-10", className)} {...props} />
			{endAdornment && (
				<span className="absolute top-1/2 right-1 flex -translate-y-1/2">{endAdornment}</span>
			)}
		</div>
	);
}

export { IconInput };
