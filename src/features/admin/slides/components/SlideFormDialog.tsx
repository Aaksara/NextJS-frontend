"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import { type FormEvent, useState } from "react";

import Field from "@/components/form/Field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { getErrorMessage, getFieldErrors } from "@/lib/utils/page-helpers";
import type { SliderKey } from "@/services/cms.service";
import { sliders } from "../constants";
import { useDeleteSlide, useSaveSlide } from "../queries";
import type { Slide } from "../types";

interface SlideFormDialogProps {
	open: boolean;
	onClose: () => void;
	/** The slide to edit. Without it the dialog adds a new one. */
	slide?: Slide;
	/** Where a new slide goes. */
	slider: SliderKey;
}

/** The form as multipart data. An empty file input keeps the current image. */
function toFormData(form: HTMLFormElement) {
	const data = new FormData(form);
	const image = data.get("image");
	if (image instanceof File && image.size === 0) data.delete("image");
	// An unticked checkbox sends nothing, so say "false" explicitly.
	data.set("is_published", String(data.get("is_published") === "on"));
	return data;
}

export default function SlideFormDialog({ open, onClose, slide, slider }: SlideFormDialogProps) {
	const save = useSaveSlide();
	const remove = useDeleteSlide();
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const [formError, setFormError] = useState<string | null>(null);

	function close() {
		setErrors({});
		setFormError(null);
		onClose();
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		save.mutate(
			{ id: slide?.id, form: toFormData(event.currentTarget) },
			{
				onSuccess: close,
				onError: (error) => {
					setErrors(getFieldErrors(error));
					setFormError(getErrorMessage(error));
				},
			},
		);
	}

	function handleDelete() {
		if (!slide || !window.confirm(`Delete "${slide.caption}"? This cannot be undone.`)) return;
		remove.mutate(slide.id, { onSuccess: close });
	}

	return (
		<Dialog
			open={open}
			onClose={close}
			title={slide ? "Edit slide" : "Add slide"}
			description="Each slider on the site shows its own slides, in the order set on this page."
		>
			<form onSubmit={handleSubmit}>
				<div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-5">
					<Field
						htmlFor="slide-image"
						label={slide ? "Replace image" : "Image"}
						hint={`PNG, JPEG or WebP, up to 4 MB.${slide ? " Leave empty to keep the current one." : ""}`}
						errors={errors.image}
					>
						<div className="flex items-center gap-4">
							{slide && (
								<div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
									<Image
										src={slide.image}
										alt=""
										fill
										unoptimized
										sizes="112px"
										className="object-cover"
									/>
								</div>
							)}
							<Input
								id="slide-image"
								name="image"
								type="file"
								accept="image/png,image/jpeg,image/webp"
								required={!slide}
								className="h-auto py-2"
							/>
						</div>
					</Field>
					<Field htmlFor="slide-slider" label="Slider" errors={errors.slider}>
						<Select id="slide-slider" name="slider" defaultValue={slide?.slider ?? slider}>
							{sliders.map(({ key, label }) => (
								<option key={key} value={key}>
									{label}
								</option>
							))}
						</Select>
					</Field>
					<Field htmlFor="slide-caption" label="Caption" errors={errors.caption}>
						<Input
							id="slide-caption"
							name="caption"
							required
							maxLength={150}
							defaultValue={slide?.caption}
							placeholder="Find the books for your course"
						/>
					</Field>
					<Field
						htmlFor="slide-link"
						label="Link"
						hint="Optional. The caption opens this page."
						errors={errors.link}
					>
						<Input
							id="slide-link"
							name="link"
							type="url"
							pattern="https?://.+"
							title="A web address starting with https://"
							placeholder="https://"
							defaultValue={slide?.link}
						/>
					</Field>
					<Field
						htmlFor="slide-alt"
						label="Image description"
						hint="Read out by screen readers, e.g. Students swapping books outside the library."
						errors={errors.alt_text}
					>
						<Input id="slide-alt" name="alt_text" maxLength={200} defaultValue={slide?.alt_text} />
					</Field>
					<Label>
						<Checkbox name="is_published" defaultChecked={slide?.is_published ?? true} />
						Show on the site
					</Label>
					{formError && !Object.keys(errors).length && (
						<p role="alert" className="text-body-sm text-destructive">
							{formError}
						</p>
					)}
				</div>
				<DialogFooter className="justify-between">
					{slide ? (
						<Button
							type="button"
							variant="ghost"
							className="text-destructive hover:bg-destructive-container hover:text-destructive-container-foreground"
							onClick={handleDelete}
							disabled={remove.isPending}
						>
							<Trash2 />
							Delete
						</Button>
					) : (
						<span />
					)}
					<div className="flex gap-2">
						<Button type="button" variant="ghost" onClick={close}>
							Cancel
						</Button>
						<Button type="submit" disabled={save.isPending}>
							{save.isPending ? "Saving…" : "Save slide"}
						</Button>
					</div>
				</DialogFooter>
			</form>
		</Dialog>
	);
}
