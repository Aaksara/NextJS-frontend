"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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
			<h1 className="text-3xl font-bold">AKSARA</h1>
			<p className="mt-2 text-muted-foreground">Buy, swap and donate textbooks on campus.</p>

			{user === null && (
				<div className="mt-6 flex gap-3">
					<Button asChild>
						<Link href="/auth/login">Sign in</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href="/auth/register">Create account</Link>
					</Button>
				</div>
			)}

			{user && (
				<div className="mt-6 flex items-center gap-4">
					<p>Signed in as {user.full_name}.</p>
					<Button variant="outline" onClick={handleSignOut}>
						Sign out
					</Button>
				</div>
			)}
		</main>
	);
}
