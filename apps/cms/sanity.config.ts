import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { markdownSchema } from "sanity-plugin-markdown";
import { media } from "sanity-plugin-media";
import { schemaTypes } from "./schemaTypes";
import { deskStructure as structure } from "./src/desk-structure";

export default defineConfig({
  name: "default",
  title: "programmerbar-cms",

  projectId: "elfb3wn1",
  dataset: "production",

  plugins: [
    structureTool({ structure }),
    visionTool(),
    markdownSchema(),
    media(),
  ],

  schema: {
    types: schemaTypes,
  },
});
