import { type Database } from '$lib/db/drizzle';
import {
	products,
	producers,
	productTypes,
	productProductTypes,
	type Product,
	type ProductInsert,
	type Producer,
	type ProductType
} from '$lib/db/schemas';
import { eq, inArray } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export interface ProductWithRelations extends Product {
	producer?: Producer | null;
	types?: Array<ProductType>;
}

export class ProductService {
	#db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	async getAll(): Promise<ProductWithRelations[]> {
		console.log(`[ProductService] Fetching all products`);
		const productList = await this.#db
			.select({
				product: products,
				producer: producers
			})
			.from(products)
			.leftJoin(producers, eq(products.producerId, producers.id));

		// Get product types for each product
		const productIds = productList.map((p) => p.product.id);
		const productTypesData =
			productIds.length > 0
				? await this.#db
						.select({
							productId: productProductTypes.productId,
							type: productTypes
						})
						.from(productProductTypes)
						.innerJoin(productTypes, eq(productProductTypes.productTypeId, productTypes.id))
						.where(inArray(productProductTypes.productId, productIds))
				: [];

		// Combine data
		const result = productList.map(({ product, producer }) => ({
			...product,
			producer,
			types: productTypesData.filter((pt) => pt.productId === product.id).map((pt) => pt.type)
		}));

		console.log(`[ProductService] Found ${result.length} product(s)`);
		return result;
	}

	async getById(id: string): Promise<ProductWithRelations | null> {
		console.log(`[ProductService] Fetching product by ID: ${id}`);
		const result = await this.#db
			.select({
				product: products,
				producer: producers
			})
			.from(products)
			.leftJoin(producers, eq(products.producerId, producers.id))
			.where(eq(products.id, id));

		if (!result[0]) {
			console.log(`[ProductService] Product not found: ${id}`);
			return null;
		}

		// Get product types
		const productTypesData = await this.#db
			.select({
				type: productTypes
			})
			.from(productProductTypes)
			.innerJoin(productTypes, eq(productProductTypes.productTypeId, productTypes.id))
			.where(eq(productProductTypes.productId, id));

		console.log(
			`[ProductService] ✅ Found product: ${result[0].product.name} with ${productTypesData.length} type(s)`
		);
		return {
			...result[0].product,
			producer: result[0].producer,
			types: productTypesData.map((pt) => pt.type)
		};
	}

	async create(
		data: Omit<ProductInsert, 'createdAt' | 'updatedAt'> & { id?: string },
		typeIds: string[] = []
	): Promise<ProductWithRelations> {
		console.log(`[ProductService] Creating product: ${data.name}`);
		const now = new Date().toISOString();
		const product: ProductInsert = {
			id: data.id || nanoid(),
			name: data.name,
			description: data.description,
			sku: data.sku,
			isSoldOut: data.isSoldOut,
			ordinaryPrice: data.ordinaryPrice,
			studentPrice: data.studentPrice,
			internalPrice: data.internalPrice,
			credits: data.credits,
			volume: data.volume,
			alcoholContent: data.alcoholContent,
			variants: data.variants,
			imageId: data.imageId,
			producerId: data.producerId,
			createdAt: now,
			updatedAt: now
		};

		await this.#db.insert(products).values(product);

		// Add product types
		if (typeIds.length > 0) {
			console.log(`[ProductService] Adding ${typeIds.length} product type(s)`);
			await this.#db.insert(productProductTypes).values(
				typeIds.map((typeId) => ({
					productId: product.id,
					productTypeId: typeId
				}))
			);
		}

		console.log(`[ProductService] ✅ Product created: ${product.id} (${product.name})`);
		return (await this.getById(product.id))!;
	}

	async update(
		id: string,
		data: Partial<Omit<ProductInsert, 'id' | 'createdAt'>>,
		typeIds?: string[]
	): Promise<ProductWithRelations | null> {
		console.log(`[ProductService] Updating product: ${id}`);
		const now = new Date().toISOString();
		const updateData = {
			...data,
			updatedAt: now
		};

		await this.#db.update(products).set(updateData).where(eq(products.id, id));

		// Update product types if provided
		if (typeIds !== undefined) {
			console.log(`[ProductService] Updating product types: ${typeIds.length} type(s)`);
			// Remove existing types
			await this.#db.delete(productProductTypes).where(eq(productProductTypes.productId, id));

			// Add new types
			if (typeIds.length > 0) {
				await this.#db.insert(productProductTypes).values(
					typeIds.map((typeId) => ({
						productId: id,
						productTypeId: typeId
					}))
				);
			}
		}

		console.log(`[ProductService] ✅ Product updated: ${id}`);
		return await this.getById(id);
	}

	async delete(id: string): Promise<boolean> {
		console.log(`[ProductService] Deleting product: ${id}`);
		// Delete product types first (cascade should handle this, but being explicit)
		await this.#db.delete(productProductTypes).where(eq(productProductTypes.productId, id));

		await this.#db.delete(products).where(eq(products.id, id));
		console.log(`[ProductService] ✅ Product deleted: ${id}`);
		return true;
	}
}
