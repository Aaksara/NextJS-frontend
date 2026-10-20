"use client";

import { CircleCheck, Lock } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import AuthHeading from "@/components/auth/AuthHeading";
import FormInput from "@/components/form/FormInput";
import PasswordStrength from "@/components/form/PasswordStrength";
import { Button } from "@/components/ui/button";
import { getErrorMessage, getFieldErrors } from "@/lib/utils/page-helpers";
import { authService } from "@/services/auth.service";

export default function ResetPasswordClient({ uid, token }: { uid: string; token: string }) {
	const [loading, setLoading] = useState(false);
	const [password, setPassword] = useState("");
	const [done, setDone] = useState(false);
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		setErrors({});
		try {
			await authService.resetPassword(uid, token, password);
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
			<>
				<AuthHeading
					icon={<CircleCheck />}
					title="Password updated"
					description="You can now sign in with your new password."
				/>
				<Button asChild size="lg" className="w-full">
					<Link href="/login">Sign in</Link>
				</Button>
			</>
		);
	}

	return (
		<>
			<AuthHeading
				eyebrow="Account recovery"
				title="Set a new password"
				description="Choose a password you don't use on other sites."
			/>
			<form className="space-y-5" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<FormInput
						id="new_password"
						label="New password"
						type="password"
						icon={<Lock />}
						autoComplete="new-password"
						placeholder="At least 8 characters"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						errors={errors.new_password}
					/>
					<PasswordStrength password={password} />
				</div>
				<Button type="submit" size="lg" className="w-full" disabled={loading}>
					{loading ? "Saving…" : "Update password"}
				</Button>
			</form>
		</>
	);
}
