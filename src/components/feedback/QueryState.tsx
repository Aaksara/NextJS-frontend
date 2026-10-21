import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";
import { getErrorMessage } from "@/lib/utils/page-helpers";

interface QueryStateProps {
	isPending: boolean;
	error: unknown;
	onRetry: () => void;
}

/**
 * Loading and error placeholders for a query. Renders nothing once data is in, so pages can
 * write `<QueryState … />` and then their content.
 */
export default function QueryState({ isPending, error, onRetry }: QueryStateProps) {
	if (isPending) {
		return (
			<div role="status" className="flex items-center justify-center gap-2 py-16">
				<Loader2 aria-hidden className="size-5 animate-spin text-muted-foreground" />
				<Text tone="muted">Loading…</Text>
			</div>
		);
	}
	if (error) {
		return (
			<div role="alert" className="flex flex-col items-center gap-3 py-16 text-center">
				<AlertTriangle aria-hidden className="size-6 text-destructive" />
				<Text tone="muted">{getErrorMessage(error)}</Text>
				<Button variant="outlined" size="sm" onClick={onRetry}>
					Try again
				</Button>
			</div>
		);
	}
	return null;
}
