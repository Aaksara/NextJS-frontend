"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

function createQueryClient() {
	return new QueryClient({
		defaultOptions: {
			// Admin data changes rarely while a page is open; refetch on focus is enough.
			queries: { staleTime: 30_000 },
		},
	});
}

/** Data cache for the admin console. The storefront does not load it. */
export default function AdminProviders({ children }: { children: ReactNode }) {
	const [queryClient] = useState(createQueryClient);
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
