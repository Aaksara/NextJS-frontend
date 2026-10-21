"use client";

import { type FormEvent, useState } from "react";

import Field from "@/components/form/Field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toDateTimeInputValue } from "@/lib/utils/format";
import { readForm } from "@/lib/utils/page-helpers";

import { type FieldErrors, reportFormError } from "../form-errors";
import { useAcceptExchange, useMeetupLocations } from "../queries";
import type { Exchange } from "../types";

interface AcceptDialogProps {
	exchange: Exchange;
	open: boolean;
	onClose: () => void;
}

/** The seller accepts a request by agreeing where and when to hand the book over. */
export default function AcceptDialog({ exchange, open, onClose }: AcceptDialogProps) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			title="Accept and set a meetup"
			description={`${exchange.requester.full_name} will see where and when to collect ${exchange.listing_detail.book.title}. The book is reserved for them until then.`}
		>
			<AcceptForm exchange={exchange} onDone={onClose} />
		</Dialog>
	);
}

function AcceptForm({ exchange, onDone }: { exchange: Exchange; onDone: () => void }) {
	const accept = useAcceptExchange();
	const locations = useMeetupLocations();
	const noSpots = locations.data?.length === 0;
	const [errors, setErrors] = useState<FieldErrors>({});
	// Read once when the dialog opens; the API has the final say on "in the future".
	const [earliest] = useState(() => toDateTimeInputValue(new Date()));

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setErrors({});
		const { location, time } = readForm(event, "location", "time");
		accept.mutate(
			{
				id: exchange.id,
				input: { meetup_location: Number(location), meetup_time: new Date(time).toISOString() },
			},
			{ onSuccess: onDone, onError: reportFormError(setErrors) },
		);
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="space-y-4 px-6 py-5">
				<Field
					htmlFor="accept-location"
					label="Meetup spot"
					hint={
						noSpots
							? "No meetup spots are open right now. Ask the campus admin to add one."
							: undefined
					}
					errors={errors.meetup_location}
				>
					<Select
						id="accept-location"
						name="location"
						required
						defaultValue={exchange.listing_detail.preferred_location ?? ""}
						disabled={!locations.data}
					>
						<option value="" disabled>
							Choose a spot
						</option>
						{locations.data?.map((location) => (
							<option key={location.id} value={location.id}>
								{location.name}
							</option>
						))}
					</Select>
				</Field>
				<Field
					htmlFor="accept-time"
					label="Date and time"
					hint="Your local time."
					errors={errors.meetup_time}
				>
					<Input id="accept-time" name="time" type="datetime-local" required min={earliest} />
				</Field>
			</div>
			<DialogFooter>
				<Button type="button" variant="ghost" onClick={onDone}>
					Cancel
				</Button>
				<Button type="submit" disabled={accept.isPending || noSpots}>
					{accept.isPending ? "Accepting…" : "Accept request"}
				</Button>
			</DialogFooter>
		</form>
	);
}
