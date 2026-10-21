"use client";

import { LogOut } from "lucide-react";

import Brand from "@/components/layout/Brand";
import Container from "@/components/layout/Container";
import { Avatar } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/typography";

import { useStudent, useStudentSignOut } from "../session";
import StudentNav from "./StudentNav";

export default function StudentHeader() {
	const student = useStudent();
	const signOut = useStudentSignOut();

	return (
		<header className="sticky top-0 z-30 border-b bg-card/85 backdrop-blur">
			<Container className="flex h-16 items-center gap-6">
				<Brand />
				<StudentNav className="hidden md:block" />
				<div className="ml-auto flex items-center gap-3">
					<Avatar name={student.full_name} size="sm" />
					<div className="hidden text-right sm:block">
						<Text variant="label-md">{student.full_name}</Text>
						<Text variant="body-sm" tone="muted">
							{student.email}
						</Text>
					</div>
					<IconButton
						variant="ghost"
						label="Sign out"
						onClick={() => signOut.mutate()}
						disabled={signOut.isPending}
					>
						<LogOut />
					</IconButton>
				</div>
			</Container>
			<Container className="border-t py-2 md:hidden">
				<StudentNav />
			</Container>
		</header>
	);
}
