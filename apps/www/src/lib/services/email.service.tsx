import { dev } from '$app/environment';
import { ContactUsEmail, InvitationEmail, ShiftEmail } from '@programmerbar/emails';
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

export type ShiftEmailProps = {
  shift: {
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

function generateICS(shift: { startAt: string; endAt: string; summary: string; description?: string }): string {
  const uid = `${Date.now()}@programmerbar.no`;
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dtstamp = formatDate(new Date().toISOString());
  const dtstart = formatDate(shift.startAt);
  const dtend = formatDate(shift.endAt);

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Programmerbar//Shift Notification//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART:${dtstart}
DTEND:${dtend}
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
      subject: 'Kontaktskjema pÃ¥ hjemmesiden',
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

  async sendShiftEmail(data: ShiftEmailProps) {
    const icsContent = generateICS(data.shift);

    await this.sendEmail({
      from: FROM_EMAIL,
      subject: 'Du har fått en vakt',
      to: [data.user.email],
      html: await render(ShiftEmail({ ...data })),
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
