import { defineType, defineField } from "sanity";

export default defineType({
  name: "product",
  title: "Produkt",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Pris",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
    }),
    defineField({
      name: "producer",
      title: "Produsent",
      type: "reference",
      to: [{ type: "producer" }],
    }),
  ],
});
