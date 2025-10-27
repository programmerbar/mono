import type { Database } from '$lib/server/db/drizzle';
import { contactSubmissions, type ContactSubmissionInsert } from '$lib/server/db/schemas';
import { nanoid } from 'nanoid';
import { desc } from 'drizzle-orm';

export class ContactSubmissionService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async create(data: Omit<ContactSubmissionInsert, 'id' | 'submittedAt'>) {
		const submission = await this.#db
			.insert(contactSubmissions)
			.values({
				id: nanoid(),
				...data,
				submittedAt: new Date()
			})
			.returning()
			.get();

		console.log(`[ContactSubmissionService] ✅ Contact submission created: ${submission.id}`);
		return submission;
	}

	async findAll() {
		const submissions = await this.#db.query.contactSubmissions.findMany({
			orderBy: [desc(contactSubmissions.submittedAt)]
		});

		return submissions;
	}

	async findById(id: string) {
		const submission = await this.#db.query.contactSubmissions.findFirst({
			where: (row, { eq }) => eq(row.id, id)
		});

		return submission;
	}
}
