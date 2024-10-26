import { CreateEventSchema } from '$lib/validators';

type CreateEventShiftUser = {
	id: string;
	name: string;
};

type CreateEventShift = {
	start: string;
	end: string;
	users: Array<CreateEventShiftUser>;
};

export class CreateEventState {
	name = $state('');
	date = $state<string>();
	shifts = $state<Array<CreateEventShift>>([]);

	addShift() {
		this.shifts.push({
			start: '',
			end: '',
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

	get json() {
		return {
			name: this.name,
			date: this.date,
			shifts: this.shifts.map((shift) => {
				return {
					start: shift.start,
					end: shift.end,
					users: shift.users.map((user) => user.id).filter(Boolean)
				};
			})
		};
	}

	get isValid() {
		const { success } = CreateEventSchema.safeParse(this.json);
		return success;
	}

	reset() {
		this.name = '';
		this.date = '';
		this.shifts = [];
	}
}
