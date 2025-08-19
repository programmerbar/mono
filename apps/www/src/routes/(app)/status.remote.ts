import { getRequestEvent, query } from '$app/server';

export const getStatus = query(async () => {
	const { locals } = getRequestEvent();
	return await locals.statusService.getWithMessage();
});
