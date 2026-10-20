"use client";

import { ShieldCheck, ShoppingBag, Store, Users } from "lucide-react";

import StatCard from "@/components/admin/StatCard";
import { formatNumber } from "@/lib/utils/format";

import { useDirectorySummary } from "../queries";

const PLACEHOLDER = "–";

export default function DirectoryStats() {
	const { data: summary } = useDirectorySummary();
	const value = (count: number | undefined) =>
		count === undefined ? PLACEHOLDER : formatNumber(count);

	return (
		<div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
			<StatCard
				label="Students"
				value={value(summary?.students)}
				icon={Users}
				footnote={summary && `${formatNumber(summary.joined_this_week)} joined this week`}
			/>
			<StatCard
				label="Verified"
				value={value(summary?.verified)}
				icon={ShieldCheck}
				tone="success"
				footnote={summary && `${formatNumber(summary.suspended)} suspended`}
			/>
			<StatCard
				label="Active sellers"
				value={value(summary?.active_sellers)}
				icon={Store}
				tone="secondary"
				footnote="With a listing available or reserved"
			/>
			<StatCard
				label="Active buyers"
				value={value(summary?.active_buyers)}
				icon={ShoppingBag}
				tone="tertiary"
				footnote="With an open exchange request"
			/>
		</div>
	);
}
