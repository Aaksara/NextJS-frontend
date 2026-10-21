import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

interface FieldProps {
	/** Id of the control inside, which the label points to. */
	htmlFor: string;
	label: string;
	hint?: string;
	/** Messages from the API for this field. They replace the hint. */
	errors?: string[];
	children: ReactNode;
	className?: string;
}

export default function Field({ htmlFor, label, hint, errors, children, className }: FieldProps) {
	return (
		<div className={cn("space-y-2", className)}>
			<Label htmlFor={htmlFor} className="text-label-md text-muted-foreground">
				{label}
			</Label>
			{children}
			{errors?.length ? (
				<Text variant="body-sm" tone="destructive" role="alert">
					{errors.join(" ")}
				</Text>
			) : (
				hint && (
					<Text variant="body-sm" tone="muted">
						{hint}
					</Text>
				)
			)}
		</div>
	);
}
