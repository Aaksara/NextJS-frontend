"use client";

import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";
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
			<AuthForm title="Check your email">
				<p className="text-center text-sm">We sent a verification link to your university email.</p>
			</AuthForm>
		);
	}

	return (
		<AuthForm title="Create account" subtitle="Use your university email address.">
			<form className="space-y-4" onSubmit={handleSubmit}>
				<FormInput
					id="full_name"
					label="Full name"
					autoComplete="name"
					icon={<User size={16} />}
					errors={errors.full_name}
				/>
				<FormInput
					id="email"
					label="Email"
					type="email"
					autoComplete="email"
					icon={<Mail size={16} />}
					errors={errors.email}
				/>
				<FormInput
					id="password"
					label="Password"
					type="password"
					autoComplete="new-password"
					icon={<Lock size={16} />}
					errors={errors.password}
				/>
				<Button type="submit" className="w-full" disabled={loading}>
					Create account
				</Button>
			</form>
			<p className="mt-4 text-center text-sm">
				Already registered?{" "}
				<Link href="/auth/login" className="hover:underline">
					Sign in
				</Link>
			</p>
		</AuthForm>
	);
}
