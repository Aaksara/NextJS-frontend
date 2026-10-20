"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { tokenStorage } from "@/lib/api/api-client";
import { authService, type User } from "@/services/auth.service";

type Session = {
	/** `undefined` while loading, `null` when signed out. */
	user: User | null | undefined;
	signOut: () => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

/** Loads the signed-in student once for the whole landing page. */
export function SessionProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>();

	useEffect(() => {
		// Visitors who have never signed in have no token, so skip the request.
		const request = tokenStorage.getRefresh()
			? authService.getCurrentUser()
			: Promise.resolve(null);
		request.then(setUser, () => setUser(null));
	}, []);

	const signOut = useCallback(async () => {
		await authService.logout();
		setUser(null);
	}, []);

	const value = useMemo(() => ({ user, signOut }), [user, signOut]);
	return <SessionContext value={value}>{children}</SessionContext>;
}

export function useSession() {
	const session = useContext(SessionContext);
	if (!session) throw new Error("useSession must be used inside SessionProvider");
	return session;
}

/**
 * Renders its children unless a student is signed in. They show while the session loads,
 * so most visitors, who are signed out, never wait for them.
 */
export function SignedOut({ children }: { children: ReactNode }) {
	const { user } = useSession();
	return user ? null : children;
}
