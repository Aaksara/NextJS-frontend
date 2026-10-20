"use client";

import { type FormEvent, useState } from "react";

import Field from "@/components/form/Field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getFieldErrors, readForm } from "@/lib/utils/page-helpers";

import { useSaveLocation } from "../queries";
import type { MeetupLocation } from "../types";

interface LocationFormDialogProps {
	open: boolean;
	onClose: () => void;
	/** The location to edit. Without it the dialog adds a new one. */
	location?: MeetupLocation;
}

export default function LocationFormDialog({ open, onClose, location }: LocationFormDialogProps) {
	const save = useSaveLocation();
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	function close() {
		setErrors({});
		onClose();
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const { name, description } = readForm(event, "name", "description");
		const input = {
			name: name.trim(),
			description: description.trim(),
			is_active: location?.is_active ?? true,
		};
		save.mutate(
			{ id: location?.id, input },
			{ onSuccess: close, onError: (error) => setErrors(getFieldErrors(error)) },
		);
	}

	return (
		<Dialog
			open={open}
			onClose={close}
			title={location ? "Edit meetup location" : "Add meetup location"}
			description="Students pick from these spots when they agree where to hand over a book."
		>
			<form onSubmit={handleSubmit}>
				<div className="space-y-4 px-6 py-5">
					<Field htmlFor="location-name" label="Name" errors={errors.name}>
						<Input
							id="location-name"
							name="name"
							required
							maxLength={120}
							defaultValue={location?.name}
							placeholder="Main Library Entrance"
						/>
					</Field>
					<Field
						htmlFor="location-description"
						label="Directions"
						hint="Optional. Helps students find the exact spot."
						errors={errors.description}
					>
						<Input
							id="location-description"
							name="description"
							maxLength={255}
							defaultValue={location?.description}
							placeholder="Ground floor, by the information desk"
						/>
					</Field>
				</div>
				<DialogFooter>
					<Button type="button" variant="ghost" onClick={close}>
						Cancel
					</Button>
					<Button type="submit" disabled={save.isPending}>
						{save.isPending ? "Saving…" : location ? "Save changes" : "Add location"}
					</Button>
				</DialogFooter>
			</form>
		</Dialog>
	);
}
