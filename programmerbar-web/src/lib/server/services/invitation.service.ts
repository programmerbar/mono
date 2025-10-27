import type { Database } from '$lib/server/db/drizzle';
import { invitations } from '$lib/server/db/schemas';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { isPast } from 'date-fns';

export class InvitationService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async invite(email: string) {
		const invitation = await this.#db
			.insert(invitations)
			.values({
				id: nanoid(),
				email,
				createdAt: new Date(),
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
			})
			.returning()
			.get();

		console.log(
			`[InvitationService] ✅ Invitation created: ${invitation.id} for ${email} (expires in 7 days)`
		);
		return invitation;
	}

	async claim(id: string) {
		await this.#db.delete(invitations).where(eq(invitations.id, id));
	}

	async findByEmail(email: string) {
		return await this.#db.query.invitations.findFirst({
			where: (row, { eq }) => eq(row.email, email)
		});
	}

	async findValidInvitationByEmail(email: string) {
		const invitation = await this.findByEmail(email);

		if (!invitation) {
			console.log(`[InvitationService] ❌ No invitation found for: ${email}`);
			return { success: false, error: 'No invitation found' } as const;
		}

		if (invitation.claimedAt !== null) {
			console.log(`[InvitationService] ❌ Invitation already claimed for: ${email}`);
			return { success: false, error: 'Invitation already claimed' } as const;
		}

		if (isPast(invitation.expiresAt)) {
			console.log(`[InvitationService] ❌ Invitation expired for: ${email}`);
			return { success: false, error: 'Invitation expired' } as const;
		}

		console.log(`[InvitationService] ✅ Valid invitation found for: ${email}`);
		return { success: true, invitation } as const;
	}

	async findAllUnused() {
		const invitations = await this.#db.query.invitations.findMany({
			where: (row, { isNull }) => isNull(row.claimedAt)
		});

		return invitations;
	}

	async delete(id: string) {
		const result = await this.#db.delete(invitations).where(eq(invitations.id, id));
		return result;
	}
}
