export const initials = (name: string) => {
	const parts = name.split(' ');

	if (parts.length === 1) {
		return parts[0].charAt(0).toUpperCase();
	}

	return parts
		.map((part) => part.charAt(0).toUpperCase())
		.join('')
		.slice(0, 2);
};
