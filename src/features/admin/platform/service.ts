import { requestApi } from "@/lib/api/api-client";

export const platformService = {
	/** Backend liveness, including its database connection. Rejects when unreachable. */
	getHealth: () => requestApi<{ status: "ok" }>("/api/health/"),
};
