"use client";

import { Lock } from "lucide-react";
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

	return (
		<AuthForm title="Reset password">
			{done ? (
				<p className="text-center text-sm">
					Your password has been reset.{" "}
					<Link href="/auth/login" className="underline">
						Sign in
					</Link>
				</p>
			) : (
				<form className="space-y-4" onSubmit={handleSubmit}>
					<FormInput
						id="new_password"
						label="New password"
						type="password"
						autoComplete="new-password"
						icon={<Lock size={16} />}
						errors={errors.new_password}
					/>
					<Button type="submit" className="w-full" disabled={loading}>
						Set new password
					</Button>
				</form>
			)}
		</AuthForm>
	);
}
