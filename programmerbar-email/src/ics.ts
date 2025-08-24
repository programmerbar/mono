import { formatDate, normalDate } from "./date.js";

type IcsShiftEvent = {
	id: string;
	startAt: string;
	endAt: string;
	summary: string;
	description?: string;
};

export function createIcsEvent(shift: IcsShiftEvent): string {
	const uid = shift.id;

	const dtstamp = formatDate(new Date().toISOString());
	const dtstart = normalDate(shift.startAt);
	const dtend = normalDate(shift.endAt);

	return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Programmerbar//Shift Notification//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART;TZID=Europe/Oslo:${dtstart}
DTEND;TZID=Europe/Oslo:${dtend}
SUMMARY:${shift.summary}
DESCRIPTION:${shift.description || ""}
END:VEVENT
END:VCALENDAR`;
}
