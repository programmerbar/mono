import type { Database } from '$lib/db/drizzle';
import { pendingApplications } from '$lib/db/schemas';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export class PendingApplicationService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async create(data: { name: string; email: string; feideId: string }) {
		return await this.#db
			.insert(pendingApplications)
			.values({
				id: nanoid(),
				name: data.name,
				email: data.email.toLowerCase(),
				feideId: data.feideId,
				createdAt: new Date()
			})
			.returning()
			.get();
	}

	async findByEmail(email: string) {
		return await this.#db.query.pendingApplications.findFirst({
			where: (row, { eq }) => eq(row.email, email.toLowerCase())
		});
	}

	async findByFeideId(feideId: string) {
		return await this.#db.query.pendingApplications.findFirst({
			where: (row, { eq }) => eq(row.feideId, feideId)
		});
	}

	async findAll() {
		return await this.#db.query.pendingApplications.findMany({
			orderBy: (row, { desc }) => desc(row.createdAt)
		});
	}

	async getCount() {
		const applications = await this.#db.query.pendingApplications.findMany();
		return applications.length;
	}

	async delete(id: string) {
		return await this.#db.delete(pendingApplications).where(eq(pendingApplications.id, id));
	}

	async deleteByEmail(email: string) {
		return await this.#db
			.delete(pendingApplications)
			.where(eq(pendingApplications.email, email.toLowerCase()));
	}

	async deleteByFeideId(feideId: string) {
		return await this.#db
			.delete(pendingApplications)
			.where(eq(pendingApplications.feideId, feideId));
	}
}
