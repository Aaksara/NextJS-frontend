"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import AuthForm from "@/components/form/AuthForm";
import FormInput from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { getErrorMessage, getFieldErrors, readForm } from "@/lib/utils/page-helpers";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const { email, password } = readForm(event, "email", "password");
		setLoading(true);
		setErrors({});
		try {
			await authService.login(email, password);
			router.push("/");
		} catch (error) {
			setErrors(getFieldErrors(error));
			toast.error(getErrorMessage(error));
			setLoading(false);
		}
	}

	return (
		<AuthForm
			title="Sign in to Akshara"
			subtitle="Welcome back. Sign in with your university email."
			headerLink={{ prompt: "New to Akshara?", label: "Create an account", href: "/auth/register" }}
		>
			<form className="space-y-5" onSubmit={handleSubmit}>
				<FormInput
					id="email"
					label="University email"
					type="email"
					autoComplete="email"
					placeholder="you@university.edu"
					errors={errors.email}
				/>
				<FormInput
					id="password"
					label="Password"
					type="password"
					autoComplete="current-password"
					labelAside={
						<Link
							href="/auth/forgot-password"
							className="text-sm text-muted-foreground hover:text-foreground"
						>
							Forgot password?
						</Link>
					}
					errors={errors.password}
				/>
				<Button type="submit" size="lg" className="w-full" disabled={loading}>
					{loading ? "Signing in…" : "Sign in"}
				</Button>
			</form>
		</AuthForm>
	);
}
