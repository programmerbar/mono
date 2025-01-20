import type { Happening, RepeatingEvent } from './api/sanity/events';
import { eachDayOfInterval } from 'date-fns';
import { normalDate } from './date';

export const flattenRepeatingEvents = (repeatingEvents: Array<RepeatingEvent>) => {
	return repeatingEvents.flatMap((event) => {
		return eachDayOfInterval({
			start: new Date(event.startDate),
			end: new Date(event.endDate)
		})
			.filter((date) => date.getDay() === event.dayOfWeek)
			.filter((_, i) => {
				switch (event.interval) {
					case 'weekly':
						return true;
					case 'bi-weekly':
						return i % 2 === 0;
					case 'monthly':
						return i % 4 === 0;
					default:
						return false;
				}
			})
			.map(
				(date) =>
					({
						_id: event._id,
						body: event.body,
						date: date.toISOString(),
						registrationStart: null,
						slug: event.slug,
						title: event.title
					}) satisfies Happening
			);
	});
};

export const getNextOccurrence = (happening: RepeatingEvent) => {
	return eachDayOfInterval({
		start: new Date(happening.startDate),
		end: new Date(happening.endDate)
	})
		.filter((date) => !happening.ignoredDates?.map(normalDate).includes(normalDate(date)))
		.filter((date) => date.getDay() === happening.dayOfWeek)
		.filter((_, i) => {
			switch (happening.interval) {
				case 'weekly':
					return true;
				case 'bi-weekly':
					return i % 2 === 0;
				case 'monthly':
					return i % 4 === 0;
				default:
					return false;
			}
		})
		.filter((date) => Date.now() < date.getTime())
		.sort((a, b) => a.getTime() - b.getTime())[0];
};
