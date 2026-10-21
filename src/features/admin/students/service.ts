import { type Paginated, requestApi, requestFile } from "@/lib/api/api-client";

import { listingQueryParams, studentQueryParams } from "./query-params";
import type {
	ActivityPage,
	DirectorySummary,
	Student,
	StudentDetail,
	StudentListing,
	StudentListingQuery,
	StudentQuery,
} from "./types";

const STUDENTS = "/api/admin/students/";

const action = (id: number, name: string) =>
	requestApi<StudentDetail>(`${STUDENTS}${id}/${name}/`, { method: "POST" });

export const studentService = {
	list: (query: StudentQuery) =>
		requestApi<Paginated<Student>>(`${STUDENTS}?${studentQueryParams(query)}`),

	get: (id: number) => requestApi<StudentDetail>(`${STUDENTS}${id}/`),

	listings: (id: number, query: StudentListingQuery) =>
		requestApi<Paginated<StudentListing>>(
			`${STUDENTS}${id}/listings/?${listingQueryParams(query)}`,
		),

	activity: (id: number, limit: number) =>
		requestApi<ActivityPage>(`${STUDENTS}${id}/activity/?limit=${limit}`),

	getSummary: () => requestApi<DirectorySummary>(`${STUDENTS}summary/`),

	exportCsv: (query: StudentQuery) =>
		requestFile(`${STUDENTS}export/?${studentQueryParams(query, false)}`),

	/** Blocks sign-in and ends the student's sessions. */
	suspend: (id: number) => action(id, "suspend"),

	reactivate: (id: number) => action(id, "reactivate"),

	/** Marks the email verified without the emailed link, e.g. after an ID check. */
	verifyEmail: (id: number) => action(id, "verify-email"),

	/** Withdraws verification. Unverified students cannot sign in, so this signs them out. */
	unverifyEmail: (id: number) => action(id, "unverify-email"),

	resendVerification: (id: number) =>
		requestApi<{ detail: string }>(`${STUDENTS}${id}/resend-verification/`, { method: "POST" }),
};
