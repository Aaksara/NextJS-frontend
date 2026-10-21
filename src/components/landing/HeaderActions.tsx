"use client";

import Link from "next/link";

import { useSession } from "@/components/landing/session";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";

export default function HeaderActions() {
	const { user, signOut } = useSession();

	if (user) {
		return (
			<div className="flex items-center gap-3">
				<Text as="span" variant="label-lg" className="hidden sm:inline">
					{user.full_name}
				</Text>
				<Button variant="outlined" size="sm" className="rounded-full" onClick={signOut}>
					Sign out
				</Button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<Button asChild variant="ghost" size="sm" className="text-foreground">
				<Link href="/login">Sign in</Link>
			</Button>
			<Button asChild size="sm" className="rounded-full px-4">
				<Link href="/register">Get started</Link>
			</Button>
		</div>
	);
}
