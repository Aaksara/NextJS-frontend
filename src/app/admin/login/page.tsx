"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import AdminBrand from "@/components/admin/AdminBrand";
import { adminSessionKey, safeNextPath, useAdminSession } from "@/components/admin/admin-session";
import FormInput from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";
import { getErrorMessage, getFieldErrors, readForm } from "@/lib/utils/page-helpers";
import { authService } from "@/services/auth.service";

function nextPath() {
	return safeNextPath(new URLSearchParams(window.location.search).get("next"));
}

export default function AdminLoginPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const session = useAdminSession();
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	// Already signed in, e.g. a bookmarked login page: go straight to the console.
	useEffect(() => {
		if (session.data) router.replace(nextPath());
	}, [session.data, router]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const { email, password } = readForm(event, "email", "password");
		setLoading(true);
		setErrors({});
		try {
			// The admin session ends with the browser: it is never "remembered".
			const user = await authService.login(email, password, false);
			if (user.is_superuser) {
				queryClient.setQueryData(adminSessionKey, user);
				router.replace(nextPath());
				return;
			}
			await authService.logout();
			toast.error("This account cannot use the admin console.");
		} catch (error) {
			setErrors(getFieldErrors(error));
			toast.error(getErrorMessage(error));
		}
		setLoading(false);
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-sm gap-6 p-8">
				<AdminBrand />
				<div className="space-y-1">
					<Text as="h1" variant="headline-md" tone="primary">
						Sign in to the console
					</Text>
					<Text tone="muted">Only the platform&apos;s super admin can sign in here.</Text>
				</div>
				<form className="space-y-5" onSubmit={handleSubmit}>
					<FormInput
						id="email"
						label="Email"
						type="email"
						icon={<Mail />}
						autoComplete="username"
						errors={errors.email}
					/>
					<FormInput
						id="password"
						label="Password"
						type="password"
						icon={<Lock />}
						autoComplete="current-password"
						errors={errors.password}
					/>
					<Button type="submit" size="lg" className="w-full" disabled={loading}>
						{loading ? "Signing in…" : "Sign in"}
						{!loading && <ArrowRight />}
					</Button>
				</form>
			</Card>
		</main>
	);
}
