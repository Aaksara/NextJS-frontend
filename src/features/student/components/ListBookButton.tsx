"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";

import ListingFormDialog from "./ListingFormDialog";

export default function ListBookButton(props: Omit<ButtonProps, "onClick" | "children">) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button {...props} onClick={() => setOpen(true)}>
				<Plus />
				List a book
			</Button>
			<ListingFormDialog open={open} onClose={() => setOpen(false)} />
		</>
	);
}
