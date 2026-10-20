"use client";

import { CircleCheck, MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import AuthHeading from "@/components/auth/AuthHeading";
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
			<>
				<AuthHeading
					icon={<CircleCheck />}
					title="Email verified"
					description="Your account is ready. Sign in to get started."
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
				icon={<MailCheck />}
				eyebrow="Email verification"
				title="Verify your email"
				description="Confirm your university email to start exchanging books."
			/>
			<Button size="lg" className="w-full" disabled={loading} onClick={handleVerify}>
				{loading ? "Verifying…" : "Verify email"}
			</Button>
		</>
	);
}
