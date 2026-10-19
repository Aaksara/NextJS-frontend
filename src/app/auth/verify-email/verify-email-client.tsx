"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import AuthForm from "@/components/form/AuthForm";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils/page-helpers";
import { authService } from "@/services/auth.service";

export default function VerifyEmailClient({ uid, token }: { uid: string; token: string }) {
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);

	async function handleVerify() {
		setLoading(true);
		try {
			await authService.verifyEmail(uid, token);
			setDone(true);
		} catch (error) {
			toast.error(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	}

	if (done) {
		return (
			<AuthForm title="Email verified" subtitle="Your account is ready. Sign in to get started.">
				<Button asChild size="lg" className="w-full">
					<Link href="/auth/login">Sign in</Link>
				</Button>
			</AuthForm>
		);
	}

	return (
		<AuthForm
			title="Verify your email"
			subtitle="Confirm your university email to start exchanging books."
		>
			<Button size="lg" className="w-full" disabled={loading} onClick={handleVerify}>
				{loading ? "Verifying…" : "Verify email"}
			</Button>
		</AuthForm>
	);
}
