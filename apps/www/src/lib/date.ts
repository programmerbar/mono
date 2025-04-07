export type Dateish = string | Date | number;

/**
 * Should not be Helsinki, but is changed to get the correct
 * timezone. FIX!
 */

export const formatDate = (date: Dateish) => {
	return Intl.DateTimeFormat('nb-NO', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		timeZone: 'Europe/Helsinki'
	}).format(new Date(date));
};

export const time = (date: Dateish) => {
	return Intl.DateTimeFormat('nb-NO', {
		hour: 'numeric',
		minute: 'numeric',
		timeZone: 'Europe/Helsinki'
	}).format(new Date(date));
};

export const normalDate = (date: Dateish) => {
	return Intl.DateTimeFormat('nb-NO', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		timeZone: 'Europe/Helsinki'
	}).format(new Date(date));
};
