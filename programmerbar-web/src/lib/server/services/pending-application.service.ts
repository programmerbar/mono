import type { Database } from '$lib/server/db/drizzle';
import { pendingApplications } from '$lib/server/db/schemas';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export class PendingApplicationService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async create(data: { name: string; email: string; feideId: string }) {
		const application = await this.#db
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

		return application;
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
		const applications = await this.#db.query.pendingApplications.findMany({
			orderBy: (row, { desc }) => desc(row.createdAt)
		});

		return applications;
	}

	async getCount() {
		const applications = await this.#db.query.pendingApplications.findMany();
		return applications.length;
	}

	async delete(id: string) {
		const result = await this.#db.delete(pendingApplications).where(eq(pendingApplications.id, id));
		return result;
	}

	async deleteByEmail(email: string) {
		const result = await this.#db
			.delete(pendingApplications)
			.where(eq(pendingApplications.email, email.toLowerCase()));
		return result;
	}

	async deleteByFeideId(feideId: string) {
		const result = await this.#db
			.delete(pendingApplications)
			.where(eq(pendingApplications.feideId, feideId));
		return result;
	}
}
