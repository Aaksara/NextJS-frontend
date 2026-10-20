"use client";

import { ArrowLeft, KeyRound, Mail, MailCheck, Send } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import AuthHeading from "@/components/auth/AuthHeading";
import FormInput from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { Text } from "@/components/ui/typography";
import { getErrorMessage, getFieldErrors, readForm } from "@/lib/utils/page-helpers";
import { authService } from "@/services/auth.service";

export default function ForgotPasswordPage() {
	const [loading, setLoading] = useState(false);
	const [sentTo, setSentTo] = useState("");
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	async function sendResetLink(email: string) {
		setLoading(true);
		setErrors({});
		try {
			await authService.requestPasswordReset(email);
			return true;
		} catch (error) {
			setErrors(getFieldErrors(error));
			toast.error(getErrorMessage(error));
			return false;
		} finally {
			setLoading(false);
		}
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const { email } = readForm(event, "email");
		if (await sendResetLink(email)) setSentTo(email);
	}

	async function handleResend() {
		if (await sendResetLink(sentTo)) toast.success("We sent another reset link.");
	}

	return (
		<>
			{sentTo ? (
				<>
					<AuthHeading
						icon={<MailCheck />}
						title="Check your email"
						description={`If an account exists for ${sentTo}, a reset link is on its way.`}
					/>
					<Text variant="body-sm" tone="muted" className="text-center">
						Didn&apos;t receive it? Check your spam folder or{" "}
						<Button variant="link" size="inline" disabled={loading} onClick={handleResend}>
							resend the link
						</Button>
						.
					</Text>
				</>
			) : (
				<>
					<AuthHeading
						icon={<KeyRound />}
						eyebrow="Account recovery"
						title="Reset your password"
						description="Enter the university email linked to your account and we'll send you a reset link."
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
						<Button type="submit" size="lg" className="w-full" disabled={loading}>
							{loading ? "Sending…" : "Send reset link"}
							{!loading && <Send />}
						</Button>
					</form>
				</>
			)}
			<div className="mt-6 flex justify-center">
				<TextLink href="/login">
					<ArrowLeft />
					Return to sign in
				</TextLink>
			</div>
		</>
	);
}
