import { type Database } from '$lib/db/drizzle';
import { producers, type Producer, type ProducerInsert } from '$lib/db/schemas';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export class ProducerService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async getAll(): Promise<Producer[]> {
		return await this.#db.select().from(producers);
	}

	async getById(id: string): Promise<Producer | null> {
		const result = await this.#db.select().from(producers).where(eq(producers.id, id));
		return result[0] || null;
	}

	async create(
		data: Omit<ProducerInsert, 'createdAt' | 'updatedAt'> & { id?: string }
	): Promise<Producer> {
		const now = new Date().toISOString();
		const producer: ProducerInsert = {
			id: data.id || nanoid(),
			name: data.name,
			imageId: data.imageId,
			createdAt: now,
			updatedAt: now
		};

		await this.#db.insert(producers).values(producer);
		return producer as Producer;
	}

	async update(
		id: string,
		data: Partial<Omit<ProducerInsert, 'id' | 'createdAt'>>
	): Promise<Producer | null> {
		const now = new Date().toISOString();
		const updateData = {
			...data,
			updatedAt: now
		};

		await this.#db.update(producers).set(updateData).where(eq(producers.id, id));
		return await this.getById(id);
	}

	async delete(id: string): Promise<boolean> {
		await this.#db.delete(producers).where(eq(producers.id, id));
		return true;
	}
}
