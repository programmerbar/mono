import { defineField, defineType } from "sanity";

export default defineType({
  name: "producer",
  title: "Produsent",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
    }),
  ],
});
