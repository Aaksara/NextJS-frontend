import { type Paginated, requestApi, requestFile } from "@/lib/api/api-client";

import { studentQueryParams } from "./query-params";
import type { DirectorySummary, Student, StudentDetail, StudentQuery } from "./types";

const STUDENTS = "/api/admin/students/";

const action = (id: number, name: string) =>
	requestApi<StudentDetail>(`${STUDENTS}${id}/${name}/`, { method: "POST" });

export const studentService = {
	list: (query: StudentQuery) =>
		requestApi<Paginated<Student>>(`${STUDENTS}?${studentQueryParams(query)}`),

	get: (id: number) => requestApi<StudentDetail>(`${STUDENTS}${id}/`),

	getSummary: () => requestApi<DirectorySummary>(`${STUDENTS}summary/`),

	/** Every student matching the filters, as a CSV file. */
	exportCsv: (query: StudentQuery) =>
		requestFile(`${STUDENTS}export/?${studentQueryParams(query, false)}`),

	/** Blocks sign-in and ends the student's sessions. */
	suspend: (id: number) => action(id, "suspend"),

	reactivate: (id: number) => action(id, "reactivate"),

	/** Marks the email verified without the emailed link, e.g. after an ID check. */
	verifyEmail: (id: number) => action(id, "verify-email"),

	resendVerification: (id: number) =>
		requestApi<{ detail: string }>(`${STUDENTS}${id}/resend-verification/`, { method: "POST" }),
};
