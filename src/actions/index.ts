import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { sendContactEmail } from "../lib/send-contact-email";

export const server = {
  contactUsAction: defineAction({
    input: z.object({
      name: z.string().min(2, { message: "Navn er påkrevd" }),
      email: z.string().min(2, { message: "E-post er påkrevd" }),
      message: z.string().min(5, { message: "Meldingen må være minst 5 tegn" }),
    }),
    handler: async ({ name, email, message }) => {
      await sendContactEmail(name, email, message);
    },
  }),
};
