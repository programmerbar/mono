import { defineField, defineType } from "sanity";

export default defineType({
  name: "price",
  type: "object",
  fields: [
    defineField({
      name: "ordinary",
      type: "number",
      title: "Ordinærpris",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "student",
      type: "number",
      title: "Studentpris",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "internal",
      type: "number",
      title: "Internpris",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
