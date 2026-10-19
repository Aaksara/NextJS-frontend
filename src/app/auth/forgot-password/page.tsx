"use client";

import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import AuthForm from "@/components/form/AuthForm";
import FormInput from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { getErrorMessage, getFieldErrors, readForm } from "@/lib/utils/page-helpers";
import { authService } from "@/services/auth.service";

export default function ForgotPasswordPage() {
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const { email } = readForm(event, "email");
		setLoading(true);
		setErrors({});
		try {
			await authService.requestPasswordReset(email);
			setDone(true);
		} catch (error) {
			setErrors(getFieldErrors(error));
			toast.error(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	}

	return (
		<AuthForm
			title={done ? "Check your email" : "Reset your password"}
			subtitle={done ? undefined : "Enter your university email and we'll send you a reset link."}
			headerLink={{ prompt: "Remembered it?", label: "Sign in", href: "/auth/login" }}
		>
			{done ? (
				<p className="text-sm leading-relaxed text-muted-foreground">
					If an account exists for that email, a reset link is on its way.
				</p>
			) : (
				<form className="space-y-5" onSubmit={handleSubmit}>
					<FormInput
						id="email"
						label="University email"
						type="email"
						autoComplete="email"
						placeholder="you@university.edu"
						errors={errors.email}
					/>
					<Button type="submit" size="lg" className="w-full" disabled={loading}>
						{loading ? "Sending…" : "Send reset link"}
					</Button>
				</form>
			)}
		</AuthForm>
	);
}
