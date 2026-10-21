import {
	keepPreviousData,
	skipToken,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/utils/page-helpers";

import { studentService } from "./service";
import type { StudentListingQuery, StudentQuery } from "./types";

const all = ["admin", "students"] as const;

/** Everything is under `all`, so one invalidation refreshes lists, profiles and totals. */
const studentKeys = {
	all,
	list: (query: StudentQuery) => [...all, "list", query] as const,
	detail: (id: number | null) => [...all, "detail", id] as const,
	listings: (id: number, query: StudentListingQuery) => [...all, "listings", id, query] as const,
	activity: (id: number, limit: number) => [...all, "activity", id, limit] as const,
	summary: [...all, "summary"] as const,
};

export function useStudents(query: StudentQuery) {
	return useQuery({
		queryKey: studentKeys.list(query),
		queryFn: () => studentService.list(query),
		placeholderData: keepPreviousData,
	});
}

export function useStudent(id: number | null) {
	return useQuery({
		queryKey: studentKeys.detail(id),
		queryFn: id === null ? skipToken : () => studentService.get(id),
	});
}

export function useStudentListings(id: number, query: StudentListingQuery) {
	return useQuery({
		queryKey: studentKeys.listings(id, query),
		queryFn: () => studentService.listings(id, query),
		placeholderData: keepPreviousData,
	});
}

export function useStudentActivity(id: number, limit: number) {
	return useQuery({
		queryKey: studentKeys.activity(id, limit),
		queryFn: () => studentService.activity(id, limit),
		placeholderData: keepPreviousData,
	});
}

export function useDirectorySummary() {
	return useQuery({ queryKey: studentKeys.summary, queryFn: studentService.getSummary });
}

function useStudentAction(action: (id: number) => Promise<unknown>, successMessage: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: action,
		onSuccess: () => toast.success(successMessage),
		onError: (error) => toast.error(getErrorMessage(error)),
		onSettled: () => queryClient.invalidateQueries({ queryKey: studentKeys.all }),
	});
}

export const useSuspendStudent = () =>
	useStudentAction(studentService.suspend, "Account suspended and signed out");

export const useReactivateStudent = () =>
	useStudentAction(studentService.reactivate, "Account reactivated");

export const useVerifyStudentEmail = () =>
	useStudentAction(studentService.verifyEmail, "Email marked as verified");

export const useUnverifyStudentEmail = () =>
	useStudentAction(studentService.unverifyEmail, "Email marked as unverified and signed out");

export const useResendVerification = () =>
	useStudentAction(studentService.resendVerification, "Verification email sent");
