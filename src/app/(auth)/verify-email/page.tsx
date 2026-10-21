import VerifyEmailClient from "./verify-email-client";

export const metadata = { title: "Verify email" };

type Props = { searchParams: Promise<{ uid?: string; token?: string }> };

export default async function VerifyEmailPage({ searchParams }: Props) {
	const { uid = "", token = "" } = await searchParams;
	return <VerifyEmailClient uid={uid} token={token} />;
}
