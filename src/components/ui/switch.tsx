import type * as React from "react";

import { cn } from "@/lib/utils/utils";

type SwitchProps = Omit<React.ComponentProps<"button">, "onChange" | "role" | "aria-label"> & {
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	/** Accessible name. Required because the switch has no visible text. */
	label: string;
};

function Switch({ checked, onCheckedChange, label, className, ...props }: SwitchProps) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			aria-label={label}
			onClick={() => onCheckedChange(!checked)}
			className={cn(
				"inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
				checked ? "bg-primary" : "bg-input",
				className,
			)}
			{...props}
		>
			<span
				aria-hidden
				className={cn(
					"size-4 rounded-full bg-card shadow-sm transition-transform",
					checked && "translate-x-4",
				)}
			/>
		</button>
	);
}

export { Switch };
