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
      name: "start",
      title: "Startdato",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "end",
      title: "Sluttdato",
      type: "datetime",
      validation: (Rule) =>
        Rule.custom((end, context) => {
          if (!context.document?.start) {
            return true;
          }

          if (!end) {
            return "Sluttdato må være satt";
          }

          const startDate = new Date(String(context.document.start));
          const endDate = new Date(end);

          if (endDate < startDate) {
            return "Sluttdato må være etter startdato";
          }

          return true;
        }),
    }),
    defineField({
      name: "body",
      title: "Brødtekst",
      type: "markdown",
    }),
  ],
});
