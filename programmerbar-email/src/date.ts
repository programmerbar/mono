import { format } from "date-fns";

export function formatDate(date: string | number | Date) {
	return format(new Date(date), "dd.MM.yyyy");
}

export function normalDate(date: string | number | Date) {
	return format(new Date(date), "dd.MM.yyyy HH:mm");
}
