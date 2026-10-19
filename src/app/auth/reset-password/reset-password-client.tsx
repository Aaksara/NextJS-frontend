"use client";

import { ArrowRight, CircleCheck, Lock } from "lucide-react";
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
		<AuthForm
			eyebrow="Account recovery"
			title="Set a new password."
			subtitle="Choose a password you have not used for AKSARA before."
			headerLink={{ prompt: "Remembered it?", label: "Sign in", href: "/auth/login" }}
		>
			{done ? (
				<div className="space-y-6">
					<div className="flex items-center gap-3 rounded-lg border bg-muted p-4 text-sm">
						<CircleCheck size={20} className="shrink-0 text-emerald-600" />
						Your password has been reset.
					</div>
					<Button asChild className="h-11 w-full rounded-lg shadow-md">
						<Link href="/auth/login">
							Continue to sign in
							<ArrowRight />
						</Link>
					</Button>
				</div>
			) : (
				<form className="space-y-4" onSubmit={handleSubmit}>
					<FormInput
						id="new_password"
						label="New password"
						type="password"
						autoComplete="new-password"
						placeholder="At least 8 characters"
						icon={<Lock size={16} />}
						errors={errors.new_password}
					/>
					<Button type="submit" className="h-11 w-full rounded-lg shadow-md" disabled={loading}>
						{loading ? "Saving…" : "Set new password"}
					</Button>
				</form>
			)}
		</AuthForm>
	);
}
