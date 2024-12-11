import type { Database } from '$lib/db/drizzle';
import { invitations } from '$lib/db/schema';
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

	async use(id: string) {
		await this.#db
			.update(invitations)
			.set({
				usedAt: new Date()
			})
			.where(eq(invitations.id, id));
	}

	async findByEmail(email: string) {
		return await this.#db.query.invitations.findFirst({
			where: (row, { eq }) => eq(row.email, email)
		});
	}

	async findValidInvitationByEmail(email: string) {
		const invitation = await this.findByEmail(email);

		if (!invitation) {
			return [null, 'No invitation found'] as const;
		}

		if (invitation.usedAt !== null) {
			return [null, 'Invitation already used'] as const;
		}

		if (isPast(invitation.expiresAt)) {
			return [null, 'Invitation expired'] as const;
		}

		return [invitation, null] as const;
	}

	async findAllUnused() {
		return await this.#db.query.invitations.findMany({
			where: (row, { isNull }) => isNull(row.usedAt)
		});
	}
}
