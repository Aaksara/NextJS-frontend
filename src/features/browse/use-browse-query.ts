import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { readBrowseQuery, writeBrowseQuery } from "./query-params";
import { BROWSE } from "./routes";
import type { BrowseQuery } from "./types";

/**
 * The browse page's filters, kept in its address. The search box shows what is typed at
 * once; the address follows when typing pauses.
 */
export function useBrowseQuery() {
	const router = useRouter();
	const params = useSearchParams().toString();
	const query = useMemo(() => readBrowseQuery(new URLSearchParams(params)), [params]);
	const [search, setSearch] = useState(query.search);
	const debouncedSearch = useDebouncedValue(search.trim());
	// The search the address and the box last agreed on.
	const settledSearch = useRef(query.search);

	const show = useCallback(
		(changes: Partial<BrowseQuery>) => {
			const queryString = writeBrowseQuery({ ...query, ...changes });
			router.replace(queryString ? `${BROWSE}?${queryString}` : BROWSE, { scroll: false });
		},
		[router, query],
	);

	useEffect(() => {
		if (debouncedSearch === settledSearch.current) return;
		settledSearch.current = debouncedSearch;
		show({ search: debouncedSearch, page: 1 });
	}, [debouncedSearch, show]);

	// The address changed from elsewhere, e.g. the header's "Browse books" link.
	useEffect(() => {
		if (query.search === settledSearch.current) return;
		settledSearch.current = query.search;
		setSearch(query.search);
	}, [query.search]);

	return { query, search, setSearch, show };
}
