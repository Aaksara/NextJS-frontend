"use client";

import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import AuthForm from "@/components/form/AuthForm";
import FormInput from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";
import { getErrorMessage, getFieldErrors, readForm } from "@/lib/utils/page-helpers";
import { authService } from "@/services/auth.service";

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);
	const [sentTo, setSentTo] = useState("");
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const { full_name, email, password } = readForm(event, "full_name", "email", "password");
		setLoading(true);
		setErrors({});
		try {
			await authService.register({ full_name, email, password });
			setSentTo(email);
		} catch (error) {
			setErrors(getFieldErrors(error));
			toast.error(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	}

	if (sentTo) {
		return (
			<AuthForm
				title="Check your email"
				headerLink={{ prompt: "Already verified?", label: "Sign in", href: "/auth/login" }}
			>
				<Text variant="body-md" tone="muted">
					We sent a verification link to{" "}
					<Text as="strong" variant="label-lg" tone="foreground">
						{sentTo}
					</Text>
					. Open it to activate your account. If it hasn&apos;t arrived in a few minutes, check your
					spam folder.
				</Text>
			</AuthForm>
		);
	}

	return (
		<AuthForm
			title="Create your account"
			subtitle="Use your university email. We'll send you a link to verify it."
			headerLink={{ prompt: "Already have an account?", label: "Sign in", href: "/auth/login" }}
		>
			<form className="space-y-5" onSubmit={handleSubmit}>
				<FormInput id="full_name" label="Full name" autoComplete="name" errors={errors.full_name} />
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
					autoComplete="new-password"
					placeholder="At least 8 characters"
					errors={errors.password}
				/>
				<Button type="submit" size="lg" className="w-full" disabled={loading}>
					{loading ? "Creating account…" : "Create account"}
				</Button>
			</form>
		</AuthForm>
	);
}
