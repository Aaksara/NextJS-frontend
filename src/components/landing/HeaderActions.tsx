"use client";

import Link from "next/link";

import { homeFor, useSession } from "@/components/landing/session";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

export default function HeaderActions({ className }: { className?: string }) {
	const { user, signOut } = useSession();

	if (user) {
		return (
			<div className={cn("flex items-center gap-2", className)}>
				<Button variant="ghost" size="sm" className="text-foreground" onClick={signOut}>
					Sign out
				</Button>
				<Button asChild size="sm" className="rounded-full px-4">
					<Link href={homeFor(user)}>{user.is_superuser ? "Admin console" : "My dashboard"}</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<Button asChild variant="ghost" size="sm" className="text-foreground">
				<Link href="/login">Sign in</Link>
			</Button>
			<Button asChild size="sm" className="rounded-full px-4">
				<Link href="/register">Get started</Link>
			</Button>
		</div>
	);
}
