"use client";

import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import Link from "next/link";
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
			eyebrow="Account recovery"
			title="Forgot your password?"
			subtitle="Enter your university email and we will send you a reset link."
			headerLink={{ prompt: "Remembered it?", label: "Sign in", href: "/auth/login" }}
		>
			{done ? (
				<div className="flex items-center gap-3 rounded-lg border bg-muted p-4 text-sm">
					<MailCheck size={20} className="shrink-0 text-brand" />
					If an account exists for that email, a reset link has been sent.
				</div>
			) : (
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
					<Button type="submit" className="h-11 w-full rounded-lg shadow-md" disabled={loading}>
						{loading ? "Sending…" : "Send reset link"}
					</Button>
				</form>
			)}
			<Link
				href="/auth/login"
				className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft size={14} />
				Back to sign in
			</Link>
		</AuthForm>
	);
}
