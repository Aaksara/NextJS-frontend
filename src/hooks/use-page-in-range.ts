import { useEffect } from "react";

import { ApiRequestError } from "@/lib/api/api-client";

/**
 * Goes back to the first page when the current one no longer exists, e.g. after the last
 * item on it was withdrawn. The API answers a page past the end with 404.
 */
export function usePageInRange(page: number, setPage: (page: number) => void, error: unknown) {
	const pastTheEnd = page > 1 && error instanceof ApiRequestError && error.status === 404;
	useEffect(() => {
		if (pastTheEnd) setPage(1);
	}, [pastTheEnd, setPage]);
}
