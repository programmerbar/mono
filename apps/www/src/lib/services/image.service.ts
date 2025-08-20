import type { Database } from '$lib/db/drizzle';
import { images } from '$lib/db/schemas';
import { nanoid } from 'nanoid';

export class ImageService {
	#bucket: R2Bucket;
	#db: Database;

	constructor(bucket: R2Bucket, db: Database) {
		this.#bucket = bucket;
		this.#db = db;
	}

	async upload(file: File): Promise<string> {
		const id = nanoid();

		await this.#bucket.put(id, file, {
			httpMetadata: {
				contentType: file.type,
				cacheControl: 'max-age=31536000, immutable',
				contentDisposition: `inline; filename="${file.name}"`
			}
		});

		await this.#db.insert(images).values({
			id,
			filename: file.name,
			type: file.type,
			size: file.size,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		return id;
	}

	async get(id: string): Promise<R2ObjectBody | null> {
		return await this.#bucket.get(id);
	}
}
