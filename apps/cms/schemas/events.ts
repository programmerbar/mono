import { defineField, defineType } from "sanity";

export default defineType({
  name: "event",
  title: "Arrangement",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "start",
      title: "Startdato",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "end",
      title: "Sluttdato",
      type: "datetime",
      validation: (Rule) => Rule.required().min(Rule.valueOfField("start")),
    }),
    defineField({
      name: "body",
      title: "Brødtekst",
      type: "markdown",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
