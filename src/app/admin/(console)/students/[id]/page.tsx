import type { Metadata } from "next";
import { notFound } from "next/navigation";

import StudentDetailView from "@/features/admin/students/components/StudentDetailView";

export const metadata: Metadata = { title: "Student" };

export default async function StudentPage({ params }: PageProps<"/admin/students/[id]">) {
	const id = Number((await params).id);
	if (!Number.isInteger(id) || id <= 0) notFound();
	return <StudentDetailView studentId={id} />;
}
