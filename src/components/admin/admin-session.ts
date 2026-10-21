import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { sessionKey } from "@/components/providers/QueryProvider";
import { authService } from "@/services/auth.service";

const ADMIN_HOME = "/admin";
export const ADMIN_LOGIN = "/admin/login";

export const adminSessionKey = [...sessionKey, "admin"] as const;

/** The signed-in super admin, or `null` when nobody, or a student, is signed in. */
async function loadSuperAdmin() {
	const user = await authService.getSignedInUser();
	return user?.is_superuser ? user : null;
}

export function useAdminSession() {
	return useQuery({ queryKey: adminSessionKey, queryFn: loadSuperAdmin, retry: false });
}

export function useSignOut() {
	const queryClient = useQueryClient();
	const router = useRouter();
	return useMutation({
		mutationFn: authService.logout,
		onSettled: () => {
			// Nothing loaded for the admin may survive into the next session.
			queryClient.clear();
			router.replace(ADMIN_LOGIN);
		},
	});
}

/**
 * Where to go after signing in. Only console paths are accepted, so a crafted
 * `?next=https://evil.example` link cannot send the admin off-site.
 */
export function safeNextPath(next: string | null) {
	if (next?.startsWith(`${ADMIN_HOME}/`) && !next.startsWith(ADMIN_LOGIN)) return next;
	return ADMIN_HOME;
}
