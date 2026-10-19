"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import AuthForm from "@/components/form/AuthForm";
import FormInput from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { getErrorMessage, getFieldErrors, readForm } from "@/lib/utils/page-helpers";
import { authService } from "@/services/auth.service";

export default function ResetPasswordClient({ uid, token }: { uid: string; token: string }) {
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const { new_password } = readForm(event, "new_password");
		setLoading(true);
		setErrors({});
		try {
			await authService.resetPassword(uid, token, new_password);
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
			<AuthForm title="Password updated" subtitle="You can now sign in with your new password.">
				<Button asChild size="lg" className="w-full">
					<Link href="/auth/login">Sign in</Link>
				</Button>
			</AuthForm>
		);
	}

	return (
		<AuthForm
			title="Set a new password"
			headerLink={{ prompt: "Remembered it?", label: "Sign in", href: "/auth/login" }}
		>
			<form className="space-y-5" onSubmit={handleSubmit}>
				<FormInput
					id="new_password"
					label="New password"
					type="password"
					autoComplete="new-password"
					placeholder="At least 8 characters"
					errors={errors.new_password}
				/>
				<Button type="submit" size="lg" className="w-full" disabled={loading}>
					{loading ? "Saving…" : "Update password"}
				</Button>
			</form>
		</AuthForm>
	);
}
