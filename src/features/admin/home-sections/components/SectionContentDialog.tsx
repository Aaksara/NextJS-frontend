"use client";

import { RotateCcw } from "lucide-react";
import { type FormEvent, useState } from "react";

import Field from "@/components/form/Field";
import { builtInHomeContent } from "@/components/landing/content";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Text, textVariants } from "@/components/ui/typography";
import { getErrorMessage, getFieldErrors } from "@/lib/utils/page-helpers";
import { cn } from "@/lib/utils/utils";

import { sectionInfo } from "../constants";
import {
	contentForms,
	hasCustomContent,
	ITEM_POSITIONS,
	itemFieldName,
	readContent,
	type TextField,
	toFormValues,
} from "../content-form";
import { useResetSectionContent, useSaveSectionContent } from "../queries";
import type { HomeSection } from "../types";

interface TextInputProps {
	field: TextField;
	/** The input's name, e.g. "items.0.title". */
	name: string;
	values: Record<string, string>;
	errors: Record<string, string[]>;
}

function TextInput({ field, name, values, errors }: TextInputProps) {
	const id = `section-${name}`;
	const Control = field.multiline ? Textarea : Input;
	return (
		<Field htmlFor={id} label={field.label} errors={errors[name]}>
			<Control
				id={id}
				name={name}
				required
				maxLength={field.maxLength}
				defaultValue={values[name]}
				aria-invalid={errors[name] ? true : undefined}
			/>
		</Field>
	);
}

/**
 * The message under the fields: errors with no input of their own (such as two cards with
 * the same title), else the request's error if no field explains it.
 */
function formAlert(error: unknown, fields: Record<string, string[]>) {
	const unplaced = [...(fields.items ?? []), ...(fields.non_field_errors ?? [])];
	if (unplaced.length) return unplaced.join(" ");
	return Object.keys(fields).length ? null : getErrorMessage(error);
}

/** Edits the text of one home page section, or puts back the built-in text. Mount it only
 * while editing, so each opening starts from the saved text. */
export default function SectionContentDialog({
	section,
	onClose,
}: {
	section: HomeSection;
	onClose: () => void;
}) {
	const save = useSaveSectionContent();
	const reset = useResetSectionContent();
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const [alert, setAlert] = useState<string | null>(null);

	const { kind } = section;
	const { label } = sectionInfo[kind];
	const { fields, items } = contentForms[kind];
	const isCustom = hasCustomContent(section);
	const values = toFormValues(isCustom ? section.content : builtInHomeContent[kind]);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const content = readContent(new FormData(event.currentTarget), contentForms[kind]);
		save.mutate(
			{ kind, content },
			{
				onSuccess: onClose,
				onError: (error) => {
					const fieldErrors = getFieldErrors(error);
					setErrors(fieldErrors);
					setAlert(formAlert(error, fieldErrors));
				},
			},
		);
	}

	function handleReset() {
		if (window.confirm(`Put back the built-in text of "${label}"? Your text for it is removed.`)) {
			reset.mutate(kind, { onSuccess: onClose });
		}
	}

	return (
		<Dialog
			open
			onClose={onClose}
			title={`Edit "${label}"`}
			description={
				isCustom
					? "This section shows your text."
					: "This section shows the built-in text. Saving replaces it with yours."
			}
		>
			<form onSubmit={handleSubmit}>
				<div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-5">
					{fields.map((field) => (
						<TextInput
							key={field.name}
							field={field}
							name={field.name}
							values={values}
							errors={errors}
						/>
					))}

					{items &&
						ITEM_POSITIONS.map((position) => (
							<fieldset key={position} className="space-y-4 rounded-xl border p-4">
								<legend className={cn(textVariants({ variant: "label-lg" }), "px-1")}>
									{items.noun} {position + 1}
								</legend>
								{items.fields.map((field) => (
									<TextInput
										key={field.name}
										field={field}
										name={itemFieldName(position, field.name)}
										values={values}
										errors={errors}
									/>
								))}
							</fieldset>
						))}

					{alert && (
						<Text variant="body-sm" tone="destructive" role="alert">
							{alert}
						</Text>
					)}
				</div>
				<DialogFooter className="justify-between">
					{isCustom ? (
						<Button type="button" variant="ghost" onClick={handleReset} disabled={reset.isPending}>
							<RotateCcw />
							Use built-in text
						</Button>
					) : (
						<span />
					)}
					<div className="flex gap-2">
						<Button type="button" variant="ghost" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={save.isPending}>
							{save.isPending ? "Saving…" : "Save text"}
						</Button>
					</div>
				</DialogFooter>
			</form>
		</Dialog>
	);
}
