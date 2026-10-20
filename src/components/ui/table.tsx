import type * as React from "react";

import { cn } from "@/lib/utils/utils";

/** Scrolls sideways on narrow screens instead of squashing columns. */
function Table({ className, ...props }: React.ComponentProps<"table">) {
	return (
		<div className="w-full overflow-x-auto">
			<table className={cn("w-full border-collapse text-left", className)} {...props} />
		</div>
	);
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
	return <thead className={cn("bg-muted/60", className)} {...props} />;
}

function TableBody(props: React.ComponentProps<"tbody">) {
	return <tbody {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
	return (
		<tr
			className={cn("border-t transition-colors first:border-t-0 hover:bg-muted/40", className)}
			{...props}
		/>
	);
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
	return (
		<th
			scope="col"
			className={cn(
				"whitespace-nowrap px-4 py-3 text-label-sm text-muted-foreground uppercase tracking-wide",
				className,
			)}
			{...props}
		/>
	);
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
	return (
		<td
			className={cn(
				"px-4 py-3 align-middle text-body-md [&_[data-slot=badge]]:whitespace-nowrap",
				className,
			)}
			{...props}
		/>
	);
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
