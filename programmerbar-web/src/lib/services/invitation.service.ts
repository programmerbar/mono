import type { Database } from '$lib/db/drizzle';
import { invitations } from '$lib/db/schemas';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { isPast } from 'date-fns';

export class InvitationService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async invite(email: string) {
		return await this.#db
			.insert(invitations)
			.values({
				id: nanoid(),
				email,
				createdAt: new Date(),
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
			})
			.returning()
			.get();
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
			return { success: false, error: 'No invitation found' } as const;
		}

		if (invitation.claimedAt !== null) {
			return { success: false, error: 'Invitation already claimed' } as const;
		}

		if (isPast(invitation.expiresAt)) {
			return { success: false, error: 'Invitation expired' } as const;
		}

		return { success: true, invitation } as const;
	}

	async findAllUnused() {
		return await this.#db.query.invitations.findMany({
			where: (row, { isNull }) => isNull(row.claimedAt)
		});
	}

	async delete(id: string) {
		return await this.#db.delete(invitations).where(eq(invitations.id, id));
	}
}
