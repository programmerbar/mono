import { dev } from '$app/environment';
import { ContactUsEmail, InvitationEmail } from '@programmerbar/emails';
import type { CreateEmailOptions, Resend } from 'resend';
import { render } from '@react-email/render';

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
		await this.sendEmail({
			from: FROM_EMAIL,
			subject: 'Kontaktskjema på hjemmesiden',
			to: [PROGRAMMERBAR_EMAIL],
			html: await render(ContactUsEmail({ ...data }))
		});
	}

	async sendInvitaitonEmail(data: InvitationEmailProps) {
		await this.sendEmail({
			from: FROM_EMAIL,
			subject: 'Invitasjon til Programmerbar',
			to: [data.email],
			html: await render(InvitationEmail({ ...data }))
		});
	}

	private async sendEmail(payload: CreateEmailOptions) {
		if (dev) {
			console.log('#############################');
			console.log('# NOT SENDING EMAILS IN DEV #');
			console.log('#############################');

			console.log('########### EMAIL ############');
			console.log(payload.html);
			console.log('#############################');

			return;
		}

		await this.#resend.emails.send(payload);
	}
}
