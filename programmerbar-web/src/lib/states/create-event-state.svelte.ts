import { slugify } from '$lib/utils/strings';
import { CreateEventSchema } from '$lib/validators';
import {
	parseDateTimeLocal,
	toLocalDateTimeString,
	toUtcISOStringFromLocal
} from '$lib/utils/date';
import { addHours, isValid } from 'date-fns';

type CreateEventShiftUser = {
	id: string;
	name: string;
};

type CreateEventShift = {
	startAt: string;
	endAt: string;
	users: Array<CreateEventShiftUser>;
};

export class CreateEventState {
	name = $state('');
	date = $state<string>();
	slug = $derived(slugify(this.name));
	description = $state('');
	shouldBePublic = $state(false);
	shifts = $state<Array<CreateEventShift>>([]);

	addShift() {
		const previousShift = this.shifts.at(-1);
		const baseTime = previousShift ? previousShift.endAt : this.date;
		const baseDate = baseTime ? parseDateTimeLocal(baseTime) : null;
		const startDate =
			baseDate && isValid(baseDate) ? addHours(baseDate, previousShift ? 2 : 0) : null;

		this.shifts.push({
			startAt: startDate ? toLocalDateTimeString(startDate) : '',
			endAt: startDate ? toLocalDateTimeString(addHours(startDate, 4)) : '',
			users: []
		});
	}

	deleteShift(shiftIndex: number) {
		this.shifts.splice(shiftIndex, 1);
	}

	addUserToShift(shiftIndex: number) {
		this.shifts[shiftIndex].users.push({
			id: '',
			name: ''
		});
	}

	deleteUserFromShift(shiftIndex: number, userId: string) {
		const arr = this.shifts[shiftIndex].users.filter((user) => user.id !== userId);
		this.shifts[shiftIndex].users = arr;
	}

	json() {
		return {
			name: this.name,
			date: this.date ? toUtcISOStringFromLocal(this.date) : this.date,
			slug: this.shouldBePublic ? this.slug : null,
			description: this.shouldBePublic ? this.description || null : null,
			shifts: this.shifts.map((shift) => {
				return {
					startAt: shift.startAt ? toUtcISOStringFromLocal(shift.startAt) : shift.startAt,
					endAt: shift.endAt ? toUtcISOStringFromLocal(shift.endAt) : shift.endAt,
					users: shift.users.map((user) => user.id).filter(Boolean)
				};
			})
		};
	}

	isValid() {
		const { success } = CreateEventSchema.safeParse(this.json());
		return success;
	}

	reset() {
		this.name = '';
		this.date = '';
		this.description = '';
		this.shouldBePublic = false;
		this.shifts = [];
	}
}
