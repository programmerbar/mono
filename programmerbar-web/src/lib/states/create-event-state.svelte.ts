import { slugify } from '$lib/utils';
import { CreateEventSchema } from '$lib/validators';
import { toUtcISOStringFromLocal } from '$lib/date';

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
		this.shifts.push({
			startAt: '',
			endAt: '',
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
