"use client";

import { X } from "lucide-react";
import { type ComponentProps, type ReactNode, useEffect, useId, useRef } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

interface DialogProps {
	open: boolean;
	onClose: () => void;
	title: string;
	description?: string;
	/** Mounted only while open, so forms inside start fresh each time. */
	children: ReactNode;
	className?: string;
}

/** Modal built on the native <dialog>, which handles focus trapping and Escape. */
function Dialog({ open, onClose, title, description, children, className }: DialogProps) {
	const ref = useRef<HTMLDialogElement>(null);
	const titleId = useId();

	useEffect(() => {
		const dialog = ref.current;
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	}, [open]);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: the click closes on backdrop; keyboard users press Escape, which <dialog> handles.
		<dialog
			ref={ref}
			aria-labelledby={titleId}
			onClose={onClose}
			// A click on the dialog element itself, rather than its content, is on the backdrop.
			onClick={(event) => event.target === event.currentTarget && onClose()}
			className={cn(
				"m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-card p-0 text-card-foreground shadow-xl backdrop:bg-neutral-10/50",
				className,
			)}
		>
			<div className="flex items-start justify-between gap-4 border-b px-6 py-4">
				<div className="space-y-1">
					<Text as="h2" id={titleId} variant="headline-sm">
						{title}
					</Text>
					{description && <Text tone="muted">{description}</Text>}
				</div>
				<IconButton variant="ghost" size="icon-sm" label="Close" onClick={onClose}>
					<X />
				</IconButton>
			</div>
			{open && children}
		</dialog>
	);
}

function DialogFooter({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn("flex justify-end gap-2 border-t bg-muted/40 px-6 py-4", className)}
			{...props}
		/>
	);
}

export { Dialog, DialogFooter };
