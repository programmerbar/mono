import { defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export default defineType({
  name: "event",
  title: "Arrangement",
  type: "document",
  icon: CalendarIcon,
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
      name: "isPrivate",
      title: "Er arrangementet privat?",
      type: "boolean",
      options: {
        layout: "switch",
      },
      initialValue: false,
    }),
    defineField({
      name: "registrationLink",
      title: "Påmeldingslenke",
      description: "Lenke til påmeldingsskjema. Tomt om det ikke er påmelding.",
      type: "url",
    }),
    defineField({
      name: "body",
      title: "Brødtekst",
      type: "markdown",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
