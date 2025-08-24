export const mailto = (email: string) => `mailto:${email}`;

export const initials = (str: string) =>
	str
		.split(' ')
		.map((word) => word[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
