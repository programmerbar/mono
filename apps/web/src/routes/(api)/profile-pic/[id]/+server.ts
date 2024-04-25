export const GET = async ({ platform, params }) => {
	const id = params.id;

	const avatarPath = `avatars/${id}`;
	const avatar = await platform?.env.R2.get(avatarPath);

	if (!avatar) {
		return new Response(null, { status: 404 });
	}

	const headers = new Headers(Object.entries(avatar?.httpMetadata ?? {}));
	headers.set('etag', avatar?.etag ?? '');

	return new Response(avatar?.body, { headers });
};
