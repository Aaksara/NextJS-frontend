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

	return (
		<AuthForm title="Verify email">
			{done ? (
				<p className="text-center text-sm">
					Your email is verified.{" "}
					<Link href="/auth/login" className="underline">
						Sign in
					</Link>
				</p>
			) : (
				<Button className="w-full" disabled={loading} onClick={handleVerify}>
					Verify my email
				</Button>
			)}
		</AuthForm>
	);
}
