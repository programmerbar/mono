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
		console.log(
			`[ContactSubmissionService] Creating contact submission from: ${data.email} (${data.name})`
		);
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
		console.log(`[ContactSubmissionService] Fetching all contact submissions`);
		const submissions = await this.#db.query.contactSubmissions.findMany({
			orderBy: [desc(contactSubmissions.submittedAt)]
		});

		console.log(`[ContactSubmissionService] Found ${submissions.length} contact submission(s)`);
		return submissions;
	}

	async findById(id: string) {
		console.log(`[ContactSubmissionService] Fetching contact submission by ID: ${id}`);
		const submission = await this.#db.query.contactSubmissions.findFirst({
			where: (row, { eq }) => eq(row.id, id)
		});

		if (submission) {
			console.log(`[ContactSubmissionService] ✅ Found contact submission: ${id}`);
		} else {
			console.log(`[ContactSubmissionService] Contact submission not found: ${id}`);
		}

		return submission;
	}
}
