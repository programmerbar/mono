import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies, locals }) => {
	const sessionId = cookies.get(locals.lucia.sessionCookieName);

	if (!sessionId) return new Response('Not logged in', { status: 401 });

	await locals.lucia.invalidateSession(sessionId);

	cookies.delete(locals.lucia.sessionCookieName, {
		path: '/'
	});

	redirect(302, '/');
};
