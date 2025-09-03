import { normalDate, time } from '$lib/date';

export type NotificationTemplate<T = Record<string, any>> = {
	permission: keyof typeof import('$lib/db/schemas').tags.$inferSelect;
	title: string;
	body: (data: T) => string;
};

export const NOTIFICATION_TEMPLATES = {
	opplaering: {
		permission: 'canSeeTraining',
		title: '🎓 Opplæring påkrevd',
		body: (data: { userEmail: string }) => `${data.userEmail} trenger opplæring.`
	},
	beerClaim: {
		permission: 'canSeeBeerClaims',
		title: '🍺 Drikke innløst',
		body: (data: { userName: string; quantity: number; productName: string; timestamp: Date }) =>
			`${data.userName} innløste ${data.quantity}x ${data.productName} den ${normalDate(data.timestamp)}`
	},
	eventDeparture: {
		permission: 'canSeeEventDepartures',
		title: '🚪 Forlot arrangement',
		body: (data: { userName: string; eventName: string; shiftTime?: string }) => {
			const shiftInfo = data.shiftTime ? ` fra vakt "${data.shiftTime}"` : '';
			return `${data.userName} forlot arrangementet "${data.eventName}"${shiftInfo}`;
		}
	},
	referral: {
		permission: 'canSeeReferrals',
		title: '👥 Ny henvisning',
		body: (data: { referrerEmail: string; referredEmail: string }) =>
			`${data.referrerEmail} henviste ${data.referredEmail} til å bli med i Programmerbar`
	},
	bong: {
		permission: 'canSeeBongs',
		title: '🍻 Bong gitt',
		body: (data: {
			giverName: string;
			receiverName: string;
			quantity: number;
			productName?: string;
		}) => {
			const product = data.productName ? ` (${data.productName})` : '';
			return `${data.giverName} ga ${data.quantity}x bong${product} til ${data.receiverName} kl. ${normalDate(new Date())}`;
		}
	},
	userRoleChange: {
		permission: 'canSeeUserChanges',
		title: '👤 Rolle endret',
		body: (data: { userName: string; newRole: string; adminName: string }) => {
			const roleText = data.newRole === 'board' ? 'styret' : 'frivillig';
			return `${data.userName} ble endret til ${roleText}-rolle av ${data.adminName || 'System'}`;
		}
	},
	trainingComplete: {
		permission: 'canSeeUserChanges',
		title: '🎓 Opplæring fullført',
		body: (data: { userName: string; adminName: string }) =>
			`${data.userName} fullførte opplæringen (markert av ${data.adminName || 'System'})`
	},
	eventCreated: {
		permission: 'canSeeEventUpdates',
		title: '📅 Nytt arrangement',
		body: (data: { eventName: string; eventDate: Date; creatorName: string }) =>
			`"${data.eventName}" planlagt for ${normalDate(data.eventDate)} av ${data.creatorName}`
	},
	eventUpdated: {
		permission: 'canSeeEventUpdates',
		title: '⚠️ Arrangement oppdatert',
		body: (data: { eventName: string; updaterName: string }) =>
			`"${data.eventName}" detaljer ble endret av ${data.updaterName}`
	},
	shiftAssigned: {
		permission: 'canSeeShiftUpdates',
		title: '👥 Vakt tildelt',
		body: (data: {
			assignedUserName: string;
			eventName: string;
			shiftTime: string;
			assignerName: string;
		}) =>
			`${data.assignedUserName} tildelt til "${data.eventName}" (${data.shiftTime}) av ${data.assignerName || 'System'}`
	},
	tagAssigned: {
		permission: 'canSeeTagChanges',
		title: '🏷️ Tag tildelt',
		body: (data: { tagName: string; assignedUserName: string; assignerName: string }) =>
			`"${data.tagName}" tag tildelt til ${data.assignedUserName} av ${data.assignerName || 'System'}`
	},
	tagRemoved: {
		permission: 'canSeeTagChanges',
		title: '🏷️ Tag fjernet',
		body: (data: { tagName: string; removedUserName: string; removerName: string }) =>
			`"${data.tagName}" tag fjernet fra ${data.removedUserName} av ${data.removerName || 'System'}`
	},
	contactSubmission: {
		permission: 'canSeeContactSubmissions',
		title: '📧 Kontakt-skjema',
		body: (data: { name: string; email: string; message: string }) => {
			const truncatedMessage =
				data.message.length > 100 ? data.message.substring(0, 100) + '...' : data.message;
			return `${data.name} (${data.email}) sendte: "${truncatedMessage}"`;
		}
	},
	userDeleted: {
		permission: 'canSeeUserChanges',
		title: '🗑️ Bruker slettet',
		body: (data: { deletedUserName: string; adminName: string }) =>
			`${data.deletedUserName} ble slettet fra systemet av ${data.adminName || 'System'}`
	},
	newcomer: {
		permission: 'canSeeNewcomers',
		title: '👋 Ny bruker',
		body: (data: { newUserName: string; newUserEmail: string; adminName: string }) =>
			`${data.newUserName} (${data.newUserEmail}) ble godkjent og lagt til av ${data.adminName || 'System'}`
	}
} as const;
