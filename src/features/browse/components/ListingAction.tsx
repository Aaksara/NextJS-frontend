"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";

import { useSession } from "@/components/landing/session";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { Text } from "@/components/ui/typography";
import type { ListingStatus } from "@/features/listings/types";
import RequestDialog from "@/features/student/components/RequestDialog";
import { STUDENT_HOME, STUDENT_LISTINGS } from "@/features/student/routes";

import { browseListingPath } from "../routes";
import type { BrowseListing } from "../types";

const unavailableNotes: Record<Exclude<ListingStatus, "available">, string> = {
	reserved: "Another student is collecting this copy.",
	completed: "This copy has already changed hands.",
	withdrawn: "The seller has taken this listing down.",
};

/** What the viewer can do with the listing: request it, sign in first, or manage their own. */
export default function ListingAction({ listing }: { listing: BrowseListing }) {
	const { user } = useSession();
	const [open, setOpen] = useState(false);

	if (listing.is_owner) {
		return (
			<Actions>
				<Button asChild size="lg" variant="outlined" className="rounded-full">
					<Link href={STUDENT_LISTINGS}>Manage in My listings</Link>
				</Button>
			</Actions>
		);
	}
	if (listing.status !== "available") {
		return <Text tone="muted">{unavailableNotes[listing.status]}</Text>;
	}
	// Nothing until the session is known, so the button does not change under the cursor.
	if (user === undefined) return <div className="h-11" />;
	if (user === null) {
		const next = encodeURIComponent(browseListingPath(listing.id));
		return (
			<Actions hint="Only students of the university can request books.">
				<Button asChild size="lg" className="rounded-full">
					<Link href={`/login?next=${next}`}>Sign in to request</Link>
				</Button>
				<Button asChild size="lg" variant="outlined" className="rounded-full">
					<Link href="/register">Create an account</Link>
				</Button>
			</Actions>
		);
	}
	if (user.is_superuser) {
		return <Text tone="muted">Students request books from their own accounts.</Text>;
	}
	if (listing.has_active_request) {
		return (
			<Actions>
				<Button size="lg" variant="secondary" className="rounded-full" disabled>
					Requested
				</Button>
				<TextLink href={STUDENT_HOME}>Follow it on your dashboard</TextLink>
			</Actions>
		);
	}
	// Students always see the seller; only visitors do not.
	const { seller } = listing;
	if (!seller) return null;
	return (
		<Actions>
			<Button size="lg" className="rounded-full" onClick={() => setOpen(true)}>
				Request this book
			</Button>
			<RequestDialog listing={{ ...listing, seller }} open={open} onClose={() => setOpen(false)} />
		</Actions>
	);
}

function Actions({ hint, children }: { hint?: string; children: ReactNode }) {
	return (
		<div className="space-y-2">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">{children}</div>
			{hint && (
				<Text variant="body-sm" tone="muted">
					{hint}
				</Text>
			)}
		</div>
	);
}
