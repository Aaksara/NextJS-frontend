"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import QueryState from "@/components/feedback/QueryState";

import { useStudentSession } from "../session";

/**
 * Shows the portal only to a signed-in student; others are sent to sign in, and the super
 * admin to the console. This only hides the screens; the API guards the data on its own.
 */
export default function StudentGate({ children }: { children: ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const session = useStudentSession();
	const signedOut = session.isSuccess && session.data === null;
	// The super admin is not a student: they have their own console.
	const isAdmin = session.data?.is_superuser === true;

	useEffect(() => {
		if (signedOut) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
		if (isAdmin) router.replace("/admin");
	}, [signedOut, isAdmin, pathname, router]);

	if (session.data && !isAdmin) return children;
	return (
		<div className="flex min-h-screen items-center justify-center">
			<QueryState isPending={!session.isError} error={session.error} onRetry={session.refetch} />
		</div>
	);
}
