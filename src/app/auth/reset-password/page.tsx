import ResetPasswordClient from "./reset-password-client";

export const metadata = { title: "Reset password" };

type Props = { searchParams: Promise<{ uid?: string; token?: string }> };

/** Opened from the link in the password reset email. */
export default async function ResetPasswordPage({ searchParams }: Props) {
	const { uid = "", token = "" } = await searchParams;
	return <ResetPasswordClient uid={uid} token={token} />;
}
