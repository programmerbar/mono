import { CreateEventSchema } from '$lib/validators';
import type { RequestHandler } from './$types';
import type { ShiftEmailProps } from '$lib/services/email.service';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(null, { status: 401 });
  }
  const { name, date, shifts: jshifts } = await request.json().then(CreateEventSchema.parse);
  const event = await locals.eventService.create(name, date);
  if (!event) {
    return new Response(null, { status: 500 });
  }
  const shiftsToInsert = jshifts.map((shift) => ({
    eventId: event.id,
    startAt: shift.startAt,
    endAt: shift.endAt
  }));
  const createdShifts = await locals.eventService.createShifts(shiftsToInsert);
  const userShiftsToInsert = createdShifts?.flatMap((shift, shiftIndex) => {
    return jshifts[shiftIndex].users.map((user) => ({
      shiftId: shift.id,
      userId: user
    }));
  });
  await locals.eventService.createUserShifts(userShiftsToInsert ?? []);

  // Send email notifications with ICS calendar attachments
  const emailPromises = [];

  if (createdShifts && createdShifts.length > 0) {
    for (let i = 0; i < createdShifts.length; i++) {
      const shift = createdShifts[i];
      const shiftData = jshifts[i];

      for (const userId of shiftData.users) {
        // Get user details from database
        const user = await locals.userService.findById(userId);

        if (user && user.email) {
          // Prepare email data
          const emailData: ShiftEmailProps = {
            user: {
              name: user.name || 'Frivillig',
              email: user.email
            },
            shift: {
              startAt: new Date(shift.startAt).toISOString(),
              endAt: new Date(shift.endAt).toISOString(),
              summary: `Vakt: ${name}`,
              description: `Du har f�tt en vakt p� Programmerbar for arrangementet "${name}".`
            }
          };

          // Send the email
          emailPromises.push(locals.emailService.sendShiftEmail(emailData));

          // Log email sending
          console.log(`Sending shift email to ${user.email} for shift ${shift.id}`);
        }
      }
    }
  }

  // Wait for all emails to be sent (but don't fail if some emails fail)
  if (emailPromises.length > 0) {
    try {
      await Promise.allSettled(emailPromises);
      console.log(`Sent ${emailPromises.length} shift notification emails`);
    } catch (emailError) {
      console.error('Error sending shift emails:', emailError);
    }
  }

  return new Response(JSON.stringify({ eventId: event.id }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
};
