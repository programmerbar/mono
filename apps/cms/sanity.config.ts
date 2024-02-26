import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemas } from "./schemas";
import { markdownSchema } from "sanity-plugin-markdown";

export default defineConfig({
  name: "default",
  title: "Programmerbar",

  projectId: "elfb3wn1",
  dataset: "production",

  plugins: [structureTool(), visionTool(), markdownSchema()],

  schema: {
    types: schemas,
  },
});
