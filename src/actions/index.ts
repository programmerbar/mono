import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { sendContactEmail } from "../lib/send-contact-email";

export const server = {
  contactUsAction: defineAction({
    input: z.object({
      name: z.string().min(2, { message: "Navn er påkrevd" }),
      email: z.string().email().min(2, { message: "E-post er påkrevd" }),
      message: z.string().min(5, { message: "Meldingen må være minst 5 tegn" }),
    }),
    handler: async ({ name, email, message }, ctx) => {
      const id = Math.random().toString(36).substring(7);
      await ctx.locals.runtime.env.FEEDBACK_KV.put(
        `feedback:${id}`,
        JSON.stringify({ name, email, message }),
      );

      const apiKey = ctx.locals.runtime.env.RESEND_API_KEY;

      await sendContactEmail(name, email, message, apiKey);
    },
  }),
};
