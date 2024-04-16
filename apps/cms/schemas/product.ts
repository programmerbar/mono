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
      name: "productType",
      title: "Type",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productType" }] }],
    }),
    defineField({
      name: "isSoldOut",
      title: "Utsolgt",
      type: "boolean",
      validation: (Rule) => Rule.required(),
      options: {
        layout: "switch",
      },
      initialValue: false,
    }),
    defineField({
      name: "price",
      title: "Pris",
      description: "Pris i kroner.",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "volume",
      title: "Volum",
      description: "Volum i liter. F.eks. 0.5 for en halvliter.",
      type: "number",
      validation: (Rule) => Rule.greaterThan(0),
    }),
    defineField({
      name: "variants",
      title: "Varianter",
      description: "Varianter av smak eller type. Tom for ingen varianter.",
      type: "array",
      of: [{ type: "string" }],
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
  preview: {
    select: {
      title: "name",
      subtitle: "producer.name",
      media: "image",
    },
  },
});
