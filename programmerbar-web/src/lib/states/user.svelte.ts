import type { User } from 'lucia';
import { getContext, setContext } from 'svelte';

export type UserState = {
	current: User | null;
};

const AUTH_CONTEXT_KEY = '__auth';

export function setUserContext(initialUser: UserState) {
	return setContext<UserState>(AUTH_CONTEXT_KEY, initialUser);
}

export function getUser() {
	return getContext<UserState>(AUTH_CONTEXT_KEY);
}

export function getAuthenticatedUser() {
	const userState = getUser();

	if (!userState.current) {
		throw new Error('User context not found');
	}

	return userState;
}
