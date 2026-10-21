"use client";

import { type FormEvent, useState } from "react";

import Field from "@/components/form/Field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TextLink } from "@/components/ui/text-link";
import { Textarea } from "@/components/ui/textarea";
import { Text } from "@/components/ui/typography";
import { conditionLabels, listingPrice } from "@/features/listings/labels";
import { CURRENCY_SYMBOL } from "@/lib/utils/format";
import { readForm } from "@/lib/utils/page-helpers";
import { type FieldErrors, reportFormError } from "../form-errors";
import { useRequestListing, useSwappableListings } from "../queries";
import { STUDENT_LISTINGS } from "../routes";
import type { ExchangeInput, Listing } from "../types";
import BookCover, { coverOf } from "./BookCover";

interface RequestDialogProps {
	listing: Listing;
	open: boolean;
	onClose: () => void;
}

/** Asks the seller for their book: an offer for sales, a book in return for swaps. */
export default function RequestDialog({ listing, open, onClose }: RequestDialogProps) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			title="Request this book"
			description={`${listing.seller.full_name} will accept or decline. Then you agree in the chat where and when to meet on campus.`}
		>
			<RequestForm listing={listing} onDone={onClose} />
		</Dialog>
	);
}

function RequestForm({ listing, onDone }: { listing: Listing; onDone: () => void }) {
	const request = useRequestListing();
	const isSwap = listing.listing_type === "exchange";
	const swappable = useSwappableListings(isSwap);
	const [errors, setErrors] = useState<FieldErrors>({});
	const cannotSwap = isSwap && swappable.data?.length === 0;

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setErrors({});
		const form = readForm(event, "offered_price", "offered_listing", "message");
		const input: ExchangeInput = { listing: listing.id, message: form.message.trim() };
		if (listing.listing_type === "sell") input.offered_price = form.offered_price;
		if (isSwap) input.offered_listing = Number(form.offered_listing);
		request.mutate(input, { onSuccess: onDone, onError: reportFormError(setErrors) });
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="space-y-4 px-6 py-5">
				<div className="flex items-center gap-4 rounded-lg bg-muted p-3">
					<BookCover src={coverOf(listing)} sizes="48px" className="w-12" />
					<div className="min-w-0 flex-1">
						<Text variant="label-lg" className="line-clamp-2">
							{listing.book.title}
						</Text>
						<Text variant="body-sm" tone="muted">
							{conditionLabels[listing.condition]} · {listing.seller.full_name}
						</Text>
					</div>
					<Text as="span" variant="label-lg" className="text-primary tabular-nums">
						{listingPrice(listing)}
					</Text>
				</div>

				{listing.description && (
					<div>
						<Text variant="label-md" tone="muted">
							Seller&apos;s notes
						</Text>
						<Text className="whitespace-pre-line">{listing.description}</Text>
					</div>
				)}

				{listing.listing_type === "sell" && (
					<Field
						htmlFor="request-price"
						label={`Your offer (${CURRENCY_SYMBOL})`}
						hint="Offer less than the asking price if you want to negotiate."
						errors={errors.offered_price}
					>
						<Input
							id="request-price"
							name="offered_price"
							type="number"
							required
							min="0"
							step="any"
							inputMode="decimal"
							defaultValue={listing.price ?? undefined}
						/>
					</Field>
				)}

				{isSwap &&
					(cannotSwap ? (
						<Text tone="muted" className="rounded-lg bg-warning-container px-4 py-3">
							This book is swap only, and you have no available listing to offer.{" "}
							<TextLink href={STUDENT_LISTINGS}>List one of your books</TextLink> first.
						</Text>
					) : (
						<Field
							htmlFor="request-offered"
							label="Book you offer in return"
							errors={errors.offered_listing}
						>
							<Select
								id="request-offered"
								name="offered_listing"
								required
								defaultValue=""
								disabled={!swappable.data}
							>
								<option value="" disabled>
									{swappable.data ? "Choose one of your books" : "Loading your books…"}
								</option>
								{swappable.data?.map((own) => (
									<option key={own.id} value={own.id}>
										{own.book.title} ({conditionLabels[own.condition]})
									</option>
								))}
							</Select>
						</Field>
					))}

				<Field
					htmlFor="request-message"
					label={`Message to ${listing.seller.full_name}`}
					hint="Optional. Say when you are usually free to meet."
					errors={errors.message}
				>
					<Textarea id="request-message" name="message" rows={3} />
				</Field>
			</div>
			<DialogFooter>
				<Button type="button" variant="ghost" onClick={onDone}>
					Cancel
				</Button>
				<Button type="submit" disabled={request.isPending || cannotSwap}>
					{request.isPending ? "Sending…" : "Send request"}
				</Button>
			</DialogFooter>
		</form>
	);
}
