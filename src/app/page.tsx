"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";
import { authService, type User } from "@/services/auth.service";

export default function HomePage() {
	// `undefined` while loading, `null` when signed out.
	const [user, setUser] = useState<User | null>();

	useEffect(() => {
		authService.getCurrentUser().then(setUser, () => setUser(null));
	}, []);

	async function handleSignOut() {
		await authService.logout();
		setUser(null);
	}

	return (
		<main className="mx-auto max-w-2xl px-4 py-12">
			<Text as="h1" variant="headline-lg">
				Akshara
			</Text>
			<Text variant="body-lg" tone="muted" className="mt-2">
				Buy, swap and donate textbooks on campus.
			</Text>

			{user === null && (
				<div className="mt-6 flex gap-3">
					<Button asChild>
						<Link href="/login">Sign in</Link>
					</Button>
					<Button asChild variant="outlined">
						<Link href="/register">Create account</Link>
					</Button>
				</div>
			)}

			{user && (
				<div className="mt-6 flex items-center gap-4">
					<Text variant="body-lg">Signed in as {user.full_name}.</Text>
					<Button variant="outlined" onClick={handleSignOut}>
						Sign out
					</Button>
				</div>
			)}
		</main>
	);
}
