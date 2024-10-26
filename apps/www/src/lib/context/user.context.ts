import type { User } from 'lucia';
import { getContext, setContext } from 'svelte';

export const AUTH_KEY = 'user';

export type AuthContext = {
	user: User | null;
};

export const setAuthContext = (ctx: AuthContext) => {
	setContext(AUTH_KEY, ctx);
};

export const getAuthContext = () => {
	return getContext<AuthContext>(AUTH_KEY);
};
