import { defineType, defineField } from "sanity";

export default defineType({
  name: "productType",
  title: "Produkttype",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
