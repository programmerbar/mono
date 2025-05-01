import type { Database } from '$lib/db/drizzle';

export class GroupsService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async getUsersById(groupId: string) {
		return await this.#db.query.usersGroups.findMany({
			where: (row, { eq }) => eq(row.groupId, groupId),
			with: {
				user: true
			}
		});
	}
}
