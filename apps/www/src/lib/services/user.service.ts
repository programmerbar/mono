import type { Database } from '$lib/db/drizzle';
import { eq, and, not } from 'drizzle-orm';
import { users, type UserInsert } from '$lib/db/schemas';

export class UserService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async findByFeideId(feideId: string) {
		return await this.#db.query.users.findFirst({
			where: (row, { eq }) => eq(row.feideId, feideId)
		});
	}

	async create(user: UserInsert) {
		return await this.#db
			.insert(users)
			.values(user)
			.returning()
			.then((rows) => rows[0]);
	}

	async findAll() {
		return await this.#db.query.users.findMany({
			where: (row, { not }) => not(row.isDeleted)
		});
	}

	async updateUserRole(userId: string, role: 'board' | 'normal') {
		return await this.#db
			.update(users)
			.set({ role })
			.where(eq(users.id, userId))
			.returning()
			.then((rows) => rows[0]);
	}

	async updateAltEmail(userId: string, email: string) {
		return await this.#db
			.update(users)
			.set({ altEmail: email })
			.where(eq(users.id, userId))
			.returning()
			.then((rows) => rows[0]);
	}

	async updatePhone(userId: string, phone: string) {
		return await this.#db
			.update(users)
			.set({ phone })
			.where(eq(users.id, userId))
			.returning()
			.then((rows) => rows[0]);
	}

	async updateTrainingStatus(userId: string, isTrained: boolean) {
		return await this.#db
			.update(users)
			.set({ isTrained })
			.where(eq(users.id, userId))
			.returning()
			.then((rows) => rows[0]);
	}

	async updateCanRefer(userId: string, canRefer: boolean) {
		return await this.#db
			.update(users)
			.set({ canRefer })
			.where(eq(users.id, userId))
			.returning()
			.then((rows) => rows[0]);
	}

	async findById(userId: string) {
		const user = await this.#db
			.select()
			.from(users)
			.where(and(eq(users.id, userId), not(users.isDeleted)))
			.then((results) => results[0]);

		return user;
	}
	async deleteUser(userId: string) {
		return await this.#db
			.update(users)
			.set({ isDeleted: true })
			.where(eq(users.id, userId))
			.returning()
			.then((rows) => rows[0]);
	}

	async findByIdIncludeDeleted(userId: string) {
		const user = await this.#db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.then((results) => results[0]);

		return user;
	}

	async findAllIncludeDeleted() {
		return await this.#db.query.users.findMany();
	}
}
