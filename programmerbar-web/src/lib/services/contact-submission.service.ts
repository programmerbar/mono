import type { Database } from '$lib/db/drizzle';
import { contactSubmissions, type ContactSubmissionInsert } from '$lib/db/schemas';
import { nanoid } from 'nanoid';
import { desc } from 'drizzle-orm';

export class ContactSubmissionService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async create(data: Omit<ContactSubmissionInsert, 'id' | 'submittedAt'>) {
		return await this.#db
			.insert(contactSubmissions)
			.values({
				id: nanoid(),
				...data,
				submittedAt: new Date()
			})
			.returning()
			.get();
	}

	async findAll() {
		return await this.#db.query.contactSubmissions.findMany({
			orderBy: [desc(contactSubmissions.submittedAt)]
		});
	}

	async findById(id: string) {
		return await this.#db.query.contactSubmissions.findFirst({
			where: (row, { eq }) => eq(row.id, id)
		});
	}
}
