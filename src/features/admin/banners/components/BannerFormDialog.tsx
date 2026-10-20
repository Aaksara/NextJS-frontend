"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import { type FormEvent, useState } from "react";

import Field from "@/components/form/Field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getErrorMessage, getFieldErrors } from "@/lib/utils/page-helpers";

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_MB, placementLabels, statusMeta } from "../constants";
import { useDeleteBanner, useSaveBanner } from "../queries";
import type { Banner } from "../types";

interface BannerFormDialogProps {
	open: boolean;
	onClose: () => void;
	/** The banner to edit. Without it the dialog creates a new one. */
	banner?: Banner;
}

/** The form's fields as multipart data. An empty file input means "keep the current image". */
function toFormData(form: HTMLFormElement) {
	const data = new FormData(form);
	const image = data.get("image");
	if (image instanceof File && image.size === 0) data.delete("image");
	return data;
}

export default function BannerFormDialog({ open, onClose, banner }: BannerFormDialogProps) {
	const save = useSaveBanner();
	const remove = useDeleteBanner();
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
			{ id: banner?.id, form: toFormData(event.currentTarget) },
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
		if (!banner) return;
		if (!window.confirm(`Delete "${banner.title}"? This cannot be undone.`)) return;
		remove.mutate(banner.id, { onSuccess: close });
	}

	return (
		<Dialog
			open={open}
			onClose={close}
			title={banner ? "Edit banner" : "New banner"}
			description="New banners start last in the order. Only published banners appear on the storefront."
			className="max-w-2xl"
		>
			<form onSubmit={handleSubmit}>
				<div className="grid max-h-[65vh] gap-5 overflow-y-auto px-6 py-5 sm:grid-cols-2">
					<Field
						htmlFor="banner-title"
						label="Title"
						errors={errors.title}
						className="sm:col-span-2"
					>
						<Input
							id="banner-title"
							name="title"
							required
							maxLength={150}
							defaultValue={banner?.title}
						/>
					</Field>
					<Field
						htmlFor="banner-url"
						label="Link"
						errors={errors.target_url}
						className="sm:col-span-2"
					>
						<Input
							id="banner-url"
							name="target_url"
							type="url"
							required
							pattern="https?://.+"
							title="A web address starting with https://"
							placeholder="https://"
							defaultValue={banner?.target_url}
						/>
					</Field>
					<Field htmlFor="banner-placement" label="Placement" errors={errors.placement}>
						<Select
							id="banner-placement"
							name="placement"
							defaultValue={banner?.placement ?? "hero"}
						>
							{Object.entries(placementLabels).map(([value, label]) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</Select>
					</Field>
					<Field htmlFor="banner-status" label="Status" errors={errors.status}>
						<Select id="banner-status" name="status" defaultValue={banner?.status ?? "draft"}>
							{Object.entries(statusMeta).map(([value, { label }]) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</Select>
					</Field>
					<Field
						htmlFor="banner-image"
						label={banner ? "Replace image" : "Image"}
						hint={`PNG, JPEG or WebP, up to ${MAX_IMAGE_MB} MB.${banner ? " Leave empty to keep the current one." : ""}`}
						errors={errors.image}
						className="sm:col-span-2"
					>
						<div className="flex items-center gap-4">
							{banner && (
								<div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
									<Image
										src={banner.image}
										alt=""
										fill
										unoptimized
										sizes="112px"
										className="object-cover"
									/>
								</div>
							)}
							<Input
								id="banner-image"
								name="image"
								type="file"
								accept={ACCEPTED_IMAGE_TYPES}
								required={!banner}
								className="h-auto py-2"
							/>
						</div>
					</Field>
					<Field
						htmlFor="banner-alt"
						label="Image description"
						hint="Read out by screen readers, e.g. Students swapping books outside the library."
						errors={errors.alt_text}
						className="sm:col-span-2"
					>
						<Input
							id="banner-alt"
							name="alt_text"
							maxLength={200}
							defaultValue={banner?.alt_text}
						/>
					</Field>
					{formError && !Object.keys(errors).length && (
						<p role="alert" className="text-body-sm text-destructive sm:col-span-2">
							{formError}
						</p>
					)}
				</div>
				<DialogFooter className="justify-between">
					{banner ? (
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
							{save.isPending ? "Saving…" : banner ? "Save changes" : "Create banner"}
						</Button>
					</div>
				</DialogFooter>
			</form>
		</Dialog>
	);
}
