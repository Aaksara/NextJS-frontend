"use client";

import { BadgeCheck, BadgeX, Ban, Mail, RotateCcw, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
	useReactivateStudent,
	useResendVerification,
	useSuspendStudent,
	useUnverifyStudentEmail,
	useVerifyStudentEmail,
} from "../queries";
import type { Student } from "../types";

export default function StudentActions({ student }: { student: Student }) {
	const suspend = useSuspendStudent();
	const reactivate = useReactivateStudent();
	const verify = useVerifyStudentEmail();
	const unverify = useUnverifyStudentEmail();
	const resend = useResendVerification();

	function confirmSuspend() {
		const message = `Suspend ${student.full_name}? They are signed out and cannot sign in until reactivated.`;
		if (window.confirm(message)) suspend.mutate(student.id);
	}

	function confirmUnverify() {
		const message = `Mark ${student.full_name}'s email as unverified? They are signed out and must verify their email again before they can sign in.`;
		if (window.confirm(message)) unverify.mutate(student.id);
	}

	return (
		<div className="space-y-2 border-t pt-5">
			<Button asChild className="w-full">
				<a href={`mailto:${student.email}`}>
					<Mail />
					Email student
				</a>
			</Button>
			{student.is_email_verified ? (
				<Button
					variant="outlined"
					className="w-full"
					onClick={confirmUnverify}
					disabled={unverify.isPending}
				>
					<BadgeX />
					Mark unverified
				</Button>
			) : (
				<div className="grid grid-cols-2 gap-2">
					<Button
						variant="outlined"
						onClick={() => resend.mutate(student.id)}
						disabled={resend.isPending}
					>
						<Send />
						Resend link
					</Button>
					<Button
						variant="outlined"
						onClick={() => verify.mutate(student.id)}
						disabled={verify.isPending}
					>
						<BadgeCheck />
						Mark verified
					</Button>
				</div>
			)}
			{student.is_active ? (
				<Button
					variant="ghost"
					className="w-full text-destructive hover:bg-destructive-container hover:text-destructive-container-foreground"
					onClick={confirmSuspend}
					disabled={suspend.isPending}
				>
					<Ban />
					Suspend account
				</Button>
			) : (
				<Button
					variant="outlined"
					className="w-full"
					onClick={() => reactivate.mutate(student.id)}
					disabled={reactivate.isPending}
				>
					<RotateCcw />
					Reactivate account
				</Button>
			)}
		</div>
	);
}
