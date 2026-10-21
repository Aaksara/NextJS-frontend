"use client";

import { AtSign } from "lucide-react";

import QueryState from "@/components/feedback/QueryState";
import PageHeader from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";

import { useCampusSettings } from "../queries";

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

export default function CampusView() {
	return (
		<>
			<PageHeader title="Campus settings" description="Who can sign up." />
			<EmailDomains />
		</>
	);
}
