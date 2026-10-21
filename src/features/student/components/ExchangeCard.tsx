"use client";

import { CalendarClock, MapPin } from "lucide-react";
import { useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";
import { conditionLabels } from "@/features/listings/labels";
import { formatCurrency, formatDateTime, formatRelativeTime } from "@/lib/utils/format";

import { exchangeStatusLabels, exchangeStatusTones } from "../constants";
import { counterpart } from "../exchanges";
import { useCancelExchange, useCompleteExchange, useRejectExchange } from "../queries";
import type { Exchange } from "../types";
import AcceptDialog from "./AcceptDialog";
import BookCover, { coverOf } from "./BookCover";

/** What the requester gives: money, a book of theirs, or nothing for donations. */
function offerOf(exchange: Exchange) {
	const verb = exchange.role === "seller" ? "Offers" : "You offered";
	const offered = exchange.offered_listing_detail;
	if (offered) {
		return `${verb} ${offered.book.title} (${conditionLabels[offered.condition].toLowerCase()}) in return`;
	}
	if (exchange.offered_price === null) return "Donation";
	const offer = `${verb} ${formatCurrency(Number(exchange.offered_price))}`;
	const asking = exchange.listing_detail.price;
	return asking && Number(asking) !== Number(exchange.offered_price)
		? `${offer} · asking ${formatCurrency(Number(asking))}`
		: offer;
}

export default function ExchangeCard({ exchange }: { exchange: Exchange }) {
	const { listing_detail: listing, meetup_location_detail: location } = exchange;
	const other = counterpart(exchange);
	const isSeller = exchange.role === "seller";

	return (
		<article className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row">
			<BookCover src={coverOf(listing)} sizes="72px" className="hidden w-18 sm:block" />
			<div className="min-w-0 flex-1 space-y-3">
				<div className="flex flex-wrap items-start justify-between gap-2">
					<div className="min-w-0">
						<Text as="h3" variant="label-lg" className="line-clamp-2">
							{listing.book.title}
						</Text>
						<Text variant="body-sm" tone="muted">
							{offerOf(exchange)}
						</Text>
					</div>
					<Badge tone={exchangeStatusTones[exchange.status]} size="sm" dot>
						{exchangeStatusLabels[exchange.status]}
					</Badge>
				</div>

				<div className="flex items-center gap-2">
					<Avatar name={other.full_name} size="sm" />
					<Text variant="body-sm" tone="muted">
						{isSeller ? "Requested by " : "Listed by "}
						<Text as="strong" variant="label-md" tone="foreground">
							{other.full_name}
						</Text>
						{other.department && ` · ${other.department}`} ·{" "}
						{formatRelativeTime(exchange.created_at)}
					</Text>
				</div>

				{exchange.message && (
					<Text tone="muted" className="line-clamp-3 border-l-2 pl-3 italic">
						{exchange.message}
					</Text>
				)}

				{exchange.status === "accepted" && location && exchange.meetup_time && (
					<dl className="grid gap-2 rounded-lg bg-success-container px-3 py-2.5 text-success-container-foreground sm:grid-cols-2">
						<div className="flex items-center gap-2">
							<dt>
								<MapPin aria-label="Where" className="size-4" />
							</dt>
							<Text as="dd" variant="label-md">
								{location.name}
							</Text>
						</div>
						<div className="flex items-center gap-2">
							<dt>
								<CalendarClock aria-label="When" className="size-4" />
							</dt>
							<Text as="dd" variant="label-md">
								{formatDateTime(exchange.meetup_time)}
							</Text>
						</div>
					</dl>
				)}

				<ExchangeActions exchange={exchange} />
			</div>
		</article>
	);
}

function ExchangeActions({ exchange }: { exchange: Exchange }) {
	const [accepting, setAccepting] = useState(false);
	const reject = useRejectExchange();
	const cancel = useCancelExchange();
	const complete = useCompleteExchange();
	const title = exchange.listing_detail.book.title;
	const other = counterpart(exchange).full_name;

	if (exchange.status === "accepted") {
		const confirmCancel = () => {
			const message = `Cancel the meetup with ${other}? ${title} goes back on the shelf.`;
			if (window.confirm(message)) cancel.mutate(exchange.id);
		};
		const confirmComplete = () => {
			const message = `Mark ${title} as handed over? This cannot be undone.`;
			if (window.confirm(message)) complete.mutate(exchange.id);
		};
		return (
			<div className="flex flex-wrap justify-end gap-2">
				<Button variant="ghost" size="sm" onClick={confirmCancel} disabled={cancel.isPending}>
					Cancel meetup
				</Button>
				<Button size="sm" onClick={confirmComplete} disabled={complete.isPending}>
					Mark as handed over
				</Button>
			</div>
		);
	}

	if (exchange.role === "requester") {
		return (
			<div className="flex justify-end">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => cancel.mutate(exchange.id)}
					disabled={cancel.isPending}
				>
					Withdraw request
				</Button>
			</div>
		);
	}

	const confirmReject = () => {
		if (window.confirm(`Decline ${other}'s request for ${title}?`)) reject.mutate(exchange.id);
	};
	// Another request was accepted first. This one can wait in case that meetup is cancelled.
	const reserved = exchange.listing_detail.status !== "available";
	return (
		<div className="flex flex-wrap items-center justify-end gap-2">
			{reserved && (
				<Text variant="body-sm" tone="muted" className="mr-auto">
					Reserved for another meetup.
				</Text>
			)}
			<Button variant="outlined" size="sm" onClick={confirmReject} disabled={reject.isPending}>
				Decline
			</Button>
			{!reserved && (
				<>
					<Button size="sm" onClick={() => setAccepting(true)}>
						Accept
					</Button>
					<AcceptDialog exchange={exchange} open={accepting} onClose={() => setAccepting(false)} />
				</>
			)}
		</div>
	);
}
