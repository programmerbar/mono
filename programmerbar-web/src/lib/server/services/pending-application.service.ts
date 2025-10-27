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
		console.log(
			`[PendingApplicationService] Creating application for: ${data.email} (${data.name})`
		);
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

		console.log(
			`[PendingApplicationService] ✅ Application created: ${application.id} for ${data.email}`
		);
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
		console.log(`[PendingApplicationService] Fetching all pending applications`);
		const applications = await this.#db.query.pendingApplications.findMany({
			orderBy: (row, { desc }) => desc(row.createdAt)
		});

		console.log(`[PendingApplicationService] Found ${applications.length} pending application(s)`);
		return applications;
	}

	async getCount() {
		console.log(`[PendingApplicationService] Getting count of pending applications`);
		const applications = await this.#db.query.pendingApplications.findMany();
		console.log(`[PendingApplicationService] Count: ${applications.length} pending application(s)`);
		return applications.length;
	}

	async delete(id: string) {
		console.log(`[PendingApplicationService] Deleting application: ${id}`);
		const result = await this.#db.delete(pendingApplications).where(eq(pendingApplications.id, id));
		console.log(`[PendingApplicationService] ✅ Application deleted: ${id}`);
		return result;
	}

	async deleteByEmail(email: string) {
		console.log(`[PendingApplicationService] Deleting application by email: ${email}`);
		const result = await this.#db
			.delete(pendingApplications)
			.where(eq(pendingApplications.email, email.toLowerCase()));
		console.log(`[PendingApplicationService] ✅ Application deleted for email: ${email}`);
		return result;
	}

	async deleteByFeideId(feideId: string) {
		console.log(`[PendingApplicationService] Deleting application by Feide ID: ${feideId}`);
		const result = await this.#db
			.delete(pendingApplications)
			.where(eq(pendingApplications.feideId, feideId));
		console.log(`[PendingApplicationService] ✅ Application deleted for Feide ID: ${feideId}`);
		return result;
	}
}
