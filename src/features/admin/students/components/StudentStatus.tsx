import { BadgeCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { Student } from "../types";

/** The one status that matters most: suspended, then unverified, else verified. */
export default function StudentStatus({ student }: { student: Student }) {
	if (!student.is_active) {
		return (
			<Badge tone="destructive" size="sm" dot>
				Suspended
			</Badge>
		);
	}
	if (!student.is_email_verified) {
		return (
			<Badge tone="warning" size="sm" dot>
				Unverified
			</Badge>
		);
	}
	return (
		<Badge tone="success" size="sm">
			<BadgeCheck />
			Verified
		</Badge>
	);
}
