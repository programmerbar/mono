import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { echoSanity } from "./client";
import { sanityClient } from "sanity:client";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(sanityClient);

export type Image = SanityImageSource;

export const urlFor = (source: Image) => {
  return builder.image(source);
};

const echoBuilder = imageUrlBuilder(echoSanity);

export const echoUrlFor = (source: Image) => {
  return echoBuilder.image(source);
};
