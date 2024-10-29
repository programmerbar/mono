import { dev } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';
import type { Cookie } from 'lucia';

export const setSessionCookie = (cookies: Cookies, name: string, sessionCookie: Cookie) => {
  cookies.set(name, sessionCookie.value, {
    ...sessionCookie.attributes,
    path: '/',
    httpOnly: true,
    secure: !dev
  });
};
