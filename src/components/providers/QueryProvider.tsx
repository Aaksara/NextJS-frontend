"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

import { ApiRequestError } from "@/lib/api/api-client";

/** Root of every signed-in user query, e.g. `[...sessionKey, "admin"]`. */
export const sessionKey = ["session"] as const;

function createQueryClient() {
	// A 401 means the session ended (the API client already tried to refresh it), so load
	// the user again: it comes back signed out and the area's gate sends them to sign in.
	const onError = (error: Error) => {
		if (error instanceof ApiRequestError && error.status === 401) {
			client.invalidateQueries({ queryKey: sessionKey });
		}
	};
	const client: QueryClient = new QueryClient({
		queryCache: new QueryCache({ onError }),
		mutationCache: new MutationCache({ onError }),
		defaultOptions: {
			// Signed-in data changes rarely while a page is open; refetch on focus is enough.
			queries: { staleTime: 30_000 },
		},
	});
	return client;
}

/** Data cache for the signed-in areas: the admin console and the student portal. */
export default function QueryProvider({ children }: { children: ReactNode }) {
	const [queryClient] = useState(createQueryClient);
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
