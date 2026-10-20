import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

interface PaginationProps {
	/** 1-based. */
	page: number;
	pageCount: number;
	onPageChange: (page: number) => void;
	/** Shown on the left, e.g. "Showing 4 of 12 banners". */
	summary: ReactNode;
	className?: string;
}

function Pagination({ page, pageCount, onPageChange, summary, className }: PaginationProps) {
	return (
		<nav
			aria-label="Pagination"
			className={cn("flex flex-wrap items-center justify-between gap-3 px-4 py-3", className)}
		>
			<Text variant="body-sm" tone="muted">
				{summary}
			</Text>
			<div className="flex items-center gap-2">
				<IconButton
					variant="outlined"
					size="icon-sm"
					className="rounded-md"
					label="Previous page"
					disabled={page <= 1}
					onClick={() => onPageChange(page - 1)}
				>
					<ChevronLeft />
				</IconButton>
				<Text as="span" variant="label-md" aria-live="polite">
					Page {page} of {pageCount}
				</Text>
				<IconButton
					variant="outlined"
					size="icon-sm"
					className="rounded-md"
					label="Next page"
					disabled={page >= pageCount}
					onClick={() => onPageChange(page + 1)}
				>
					<ChevronRight />
				</IconButton>
			</div>
		</nav>
	);
}

export { Pagination };
