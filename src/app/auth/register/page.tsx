"use client";

import { ArrowRight, Lock, Mail, MailCheck, User } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import AuthForm from "@/components/form/AuthForm";
import FormInput from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { getErrorMessage, getFieldErrors, readForm } from "@/lib/utils/page-helpers";
import { authService } from "@/services/auth.service";

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const { full_name, email, password } = readForm(event, "full_name", "email", "password");
		setLoading(true);
		setErrors({});
		try {
			await authService.register({ full_name, email, password });
			setDone(true);
		} catch (error) {
			setErrors(getFieldErrors(error));
			toast.error(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	}

	if (done) {
		return (
			<AuthForm
				eyebrow="Almost there"
				title="Check your email."
				subtitle="We sent a verification link to your university email. Open it to activate your account."
				headerLink={{ prompt: "Already verified?", label: "Sign in", href: "/auth/login" }}
			>
				<div className="flex items-center gap-3 rounded-lg border bg-muted p-4 text-sm">
					<MailCheck size={20} className="shrink-0 text-brand" />
					The link may take a minute to arrive. Check your spam folder too.
				</div>
			</AuthForm>
		);
	}

	return (
		<AuthForm
			eyebrow="Create your account"
			title="Join AKSARA today."
			subtitle="Sign up with your university email to start finding affordable course books."
			headerLink={{ prompt: "Already have an account?", label: "Sign in", href: "/auth/login" }}
		>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<FormInput
					id="full_name"
					label="Full name"
					autoComplete="name"
					placeholder="Your full name"
					icon={<User size={16} />}
					errors={errors.full_name}
				/>
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
					label="Create password"
					type="password"
					autoComplete="new-password"
					placeholder="At least 8 characters"
					icon={<Lock size={16} />}
					errors={errors.password}
				/>
				<Button type="submit" className="h-11 w-full rounded-lg shadow-md" disabled={loading}>
					{loading ? "Creating account…" : "Create my account"}
					{!loading && <ArrowRight />}
				</Button>
			</form>
		</AuthForm>
	);
}
