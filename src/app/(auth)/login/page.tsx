"use client";

import { ArrowRight, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import AuthFooter from "@/components/auth/AuthFooter";
import AuthHeading from "@/components/auth/AuthHeading";
import FormInput from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TextLink } from "@/components/ui/text-link";
import { safeStudentPath } from "@/features/student/session";
import { getErrorMessage, getFieldErrors, readForm } from "@/lib/utils/page-helpers";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const { email, password, remember } = readForm(event, "email", "password", "remember");
		setLoading(true);
		setErrors({});
		try {
			const user = await authService.login(email, password, remember === "on");
			const next = new URLSearchParams(window.location.search).get("next");
			router.push(user.is_superuser ? "/admin" : safeStudentPath(next));
		} catch (error) {
			setErrors(getFieldErrors(error));
			toast.error(getErrorMessage(error));
			setLoading(false);
		}
	}

	return (
		<>
			<AuthHeading
				eyebrow="Student access"
				title="Welcome back"
				description="Sign in with your university email to buy, sell and swap textbooks."
			/>
			<form className="space-y-5" onSubmit={handleSubmit}>
				<FormInput
					id="email"
					label="University email"
					type="email"
					icon={<Mail />}
					autoComplete="email"
					placeholder="you@university.edu"
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
				<div className="flex items-center justify-between">
					<Label>
						<Checkbox name="remember" />
						Remember me
					</Label>
					<TextLink href="/forgot-password">Forgot password?</TextLink>
				</div>
				<Button type="submit" size="lg" className="w-full" disabled={loading}>
					{loading ? "Signing in…" : "Sign in"}
					{!loading && <ArrowRight />}
				</Button>
			</form>
			<AuthFooter prompt="New to Akshara?" label="Create an account" href="/register" />
		</>
	);
}
