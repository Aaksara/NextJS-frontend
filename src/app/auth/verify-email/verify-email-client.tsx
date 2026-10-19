"use client";

import { ArrowRight, CircleCheck, MailCheck } from "lucide-react";
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

	return (
		<AuthForm
			eyebrow="One last step"
			title={done ? "You're verified." : "Verify your email."}
			subtitle={
				done
					? "Your university email is confirmed. You can now sign in."
					: "Confirm your university email to start exchanging books."
			}
		>
			{done ? (
				<div className="space-y-6">
					<div className="flex items-center gap-3 rounded-lg border bg-muted p-4 text-sm">
						<CircleCheck size={20} className="shrink-0 text-emerald-600" />
						Your email is verified.
					</div>
					<Button asChild className="h-11 w-full rounded-lg shadow-md">
						<Link href="/auth/login">
							Continue to sign in
							<ArrowRight />
						</Link>
					</Button>
				</div>
			) : (
				<Button
					className="h-11 w-full rounded-lg shadow-md"
					disabled={loading}
					onClick={handleVerify}
				>
					<MailCheck />
					{loading ? "Verifying…" : "Verify my email"}
				</Button>
			)}
		</AuthForm>
	);
}
