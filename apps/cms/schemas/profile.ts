import { defineField, defineType } from "sanity";

export default defineType({
  name: "profile",
  title: "Profil",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
    }),
  ],
});
