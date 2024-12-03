import type { Database } from '$lib/db/drizzle';
import { eq } from 'drizzle-orm';
import { users, type UserInsert } from '$lib/db/schema';

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
		return await this.#db.query.users.findMany();
	}

	async updateUserRole(userId: string, role: 'board' | 'normal') {
		return await this.#db
			.update(users)
			.set({ role })
			.where(eq(users.id, userId))
			.returning()
			.then((rows) => rows[0]);
	}

	async findById(userId: string) {
		const user = await this.#db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.then((results) => results[0]);

		return user;
	}
}
