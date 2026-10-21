"use client";

import { type FormEvent, useState } from "react";

import Field from "@/components/form/Field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { FilterChips } from "@/components/ui/filter-chips";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Text } from "@/components/ui/typography";
import { conditionLabels, listingTypeLabels } from "@/features/listings/labels";
import type { Condition, ListingType } from "@/features/listings/types";
import { CURRENCY_SYMBOL } from "@/lib/utils/format";
import { readForm } from "@/lib/utils/page-helpers";

import { type FieldErrors, reportFormError } from "../form-errors";
import { useCreateListing, useMeetupLocations, useUpdateListing } from "../queries";
import type { Listing, ListingInput } from "../types";

const conditions = Object.entries(conditionLabels) as [Condition, string][];

const listingTypes = (Object.entries(listingTypeLabels) as [ListingType, string][]).map(
	([value, label]) => ({ value, label }),
);

interface ListingFormDialogProps {
	open: boolean;
	onClose: () => void;
	/** The listing to edit. Without it the dialog lists a new book. */
	listing?: Listing;
}

export default function ListingFormDialog({ open, onClose, listing }: ListingFormDialogProps) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			title={listing ? "Edit listing" : "List a book"}
			description={
				listing
					? "Changes show to other students straight away."
					: "Tell classmates which book it is and how you want to pass it on."
			}
			className="max-w-xl"
		>
			<ListingForm listing={listing} onDone={onClose} />
		</Dialog>
	);
}

function ListingForm({ listing, onDone }: { listing?: Listing; onDone: () => void }) {
	const create = useCreateListing();
	const update = useUpdateListing();
	const locations = useMeetupLocations();
	const [errors, setErrors] = useState<FieldErrors>({});
	const [listingType, setListingType] = useState<ListingType>(listing?.listing_type ?? "sell");
	const pending = create.isPending || update.isPending;

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setErrors({});
		const form = readForm(
			event,
			"title",
			"authors",
			"edition",
			"condition",
			"price",
			"course_code",
			"location",
			"description",
		);
		const input: ListingInput = {
			title: form.title.trim(),
			authors: form.authors.trim(),
			edition: form.edition.trim(),
			condition: form.condition as Condition,
			listing_type: listingType,
			price: listingType === "sell" ? form.price : null,
			course_code: form.course_code.trim(),
			preferred_location: form.location ? Number(form.location) : null,
			description: form.description.trim(),
		};
		const options = { onSuccess: onDone, onError: reportFormError(setErrors) };
		if (listing) update.mutate({ id: listing.id, input }, options);
		else create.mutate(input, options);
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="space-y-4 px-6 py-5">
				<Field htmlFor="listing-title" label="Book title" errors={errors.title}>
					<Input
						id="listing-title"
						name="title"
						required
						maxLength={300}
						placeholder="Principles of Management"
						defaultValue={listing?.book.title}
					/>
				</Field>
				<div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
					<Field
						htmlFor="listing-authors"
						label="Author"
						hint="Optional. Separate several with commas."
						errors={errors.authors}
					>
						<Input
							id="listing-authors"
							name="authors"
							maxLength={500}
							defaultValue={listing?.book.authors}
						/>
					</Field>
					<Field htmlFor="listing-edition" label="Edition" hint="Optional." errors={errors.edition}>
						<Input
							id="listing-edition"
							name="edition"
							maxLength={50}
							placeholder="3rd"
							defaultValue={listing?.book.edition}
						/>
					</Field>
				</div>

				<div className="space-y-2">
					<Text as="span" variant="label-md" tone="muted" className="block">
						Offer it as
					</Text>
					<FilterChips
						label="Offer it as"
						options={listingTypes}
						value={listingType}
						onChange={setListingType}
					/>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<Field htmlFor="listing-condition" label="Condition" errors={errors.condition}>
						<Select
							id="listing-condition"
							name="condition"
							required
							defaultValue={listing?.condition ?? "good"}
						>
							{conditions.map(([value, label]) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</Select>
					</Field>
					{listingType === "sell" && (
						<Field
							htmlFor="listing-price"
							label={`Price (${CURRENCY_SYMBOL})`}
							errors={errors.price}
						>
							<Input
								id="listing-price"
								name="price"
								type="number"
								required
								min="1"
								step="any"
								inputMode="decimal"
								defaultValue={listing?.price ?? undefined}
							/>
						</Field>
					)}
					<Field
						htmlFor="listing-course"
						label="Course code"
						hint="Optional. Helps classmates find it."
						errors={errors.course_code}
					>
						<Input
							id="listing-course"
							name="course_code"
							maxLength={30}
							placeholder="MGT 201"
							defaultValue={listing?.course_code}
						/>
					</Field>
					<Field
						htmlFor="listing-location"
						label="Preferred meetup spot"
						errors={errors.preferred_location}
					>
						<Select
							id="listing-location"
							name="location"
							defaultValue={listing?.preferred_location ?? ""}
							disabled={!locations.data}
						>
							<option value="">No preference</option>
							{locations.data?.map((location) => (
								<option key={location.id} value={location.id}>
									{location.name}
								</option>
							))}
						</Select>
					</Field>
				</div>

				<Field
					htmlFor="listing-description"
					label="Notes for buyers"
					hint="Optional. Highlighting, missing pages, anything worth knowing."
					errors={errors.description}
				>
					<Textarea
						id="listing-description"
						name="description"
						rows={3}
						defaultValue={listing?.description}
					/>
				</Field>
			</div>
			<DialogFooter>
				<Button type="button" variant="ghost" onClick={onDone}>
					Cancel
				</Button>
				<Button type="submit" disabled={pending}>
					{pending ? "Saving…" : listing ? "Save changes" : "List book"}
				</Button>
			</DialogFooter>
		</form>
	);
}
