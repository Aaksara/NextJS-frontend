import type { ReactNode } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/typography";
import { formatDate, formatRelativeTime } from "@/lib/utils/format";

import type { Student } from "../types";
import StudentStatus from "./StudentStatus";

function Detail({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex justify-between gap-4">
			<Text as="dt" variant="body-sm" tone="muted">
				{label}
			</Text>
			<Text as="dd" variant="label-md" className="text-right">
				{value || "—"}
			</Text>
		</div>
	);
}

export function ProfileSection({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="space-y-3">
			<Text as="h3" variant="label-sm" tone="muted" className="uppercase tracking-wider">
				{title}
			</Text>
			{children}
		</section>
	);
}

/** Avatar, name, email and status. `heading` is the name's level on the page. */
export function StudentIdentity({
	student,
	heading = "h2",
}: {
	student: Student;
	heading?: "h1" | "h2";
}) {
	return (
		<div className="flex items-start gap-4">
			<Avatar name={student.full_name} size="lg" />
			<div className="min-w-0 flex-1 space-y-1">
				<Text as={heading} variant="headline-sm" className="text-primary">
					{student.full_name}
				</Text>
				<Text variant="body-sm" tone="muted" className="truncate">
					{student.email}
				</Text>
				<StudentStatus student={student} />
			</div>
		</div>
	);
}

export function StudentAccountDetails({ student }: { student: Student }) {
	return (
		<ProfileSection title="Account">
			<dl className="space-y-2">
				<Detail label="Student ID" value={student.student_id} />
				<Detail label="Department" value={student.department} />
				<Detail label="Phone" value={student.phone} />
				<Detail label="Joined" value={formatDate(student.date_joined)} />
				<Detail
					label="Last sign-in"
					value={student.last_login ? formatRelativeTime(student.last_login) : "Never"}
				/>
				<Detail label="Exchange requests" value={String(student.request_count)} />
			</dl>
		</ProfileSection>
	);
}
