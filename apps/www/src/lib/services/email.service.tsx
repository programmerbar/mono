import { dev } from '$app/environment';
import {
	ContactUsEmail,
	InvitationEmail,
	ShiftEmail,
	VoulenteerEmail
} from '@programmerbar/emails';
import type { CreateEmailOptions, Resend } from 'resend';
import { formatDate, normalDate } from '$lib/date';

const PROGRAMMERBAR_EMAIL = 'styret@programmerbar.no';
const FROM_EMAIL = 'ikkesvar@programmer.bar';

export type ContactUsEmailProps = {
	name: string;
	email: string;
	message: string;
};

export type InvitationEmailProps = {
	email: string;
};

export type VolunteerRequestEmailProps = {
	name: string;
	email: string;
};

export type ShiftEmailProps = {
	shift: {
		id: string;
		startAt: string;
		endAt: string;
		summary: string;
		description?: string;
	};
	user: {
		name: string;
		email: string;
	};
};

type IcsShiftEvent = {
	id: string;
	startAt: string;
	endAt: string;
	summary: string;
	description?: string;
};

function createIcsEvent(shift: IcsShiftEvent): string {
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
DESCRIPTION:${shift.description || ''}
END:VEVENT
END:VCALENDAR`;
}

export class EmailService {
	#resend: Resend;

	constructor(resend: Resend) {
		this.#resend = resend;
	}

	async sendContactUsEmail(data: ContactUsEmailProps) {
		await this.sendEmail({
			from: FROM_EMAIL,
			subject: 'Kontaktskjema på hjemmesiden',
			to: [PROGRAMMERBAR_EMAIL],
			react: <ContactUsEmail {...data} />,
			text: `Navn: ${data.name}\nE-post: ${data.email}\n\nMelding:\n${data.message}`
		});
	}

	async sendInvitaitonEmail(data: InvitationEmailProps) {
		await this.sendEmail({
			from: FROM_EMAIL,
			subject: 'Invitasjon til Programmerbar',
			to: [data.email],
			react: <InvitationEmail email={data.email} />,
			text: `Hei!\n\nDu har blitt invitert til å bli med i Programmerbar. Klikk på lenken under for å bli med:\n\nhttps://programmerbar.no/logg-inn\n\nVi gleder oss til å se deg!\n\nHilsen Programmerbar`
		});
	}

	async sendVolunteerRequestEmail(data: VolunteerRequestEmailProps) {
		await this.sendEmail({
			from: FROM_EMAIL,
			subject: 'Ny frivillig-søknad',
			to: ['frivilligansvarlig@programmerbar.no'],
			react: <VoulenteerEmail name={data.name} email={data.email} />,
			text: `Ny søknad om å bli frivillig:\n\nNavn: ${data.name}\nE-post: ${data.email}`
		});
	}

	async sendShiftEmail(data: ShiftEmailProps) {
		const icsContent = createIcsEvent(data.shift);

		await this.sendEmail({
			from: FROM_EMAIL,
			subject: 'Du har fått en vakt',
			to: [data.user.email],
			react: <ShiftEmail shift={data.shift} user={data.user} />,
			text: `Du har fått en vakt: ${data.shift.summary}.\n\nStart: ${data.shift.startAt}\nSlutt: ${data.shift.endAt}\n\nSe vedlagt kalenderfil for mer informasjon.`,
			attachments: [
				{
					filename: 'shift.ics',
					content: icsContent,
					contentType: 'text/calendar'
				}
			]
		});
	}

	private async sendEmail(payload: CreateEmailOptions) {
		console.log('###### SENDING EMAIL ########');
		console.log(`Sending email to: ${payload.to}`);
		console.log(`Subject: ${payload.subject}`);
		console.log(payload.text);
		console.log('#############################');

		if (payload.attachments) {
			console.log('########### ATTACHMENTS ############');
			console.log(payload.attachments);
		}

		if (dev) {
			return;
		}

		await this.#resend.emails.send(payload);
	}
}
