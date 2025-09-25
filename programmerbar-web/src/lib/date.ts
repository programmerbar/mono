import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';

export type Dateish = string | Date | number;
export const OSLO_TIME_ZONE = 'Europe/Oslo';

const ensureDate = (date: Dateish): Date => {
	return date instanceof Date ? date : new Date(date);
};

export const formatDate = (date: Dateish) => {
	const utcDate = ensureDate(date);
	const osloTime = toZonedTime(utcDate, OSLO_TIME_ZONE);
	return format(osloTime, 'dd.MM.yyyy');
};

export const time = (date: Dateish) => {
	const utcDate = ensureDate(date);
	const osloTime = toZonedTime(utcDate, OSLO_TIME_ZONE);
	return format(osloTime, 'HH:mm');
};

export const normalDate = (date: Dateish) => {
	const utcDate = ensureDate(date);
	const osloTime = toZonedTime(utcDate, OSLO_TIME_ZONE);
	return format(osloTime, 'dd.MM.yyyy HH:mm');
};

export const toLocalDateTimeString = (date: Dateish): string => {
	const utcDate = ensureDate(date);
	const osloTime = toZonedTime(utcDate, OSLO_TIME_ZONE);
	return format(osloTime, "yyyy-MM-dd'T'HH:mm");
};

export const parseDateTimeLocal = (value: string): Date => {
	return new Date(value);
};

export const toUtcISOStringFromLocal = (value: string) => {
	return new Date(value).toISOString();
};

export const ISOStandard = (date: Dateish) => {
	return toLocalDateTimeString(date);
};

