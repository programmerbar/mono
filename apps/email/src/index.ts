import 'dotenv/config';
import { serve } from '@hono/node-server';
import {
	ContactUsEmail,
	ContactUsEmailSchema,
	InvitationEmail,
	InvitationEmailSchema,
	NewShiftEmail,
	NewShiftEmailSchema,
	VoulenteerRequestEmail,
	VoulenteerRequestEmailSchema
} from '@programmerbar/emails';
import { Hono } from 'hono';
import { describeRoute, openAPISpecs } from 'hono-openapi';
import { validator } from 'hono-openapi/zod';
import { Resend } from 'resend';
import { createIcsEvent } from './ics.js';
import { swaggerUI } from '@hono/swagger-ui';

const PROGRAMMERBAR_EMAIL = 'styret@programmerbar.no';
const FROM_EMAIL = 'ikkesvar@programmer.bar';

const app = new Hono();
const resend = new Resend(process.env.RESEND_API_KEY!);

app.get(
	'/api-docs/openapi.json',
	openAPISpecs(app, {
		documentation: {
			info: {
				title: 'Programmerbar Email API',
				version: '1.0.0',
				description: 'Email API'
			},
			servers: [
				{ url: 'http://localhost:9000', description: 'Local Server' },
				{ url: 'https://email.programmer.bar', description: 'Production Server' }
			],
			components: {
				securitySchemes: {
					adminKey: {
						type: 'http',
						scheme: 'bearer'
					}
				}
			},
			security: [{ adminKey: [] }]
		}
	})
);

app.get('/swagger-ui', swaggerUI({ url: '/api-docs/openapi.json' }));

app.get(
	'/health',
	describeRoute({
		description: 'Health check endpoint',
		responses: {
			200: {
				description: 'Service is healthy'
			}
		}
	}),
	(c) => {
		return c.json({ status: 'ok', message: 'Programmerbar email API is healthy' });
	}
);

app.post(
	'/email/contact-us',
	describeRoute({
		description: 'Send an email for contact us',
		responses: {
			200: {
				description: 'Successful response'
			},
			400: {
				description: 'Bad request'
			},
			401: {
				description: 'Unauthorized'
			},
			500: {
				description: 'Internal server error'
			}
		}
	}),
	validator('json', ContactUsEmailSchema),
	async (c) => {
		const data = c.req.valid('json');

		try {
			console.log('Sending contact us email with data:', data);
			await resend.emails.send({
				from: FROM_EMAIL,
				subject: 'Kontaktskjema på hjemmesiden',
				to: [PROGRAMMERBAR_EMAIL],
				react: ContactUsEmail(data)
			});
		} catch (error) {
			console.error('Failed to send email:', error, 'Data:', data);
			return c.status(500);
		}

		return c.status(200);
	}
);

app.post(
	'/email/invitation',
	describeRoute({
		description: 'Send an invitation email',
		responses: {
			200: {
				description: 'Successful response'
			},
			400: {
				description: 'Bad request'
			},
			401: {
				description: 'Unauthorized'
			},
			500: {
				description: 'Internal server error'
			}
		}
	}),
	validator('json', InvitationEmailSchema),
	async (c) => {
		const data = c.req.valid('json');

		try {
			console.log('Sending invitation email with data:', data);
			await resend.emails.send({
				from: FROM_EMAIL,
				subject: 'Invitasjon til Programmerbar',
				to: [data.email],
				react: InvitationEmail(data)
			});
		} catch (error) {
			console.error('Failed to send email:', error, 'Data:', data);
			return c.status(500);
		}

		return c.status(200);
	}
);

app.post(
	'/email/new-shift',
	describeRoute({
		description: 'Send a new shift email',
		responses: {
			200: {
				description: 'Successful response'
			},
			400: {
				description: 'Bad request'
			},
			401: {
				description: 'Unauthorized'
			},
			500: {
				description: 'Internal server error'
			}
		}
	}),
	validator('json', NewShiftEmailSchema),
	async (c) => {
		const data = c.req.valid('json');

		try {
			console.log('Sending new shift email with data:', data);
			await resend.emails.send({
				from: FROM_EMAIL,
				subject: 'Du har fått en vakt',
				to: [data.user.email],
				react: NewShiftEmail(data),
				attachments: [
					{
						filename: 'shift.ics',
						content: createIcsEvent(data.shift),
						contentType: 'text/calendar'
					}
				]
			});
		} catch (error) {
			console.error('Failed to send email:', error, 'Data:', data);
			return c.status(500);
		}

		return c.status(200);
	}
);

app.post(
	'/email/voulenteer-request',
	describeRoute({
		description: 'Send a volunteer request email',
		responses: {
			200: {
				description: 'Successful response'
			},
			400: {
				description: 'Bad request'
			},
			401: {
				description: 'Unauthorized'
			},
			500: {
				description: 'Internal server error'
			}
		}
	}),
	validator('json', VoulenteerRequestEmailSchema),
	async (c) => {
		const data = c.req.valid('json');

		try {
			console.log('Sending volunteer request email with data:', data);
			await resend.emails.send({
				from: FROM_EMAIL,
				subject: 'Ny frivillig-søknad',
				to: ['frivilligansvarlig@programmerbar.no'],
				react: VoulenteerRequestEmail(data)
			});
		} catch (error) {
			console.error('Failed to send email:', error, 'Data:', data);
			return c.status(500);
		}

		return c.status(200);
	}
);

serve(
	{
		fetch: app.fetch,
		port: 8001
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	}
);
