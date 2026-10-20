"use client";

import type { FormEvent } from "react";

import Field from "@/components/form/Field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

import { toAnchorId } from "../anchor";
import { sectionCatalog } from "../constants";
import type { DraftSection, SectionKind } from "../types";

interface AddSectionDialogProps {
	open: boolean;
	onClose: () => void;
	onAdd: (section: DraftSection) => void;
}

export default function AddSectionDialog({ open, onClose, onAdd }: AddSectionDialogProps) {
	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const title = String(data.get("display_title")).trim();
		onAdd({
			id: crypto.randomUUID(),
			kind: String(data.get("kind")) as SectionKind,
			display_title: title,
			anchor_id: toAnchorId(title),
			// New sections start hidden so nothing half-configured goes live by accident.
			is_enabled: false,
			variant: "light",
		});
		onClose();
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			title="Add component"
			description="It is added hidden at the end of the page. Show it when it is ready."
		>
			<form onSubmit={handleSubmit}>
				<div className="space-y-4 px-6 py-5">
					<Field htmlFor="new-section-kind" label="Component type">
						<Select id="new-section-kind" name="kind" defaultValue="call_to_action">
							{Object.entries(sectionCatalog).map(([kind, { label }]) => (
								<option key={kind} value={kind}>
									{label}
								</option>
							))}
						</Select>
					</Field>
					<Field htmlFor="new-section-title" label="Display title">
						<Input id="new-section-title" name="display_title" required maxLength={120} />
					</Field>
				</div>
				<DialogFooter>
					<Button type="button" variant="ghost" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit">Add component</Button>
				</DialogFooter>
			</form>
		</Dialog>
	);
}
