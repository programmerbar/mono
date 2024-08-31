import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { markdownSchema } from "sanity-plugin-markdown";
import { media } from "sanity-plugin-media";
import { schemas } from "./schemas";
import { deskStructure as structure } from "./src/lib/desk-structure";

export default defineConfig({
  name: "default",
  title: "Programmerbar",
  projectId: "elfb3wn1",
  dataset: "production",

  plugins: [structureTool({ structure }), visionTool(), markdownSchema(), media()],

  schema: {
    types: schemas,
  },
});
