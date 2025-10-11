export const mailto = (email: string) => `mailto:${email}`;

export const initials = (str: string) =>
	str
		.split(' ')
		.map((word) => word[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const slugReplacements: Record<string, string> = {
	æ: 'ae',
	ø: 'o',
	å: 'a',
	ä: 'a',
	ö: 'o',
	ü: 'u',
	é: 'e',
	è: 'e',
	ê: 'e',
	á: 'a',
	à: 'a',
	â: 'a',
	í: 'i',
	ì: 'i',
	î: 'i',
	ó: 'o',
	ò: 'o',
	ô: 'o',
	ú: 'u',
	ù: 'u',
	û: 'u',
	ç: 'c',
	ß: 'ss'
};

export const slugify = (str: string): string => {
	const normalized = str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

	const replaced = Object.entries(slugReplacements).reduce((value, [char, replacement]) => {
		return value.replace(new RegExp(char, 'gi'), (match) =>
			match === match.toUpperCase() ? replacement.toUpperCase() : replacement
		);
	}, normalized);

	return replaced
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
};
