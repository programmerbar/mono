import { dev } from '$app/environment';
import { ContactUsEmail, InvitationEmail } from '@programmerbar/emails';
import type { CreateEmailOptions, Resend } from 'resend';

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

export class EmailService {
	#resend: Resend;

	constructor(resend: Resend) {
		this.#resend = resend;
	}

	async sendContactUsEmail(data: ContactUsEmailProps) {
		await this.sendEmail(
			{
				from: FROM_EMAIL,
				subject: 'Kontaktskjema på hjemmesiden',
				to: [PROGRAMMERBAR_EMAIL],
				react: ContactUsEmail(data)
			},
			JSON.stringify(data, null, 2)
		);
	}

	async sendInvitaitonEmail(data: InvitationEmailProps) {
		await this.sendEmail(
			{
				from: FROM_EMAIL,
				subject: 'Invitasjon til Programmerbar',
				to: [data.email],
				react: InvitationEmail(data)
			},
			JSON.stringify(data, null, 2)
		);
	}

	private async sendEmail(payload: CreateEmailOptions, fallback: string) {
		if (dev) {
			console.log('#############################');
			console.log('# NOT SENDING EMAILS IN DEV #');
			console.log('#############################');

			console.log('########### EMAIL ############');
			console.log(fallback);
			console.log('#############################');

			return;
		}

		await this.#resend.emails.send(payload);
	}
}
