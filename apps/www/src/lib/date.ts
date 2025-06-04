import { format } from 'date-fns';

export type Dateish = string | Date | number;

/**
 * Should not be Helsinki, but is changed to get the correct
 * timezone. FIX!
 */

export const formatDate = (date: Dateish) => {
	return format(new Date(date), 'dd.MM.yyyy');
};

export const time = (date: Dateish) => {
	return format(new Date(date), 'HH:mm');
};

export const normalDate = (date: Dateish) => {
	return format(new Date(date), 'dd.MM.yyyy HH:mm');
};

export const ISOStandard = (date: Dateish) => {
	return format(new Date(date), "yyyy-MM-dd'T'HH:mm");
};
