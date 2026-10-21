"use client";

import { Inbox } from "lucide-react";
import { useState } from "react";

import EmptyState from "@/components/feedback/EmptyState";
import QueryState from "@/components/feedback/QueryState";
import { Card } from "@/components/ui/card";
import { FilterChips } from "@/components/ui/filter-chips";
import { Pagination } from "@/components/ui/pagination";
import { Text } from "@/components/ui/typography";
import { usePageInRange } from "@/hooks/use-page-in-range";
import { formatCount } from "@/lib/utils/format";

import { EXCHANGE_PAGE_SIZE } from "../constants";
import { useExchangeCount, useExchanges } from "../queries";
import type { ExchangeGroup } from "../types";
import ExchangeCard from "./ExchangeCard";

const groupInfo: Record<ExchangeGroup, { label: string; empty: string; hint: string }> = {
	review: {
		label: "To review",
		empty: "No requests to review",
		hint: "When someone asks for one of your books, you accept or decline it here.",
	},
	meetups: {
		label: "Meetups",
		empty: "No meetups planned",
		hint: "Accepted exchanges show here with where and when to meet.",
	},
	sent: {
		label: "Sent",
		empty: "No open requests",
		hint: "Request a book from the listings below and follow it here.",
	},
};

/** Requests for the student's books, agreed meetups, and the student's own requests. */
export default function ExchangesPanel() {
	const counts: Record<ExchangeGroup, number | undefined> = {
		review: useExchangeCount("review").data,
		meetups: useExchangeCount("meetups").data,
		sent: useExchangeCount("sent").data,
	};
	const groups = Object.keys(groupInfo) as ExchangeGroup[];
	// Until the student picks a tab, open the first one with something in it.
	const [chosen, setChosen] = useState<ExchangeGroup | null>(null);
	const group = chosen ?? groups.find((key) => (counts[key] ?? 0) > 0) ?? "review";
	const [page, setPage] = useState(1);
	const query = useExchanges({ group, page });
	usePageInRange(page, setPage, query.error);
	const exchanges = query.data?.results ?? [];
	const total = query.data?.count ?? 0;

	return (
		<Card aria-labelledby="exchanges-title" className="gap-0 py-0">
			<div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
				<Text as="h2" id="exchanges-title" variant="headline-sm">
					Exchanges
				</Text>
				<FilterChips
					label="Exchanges"
					value={group}
					onChange={(value) => {
						setChosen(value);
						setPage(1);
					}}
					options={groups.map((key) => ({
						value: key,
						label: groupInfo[key].label,
						count: counts[key],
					}))}
				/>
			</div>
			<QueryState isPending={query.isPending} error={query.error} onRetry={query.refetch} />
			{query.isSuccess &&
				(exchanges.length === 0 ? (
					<EmptyState icon={Inbox} title={groupInfo[group].empty} hint={groupInfo[group].hint} />
				) : (
					<>
						<ul className="space-y-3 p-4">
							{exchanges.map((exchange) => (
								<li key={exchange.id}>
									<ExchangeCard exchange={exchange} />
								</li>
							))}
						</ul>
						{total > EXCHANGE_PAGE_SIZE && (
							<Pagination
								page={page}
								pageCount={Math.ceil(total / EXCHANGE_PAGE_SIZE)}
								onPageChange={setPage}
								summary={formatCount(total, "exchange")}
								className="border-t"
							/>
						)}
					</>
				))}
		</Card>
	);
}
