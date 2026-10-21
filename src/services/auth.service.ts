import { ApiRequestError, requestApi, tokenStorage } from "@/lib/api/api-client";

export type User = {
	id: number;
	email: string;
	full_name: string;
	student_id: string;
	department: string;
	phone: string;
	avatar: string | null;
	is_email_verified: boolean;
	/** The platform's single super admin, who may use the admin console. */
	is_superuser: boolean;
	date_joined: string;
};

type LoginResponse = { access: string; refresh: string; user: User };

export type RegisterInput = { full_name: string; email: string; password: string };

export const authService = {
	login: async (email: string, password: string, remember: boolean) => {
		const data = await requestApi<LoginResponse>("/api/auth/login/", {
			body: { email, password },
		});
		tokenStorage.set(data.access, data.refresh, remember);
		return data.user;
	},

	logout: async () => {
		const refresh = tokenStorage.getRefresh();
		if (refresh) {
			// Best effort: the tokens are removed from this browser either way.
			await requestApi("/api/auth/logout/", { body: { refresh } }).catch(() => {});
		}
		tokenStorage.clear();
	},

	getCurrentUser: () => requestApi<User>("/api/auth/me/"),

	/** The signed-in user, or `null` when nobody is signed in or the session has expired. */
	getSignedInUser: async () => {
		if (!tokenStorage.getRefresh()) return null;
		try {
			return await authService.getCurrentUser();
		} catch (error) {
			if (error instanceof ApiRequestError && error.status === 401) return null;
			throw error;
		}
	},

	register: (input: RegisterInput) => requestApi("/api/auth/register/", { body: input }),

	verifyEmail: (uid: string, token: string) =>
		requestApi("/api/auth/verify-email/", { body: { uid, token } }),

	requestPasswordReset: (email: string) =>
		requestApi("/api/auth/password/reset/", { body: { email } }),

	resetPassword: (uid: string, token: string, newPassword: string) =>
		requestApi("/api/auth/password/reset/confirm/", {
			body: { uid, token, new_password: newPassword },
		}),
};
