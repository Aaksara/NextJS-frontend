"use client";

import { MapPin } from "lucide-react";

import QueryState from "@/components/feedback/QueryState";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";

import { useMeetupLocations } from "../queries";

/** The approved handover spots, so students know where meetups can happen. */
export default function MeetupSpots() {
	const query = useMeetupLocations();

	return (
		<Card aria-labelledby="meetup-spots-title" className="gap-0 py-0">
			<div className="space-y-1 border-b p-4">
				<Text as="h2" id="meetup-spots-title" variant="headline-sm">
					Meetup spots
				</Text>
				<Text variant="body-sm" tone="muted">
					Hand books over in these busy, public places on campus.
				</Text>
			</div>
			<QueryState isPending={query.isPending} error={query.error} onRetry={query.refetch} />
			{query.data && (
				<ul className="divide-y">
					{query.data.map((location) => (
						<li key={location.id} className="flex gap-3 p-4">
							<span
								aria-hidden
								className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-tertiary-container text-tertiary-container-foreground"
							>
								<MapPin className="size-4" />
							</span>
							<div className="min-w-0">
								<Text variant="label-lg">{location.name}</Text>
								{location.description && (
									<Text variant="body-sm" tone="muted">
										{location.description}
									</Text>
								)}
							</div>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
}
