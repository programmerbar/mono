import { nanoid } from 'nanoid';

export const createId = (prefix: string) => {
	return `${prefix}_${nanoid()}`;
};

export const createUserId = () => {
	return createId('user');
};

export const createShiftId = () => {
	return createId('shift');
};

export const createInvitationId = () => {
	return createId('invitation');
};
