"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import QueryState from "@/components/feedback/QueryState";
import { ADMIN_LOGIN, useAdminSession } from "./admin-session";

/**
 * Shows the console only to the signed-in super admin and sends everyone else to the login
 * page. This only hides the screens; the API refuses non-admins on its own.
 */
export default function AdminGate({ children }: { children: ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const session = useAdminSession();
	const signedOut = session.isSuccess && session.data === null;

	useEffect(() => {
		if (signedOut) router.replace(`${ADMIN_LOGIN}?next=${encodeURIComponent(pathname)}`);
	}, [signedOut, pathname, router]);

	if (session.data) return children;
	return (
		<div className="flex min-h-screen items-center justify-center">
			<QueryState isPending={!session.isError} error={session.error} onRetry={session.refetch} />
		</div>
	);
}
