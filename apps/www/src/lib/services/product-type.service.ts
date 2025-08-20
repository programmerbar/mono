import type { Database } from '$lib/db/drizzle';
import { productTypes, type ProductType, type ProductTypeInsert } from '$lib/db/schemas';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export class ProductTypeService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async getAll(): Promise<ProductType[]> {
		return await this.#db.select().from(productTypes);
	}

	async getById(id: string): Promise<ProductType | null> {
		const result = await this.#db.select().from(productTypes).where(eq(productTypes.id, id));
		return result[0] || null;
	}

	async create(
		data: Omit<ProductTypeInsert, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<ProductType> {
		const now = new Date().toISOString();
		const productType: ProductTypeInsert = {
			id: nanoid(),
			...data,
			createdAt: now,
			updatedAt: now
		};

		await this.#db.insert(productTypes).values(productType);
		return productType as ProductType;
	}

	async update(
		id: string,
		data: Partial<Omit<ProductTypeInsert, 'id' | 'createdAt'>>
	): Promise<ProductType | null> {
		const now = new Date().toISOString();
		const updateData = {
			...data,
			updatedAt: now
		};

		await this.#db.update(productTypes).set(updateData).where(eq(productTypes.id, id));
		return await this.getById(id);
	}

	async delete(id: string): Promise<boolean> {
		await this.#db.delete(productTypes).where(eq(productTypes.id, id));
		return true;
	}
}
