import type { Metadata } from "next";

import StudentsView from "@/features/admin/students/components/StudentsView";

export const metadata: Metadata = { title: "Student directory" };

export default function StudentsPage() {
	return <StudentsView />;
}
