import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanity } from './client';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(sanity);

export type Image = SanityImageSource;

export const urlFor = (source: Image) => {
	return builder.image(source);
};
