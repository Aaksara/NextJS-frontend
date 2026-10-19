"use client";

import { ArrowRight, Lock, Mail } from "lucide-react";
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
			eyebrow="Welcome back"
			title="Sign in to AKSARA."
			subtitle="Buy, swap and donate textbooks with students on your campus."
			headerLink={{ prompt: "New to AKSARA?", label: "Create account", href: "/auth/register" }}
		>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<FormInput
					id="email"
					label="University email"
					type="email"
					autoComplete="email"
					placeholder="you@university.edu"
					icon={<Mail size={16} />}
					errors={errors.email}
				/>
				<FormInput
					id="password"
					label="Password"
					type="password"
					autoComplete="current-password"
					icon={<Lock size={16} />}
					placeholder="Enter your password"
					errors={errors.password}
				/>
				<div className="flex justify-end">
					<Link
						href="/auth/forgot-password"
						className="text-xs font-medium text-brand hover:underline"
					>
						Forgot password?
					</Link>
				</div>
				<Button type="submit" className="h-11 w-full rounded-lg shadow-md" disabled={loading}>
					{loading ? "Signing in…" : "Sign in securely"}
					{!loading && <ArrowRight />}
				</Button>
			</form>
		</AuthForm>
	);
}
