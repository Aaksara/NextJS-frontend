import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { sessionKey } from "@/components/providers/QueryProvider";
import { authService } from "@/services/auth.service";

import { STUDENT_HOME } from "./routes";

export const studentSessionKey = [...sessionKey, "student"] as const;

/** The signed-in student, or `null` when signed out. */
export function useStudentSession() {
	return useQuery({
		queryKey: studentSessionKey,
		queryFn: authService.getSignedInUser,
		retry: false,
	});
}

/** The signed-in student. Only for components inside `StudentGate`, which waits for them. */
export function useStudent() {
	const { data } = useStudentSession();
	if (!data) throw new Error("useStudent must be used inside StudentGate");
	return data;
}

export function useStudentSignOut() {
	const queryClient = useQueryClient();
	const router = useRouter();
	return useMutation({
		mutationFn: authService.logout,
		onSettled: () => {
			// Nothing loaded for this student may survive into the next session.
			queryClient.clear();
			router.replace("/");
		},
	});
}

/**
 * Where to go after signing in. Only portal paths are accepted, so a crafted
 * `?next=https://evil.example` link cannot send the student off-site.
 */
export function safeStudentPath(next: string | null) {
	if (next === STUDENT_HOME || next?.startsWith(`${STUDENT_HOME}/`)) return next;
	return STUDENT_HOME;
}
