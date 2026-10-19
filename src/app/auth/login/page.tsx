"use client";

import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import AuthForm from "@/components/form/AuthForm";
import FormInput from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { getErrorMessage, getFieldErrors, readForm } from "@/lib/utils/page-helpers";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const { email, password } = readForm(event, "email", "password");
		setLoading(true);
		setErrors({});
		try {
			await authService.login(email, password);
			router.push("/");
		} catch (error) {
			setErrors(getFieldErrors(error));
			toast.error(getErrorMessage(error));
			setLoading(false);
		}
	}

	return (
		<AuthForm title="Sign in" subtitle="Use your university email address.">
			<form className="space-y-4" onSubmit={handleSubmit}>
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
					autoComplete="current-password"
					icon={<Lock size={16} />}
					errors={errors.password}
				/>
				<Button type="submit" className="w-full" disabled={loading}>
					Sign in
				</Button>
			</form>
			<div className="mt-4 flex justify-between text-sm">
				<Link href="/auth/forgot-password" className="text-muted-foreground hover:underline">
					Forgot password?
				</Link>
				<Link href="/auth/register" className="hover:underline">
					Create account
				</Link>
			</div>
		</AuthForm>
	);
}
