"use client";

import { AtSign, MapPin, Pencil, Plus } from "lucide-react";
import { useState } from "react";

import EmptyState from "@/components/admin/EmptyState";
import PageHeader from "@/components/admin/PageHeader";
import QueryState from "@/components/admin/QueryState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/typography";

import { useCampusSettings, useMeetupLocations, useSetLocationActive } from "../queries";
import type { MeetupLocation } from "../types";
import LocationFormDialog from "./LocationFormDialog";

/** Which location the form dialog is open for. */
type Editing = { location?: MeetupLocation } | null;

function EmailDomains() {
	const query = useCampusSettings();

	return (
		<Card className="gap-4 p-5">
			<div className="flex items-start gap-3">
				<AtSign aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
				<div className="space-y-1">
					<Text as="h2" variant="label-lg">
						Sign-up email domains
					</Text>
					<Text variant="body-sm" tone="muted">
						Only addresses on these domains, and their subdomains, can register. They are set on the
						server with <code className="font-mono">UNIVERSITY_EMAIL_DOMAINS</code>.
					</Text>
				</div>
			</div>
			<QueryState isPending={query.isPending} error={query.error} onRetry={query.refetch} />
			{query.data && (
				<ul className="flex flex-wrap gap-2">
					{query.data.email_domains.map((domain) => (
						<li key={domain}>
							<Badge tone="primary" className="font-mono">
								@{domain}
							</Badge>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
}

function MeetupLocations() {
	const query = useMeetupLocations();
	const setActive = useSetLocationActive();
	const [editing, setEditing] = useState<Editing>(null);
	const locations = query.data ?? [];

	return (
		<Card className="gap-0 overflow-hidden py-0">
			<div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
				<div className="flex items-start gap-3">
					<MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
					<div className="space-y-1">
						<Text as="h2" variant="label-lg">
							Meetup locations
						</Text>
						<Text variant="body-sm" tone="muted">
							Approved spots for handing over books. Retire a spot instead of deleting it, so past
							exchanges keep their location.
						</Text>
					</div>
				</div>
				<Button onClick={() => setEditing({})}>
					<Plus />
					Add location
				</Button>
			</div>

			<QueryState isPending={query.isPending} error={query.error} onRetry={query.refetch} />
			{query.isSuccess &&
				(locations.length === 0 ? (
					<EmptyState
						title="No meetup locations yet"
						hint="Students cannot agree on a meetup until you add at least one."
					/>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Location</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Offered</TableHead>
								<TableHead>
									<span className="sr-only">Actions</span>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{locations.map((location) => (
								<TableRow key={location.id}>
									<TableCell className="min-w-64">
										<Text as="span" variant="label-lg" className="block">
											{location.name}
										</Text>
										{location.description && (
											<Text as="span" variant="body-sm" tone="muted" className="block">
												{location.description}
											</Text>
										)}
									</TableCell>
									<TableCell>
										<Badge tone={location.is_active ? "success" : "neutral"} dot>
											{location.is_active ? "Active" : "Retired"}
										</Badge>
									</TableCell>
									<TableCell>
										<Switch
											checked={location.is_active}
											onCheckedChange={(is_active) =>
												setActive.mutate({ id: location.id, is_active })
											}
											disabled={setActive.isPending}
											label={`Offer ${location.name} for new meetups`}
										/>
									</TableCell>
									<TableCell>
										<IconButton
											variant="ghost"
											size="icon-sm"
											label={`Edit ${location.name}`}
											onClick={() => setEditing({ location })}
										>
											<Pencil />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				))}

			<LocationFormDialog
				open={editing !== null}
				onClose={() => setEditing(null)}
				location={editing?.location}
			/>
		</Card>
	);
}

export default function CampusView() {
	return (
		<>
			<PageHeader
				trail={["Campus", "Settings"]}
				title="Campus settings"
				description="Who can sign up, and where students meet to hand over books."
			/>
			<EmailDomains />
			<MeetupLocations />
		</>
	);
}
