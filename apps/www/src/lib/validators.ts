import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const CreateEventSchema = z.object({
	name: z.string(),
	date: z.coerce.date(),
	shifts: z
		.object({
			start: z.coerce.date(),
			end: z.coerce.date(),
			users: z.array(z.string())
		})
		.array()
});

export const ContactUsSchema = zfd.formData({
	name: zfd.text(z.string().min(2).max(50)),
	email: zfd.text(z.string().email().min(3)),
	message: zfd.text(z.string().min(5).max(1000))
});
