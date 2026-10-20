import { STUDENT_PAGE_SIZE } from "./constants";
import type { StudentQuery } from "./types";

/**
 * The API's query string for a directory view. "Any" filters are left out, and
 * `withPage` is off for exports, which always cover every matching student.
 */
export function studentQueryParams(query: StudentQuery, withPage = true) {
	const params = new URLSearchParams({ ordering: "-date_joined" });
	const search = query.search.trim();
	if (search) params.set("search", search);
	if (query.verification !== "any") {
		params.set("is_email_verified", String(query.verification === "verified"));
	}
	if (query.account !== "any") params.set("is_active", String(query.account === "active"));
	if (withPage) {
		params.set("page", String(query.page));
		params.set("page_size", String(STUDENT_PAGE_SIZE));
	}
	return params.toString();
}
