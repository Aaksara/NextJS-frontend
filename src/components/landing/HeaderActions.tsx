"use client";

import Link from "next/link";

import { useSession } from "@/components/landing/session";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils/utils";

export default function HeaderActions({ className }: { className?: string }) {
	const { user, signOut } = useSession();

	if (user) {
		return (
			<div className={cn("flex items-center gap-3", className)}>
				<Text as="span" variant="label-lg">
					{user.full_name}
				</Text>
				<Button variant="outlined" size="sm" className="rounded-full" onClick={signOut}>
					Sign out
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
