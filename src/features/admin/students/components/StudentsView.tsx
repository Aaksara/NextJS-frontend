"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import EmptyState from "@/components/admin/EmptyState";
import PageHeader from "@/components/admin/PageHeader";
import QueryState from "@/components/admin/QueryState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { saveFile } from "@/lib/utils/download";
import { formatNumber } from "@/lib/utils/format";
import { getErrorMessage } from "@/lib/utils/page-helpers";

import { STUDENT_PAGE_SIZE } from "../constants";
import { useStudents } from "../queries";
import { studentService } from "../service";
import type { StudentFilter, StudentQuery } from "../types";
import DirectoryStats from "./DirectoryStats";
import StudentProfile from "./StudentProfile";
import StudentTable from "./StudentTable";

export default function StudentsView() {
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<StudentFilter>("all");
	const [page, setPage] = useState(1);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [exporting, setExporting] = useState(false);

	const filters: StudentQuery = {
		search: useDebouncedValue(search),
		filter,
		page,
	};
	const query = useStudents(filters);
	const students = query.data?.results ?? [];
	const total = query.data?.count ?? 0;
	const pageCount = Math.max(1, Math.ceil(total / STUDENT_PAGE_SIZE));
	// Falls back to the first row shown, so the profile panel is never empty while there are results.
	const profileId = students.some((student) => student.id === selectedId)
		? selectedId
		: (students[0]?.id ?? null);

	function changeFilters(update: () => void) {
		update();
		setPage(1);
	}

	async function exportRoster() {
		setExporting(true);
		try {
			const file = await studentService.exportCsv(filters);
			saveFile(file, `students-${new Date().toISOString().slice(0, 10)}.csv`);
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
		setExporting(false);
	}

	return (
		<>
			<PageHeader
				title="Student directory"
				description="Every student account: verification, activity and suspensions."
				actions={
					<Button variant="outlined" onClick={exportRoster} disabled={exporting || total === 0}>
						<Download />
						{exporting ? "Exporting…" : "Export CSV"}
					</Button>
				}
			/>

			<DirectoryStats />

			<div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
				<Card className="gap-0 overflow-hidden py-0">
					<div className="grid gap-3 border-b p-4 sm:grid-cols-[2fr_1fr]">
						<SearchInput
							placeholder="Search name, email, ID or department"
							value={search}
							onChange={(event) => changeFilters(() => setSearch(event.target.value))}
						/>
						<Select
							aria-label="Show"
							value={filter}
							onChange={(event) =>
								changeFilters(() => setFilter(event.target.value as StudentFilter))
							}
						>
							<option value="all">All students</option>
							<option value="unverified">Unverified email</option>
							<option value="suspended">Suspended</option>
						</Select>
					</div>

					<QueryState isPending={query.isPending} error={query.error} onRetry={query.refetch} />
					{query.isSuccess &&
						(students.length === 0 ? (
							<EmptyState
								title="No students match"
								hint="Try another search, or show all students."
							/>
						) : (
							<>
								<StudentTable students={students} selectedId={profileId} onSelect={setSelectedId} />
								<Pagination
									page={page}
									pageCount={pageCount}
									onPageChange={setPage}
									summary={`${formatNumber(total)} students`}
									className="border-t"
								/>
							</>
						))}
				</Card>

				{profileId !== null && <StudentProfile studentId={profileId} />}
			</div>
		</>
	);
}
