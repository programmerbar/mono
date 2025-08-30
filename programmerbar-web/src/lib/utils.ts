export const mailto = (email: string) => `mailto:${email}`;

export const initials = (str: string) =>
	str
		.split(' ')
		.map((word) => word[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const slugify = (str: string): string =>
	str
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
