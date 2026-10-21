"use client";

import { useQuery } from "@tanstack/react-query";

import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

import { platformService } from "../service";

const REFRESH_MS = 60_000;

const states = {
	checking: { label: "Checking…", detail: "Contacting the API.", dot: "bg-muted-foreground" },
	healthy: { label: "Healthy", detail: "API and database are responding.", dot: "bg-success" },
	down: { label: "Unreachable", detail: "The API did not respond.", dot: "bg-destructive" },
};

export default function PlatformHealth() {
	const { isPending, isError } = useQuery({
		queryKey: ["platform", "health"],
		queryFn: platformService.getHealth,
		refetchInterval: REFRESH_MS,
		retry: false,
	});
	const state = isPending ? states.checking : isError ? states.down : states.healthy;

	return (
		<div role="status" className="rounded-xl bg-muted p-3">
			<div className="flex items-center gap-2">
				<span aria-hidden className={cn("size-2 rounded-full", state.dot)} />
				<Text as="span" variant="label-md">
					Platform health: {state.label}
				</Text>
			</div>
			<Text variant="body-sm" tone="muted" className="mt-1">
				{state.detail}
			</Text>
		</div>
	);
}
