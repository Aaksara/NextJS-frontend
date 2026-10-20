"use client";

import { ArrowRight, Lock, Mail, MailCheck, UserRound } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import AuthFooter from "@/components/auth/AuthFooter";
import AuthHeading from "@/components/auth/AuthHeading";
import FormInput from "@/components/form/FormInput";
import PasswordStrength from "@/components/form/PasswordStrength";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/typography";
import { getErrorMessage, getFieldErrors, readForm } from "@/lib/utils/page-helpers";
import { authService } from "@/services/auth.service";

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);
	const [password, setPassword] = useState("");
	const [sentTo, setSentTo] = useState("");
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const { full_name, email } = readForm(event, "full_name", "email");
		setLoading(true);
		setErrors({});
		try {
			await authService.register({ full_name, email, password });
			setSentTo(email);
		} catch (error) {
			setErrors(getFieldErrors(error));
			toast.error(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	}

	if (sentTo) {
		return (
			<>
				<AuthHeading
					icon={<MailCheck />}
					title="Check your email"
					description={
						<>
							We sent a verification link to{" "}
							<Text as="strong" variant="label-lg" tone="foreground">
								{sentTo}
							</Text>
							. Open it to activate your account. If it hasn&apos;t arrived in a few minutes, check
							your spam folder.
						</>
					}
				/>
				<AuthFooter prompt="Already verified?" label="Sign in" href="/login" />
			</>
		);
	}

	return (
		<>
			<AuthHeading
				eyebrow="Verified students only"
				title="Join Akshara"
				description="The peer-to-peer textbook exchange for verified students. We'll email you a link to confirm your address."
			/>
			<form className="space-y-5" onSubmit={handleSubmit}>
				<FormInput
					id="full_name"
					label="Full name"
					icon={<UserRound />}
					autoComplete="name"
					placeholder="e.g. Maya Lin"
					labelAside={
						<Text as="span" variant="body-sm" tone="muted">
							As shown on your student ID
						</Text>
					}
					errors={errors.full_name}
				/>
				<FormInput
					id="email"
					label="University email"
					type="email"
					icon={<Mail />}
					autoComplete="email"
					placeholder="you@university.edu"
					errors={errors.email}
				/>
				<div className="space-y-2">
					<FormInput
						id="password"
						label="Create password"
						type="password"
						icon={<Lock />}
						autoComplete="new-password"
						placeholder="At least 8 characters"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						errors={errors.password}
					/>
					<PasswordStrength password={password} />
				</div>
				<Label className="items-start">
					<Checkbox name="terms" required className="mt-0.5" />I agree to exchange books fairly and
					to meet other students in safe, public places on campus.
				</Label>
				<Button type="submit" size="lg" className="w-full" disabled={loading}>
					{loading ? "Creating account…" : "Create account"}
					{!loading && <ArrowRight />}
				</Button>
			</form>
			<AuthFooter prompt="Already have an account?" label="Sign in" href="/login" />
		</>
	);
}
