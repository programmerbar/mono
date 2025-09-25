export type Dateish = string | Date | number;
export const OSLO_TIME_ZONE = 'Europe/Oslo';

const dateFormatter = new Intl.DateTimeFormat('nb-NO', {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	timeZone: OSLO_TIME_ZONE
});

const timeFormatter = new Intl.DateTimeFormat('nb-NO', {
	hour: '2-digit',
	minute: '2-digit',
	hour12: false,
	timeZone: OSLO_TIME_ZONE
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-CA', {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	hour12: false,
	timeZone: OSLO_TIME_ZONE
});

const dateTimeFormatterCache = new Map<string, Intl.DateTimeFormat>();

const timeZoneRegex = /(?:Z|[+-]\d{2}:?\d{2})$/i;

type DateTimeParts = {
	year: string;
	month: string;
	day: string;
	hour: string;
	minute: string;
	second: string;
};

const ensureDate = (date: Dateish): Date => {
	return date instanceof Date ? date : new Date(date);
};

const getFormatterParts = (
	date: Date,
	formatter: Intl.DateTimeFormat
): Partial<Record<Intl.DateTimeFormatPartTypes, string>> => {
	return formatter
		.formatToParts(date)
		.reduce<Partial<Record<Intl.DateTimeFormatPartTypes, string>>>((acc, part) => {
			if (part.type !== 'literal') {
				acc[part.type] = part.value;
			}
			return acc;
		}, {});
};

const getDateTimeParts = (date: Date): DateTimeParts => {
	const parts = getFormatterParts(date, dateTimeFormatter);
	return {
		year: parts.year ?? '0000',
		month: parts.month ?? '01',
		day: parts.day ?? '01',
		hour: parts.hour ?? '00',
		minute: parts.minute ?? '00',
		second: parts.second ?? '00'
	};
};

const getTimeZoneFormatter = (timeZone: string) => {
	if (!dateTimeFormatterCache.has(timeZone)) {
		dateTimeFormatterCache.set(
			timeZone,
			new Intl.DateTimeFormat('en-CA', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false,
				timeZone
			})
		);
	}

	return dateTimeFormatterCache.get(timeZone)!;
};

const getTimeZoneOffset = (date: Date, timeZone: string): number => {
	const formatter = getTimeZoneFormatter(timeZone);
	const parts = getFormatterParts(date, formatter);
	const inZoneUtc = Date.UTC(
		Number(parts.year ?? '0'),
		Number(parts.month ?? '1') - 1,
		Number(parts.day ?? '1'),
		Number(parts.hour ?? '0'),
		Number(parts.minute ?? '0'),
		Number(parts.second ?? '0')
	);

	return inZoneUtc - date.getTime();
};

export const formatDate = (date: Dateish) => {
	return dateFormatter.format(ensureDate(date));
};

export const time = (date: Dateish) => {
	return timeFormatter.format(ensureDate(date));
};

export const normalDate = (date: Dateish) => {
	return `${formatDate(date)} ${time(date)}`;
};

export const ISOStandard = (date: Dateish) => {
	const parts = getDateTimeParts(ensureDate(date));
	return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
};

export const parseDateTimeLocal = (value: string, timeZone: string = OSLO_TIME_ZONE): Date => {
	const trimmedValue = value.trim();

	if (!trimmedValue) {
		return new Date(trimmedValue);
	}

	if (timeZoneRegex.test(trimmedValue) || !trimmedValue.includes('T')) {
		return new Date(trimmedValue);
	}

	const [datePart, timePart] = trimmedValue.split('T');
	if (!datePart || !timePart) {
		return new Date(trimmedValue);
	}

	const [year, month, day] = datePart.split('-').map((part) => Number(part));
	const timeSegments = timePart.split(':');
	const hour = Number(timeSegments[0] ?? '0');
	const minute = Number(timeSegments[1] ?? '0');
	const second = Number((timeSegments[2] ?? '0').split('.')[0]);

	const targetUtc = Date.UTC(year, (month || 1) - 1, day || 1, hour, minute, second);
	let result = new Date(targetUtc);
	let offset = getTimeZoneOffset(result, timeZone);
	let adjusted = targetUtc - offset;

	if (adjusted !== targetUtc) {
		result = new Date(adjusted);
		offset = getTimeZoneOffset(result, timeZone);
		adjusted = targetUtc - offset;
	}

	return new Date(adjusted);
};

export const toUtcISOStringFromLocal = (value: string, timeZone: string = OSLO_TIME_ZONE) => {
	return parseDateTimeLocal(value, timeZone).toISOString();
};
