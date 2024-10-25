export type Dateish = string | Date | number;

export const formatDate = (date: Dateish) => {
	return Intl.DateTimeFormat('nb-NO', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		timeZone: 'Europe/Oslo'
	}).format(new Date(date));
};

export const time = (date: Dateish) => {
	return Intl.DateTimeFormat('nb-NO', {
		hour: 'numeric',
		minute: 'numeric',
		timeZone: 'Europe/Oslo'
	}).format(new Date(date));
};
