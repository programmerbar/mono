import { CreateEventSchema } from '$lib/validators';

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
			date: this.date,
			shifts: this.shifts.map((shift) => {
				return {
					startAt: shift.startAt,
					endAt: shift.endAt,
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
		this.shifts = [];
	}
}
