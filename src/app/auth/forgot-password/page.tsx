"use client";

import { Mail } from "lucide-react";
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
		<AuthForm title="Forgot password" subtitle="We will email you a reset link.">
			{done ? (
				<p className="text-center text-sm">
					If an account exists for that email, a reset link has been sent.
				</p>
			) : (
				<form className="space-y-4" onSubmit={handleSubmit}>
					<FormInput
						id="email"
						label="Email"
						type="email"
						autoComplete="email"
						icon={<Mail size={16} />}
						errors={errors.email}
					/>
					<Button type="submit" className="w-full" disabled={loading}>
						Send reset link
					</Button>
				</form>
			)}
		</AuthForm>
	);
}
