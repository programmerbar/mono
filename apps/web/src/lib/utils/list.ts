export const joinHuman = (list: string[], conjunction = 'og') => {
	if (list.length === 0) return '';
	if (list.length === 1) return list[0];

	const head = list.slice(0, -1);
	const tail = list.slice(-1);

	return `${head.join(', ')} ${conjunction} ${tail}`;
};
