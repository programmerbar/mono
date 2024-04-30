import { theme } from 'https://themer.sanity.build/api/hues?preset=tw-cyan&primary=1db7e2;darkest:23353e'
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemas } from "./schemas";
import { markdownSchema } from "sanity-plugin-markdown";
import { media } from "sanity-plugin-media";
import { BeerEmoji } from './emojis';

export default defineConfig({
  theme,

  name: "default",
  title: "Programmerbar",
  icon: BeerEmoji,

  projectId: "elfb3wn1",
  dataset: "production",

  plugins: [structureTool(), visionTool(), markdownSchema(), media()],

  schema: {
    types: schemas,
  },
});
