import { defineType, defineField } from "sanity";

export default defineType({
  name: "standPlan",
  title: "Ståplan",
  type: "document",
  fields: [
    defineField({
      name: "start",
      title: "Start tidspunkt",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "end",
      title: "Slutt tidspunkt",
      type: "datetime",
      validation: (Rule) => Rule.required().min(Rule.valueOfField("start")),
    }),
    defineField({
      name: "event",
      title: "Arrangement",
      description: "Arrangementet som ståplanen gjelder for. Ikke påkrevd.",
      type: "reference",
      to: [{ type: "event" }],
    }),
    defineField({
      name: "members",
      title: "Medlemmer",
      type: "array",
      of: [{ type: "reference", to: [{ type: "profile" }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      start: "start",
      member0: "members.0.name",
      member1: "members.1.name",
      member2: "members.2.name",
    },
    prepare({
      start,
      member0,
      member1,
      member2,
    }: {
      start: string;
      member0: string;
      member1: string;
      member2: string;
    }) {
      const members =
        [member0, member1, member2].filter(Boolean).join(", ") || "Ingen";

      return {
        title: `${members}`,
        subtitle: `Dato: ${new Date(start).toLocaleDateString("no-NB")}`,
      };
    },
  },
});
