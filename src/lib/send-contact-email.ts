import { resend } from "./resend";
import ContactUsEmail from "../components/emails/ContactUsEmail";

export const PROGRAMMERBAR_EMAIL = "styret@programmerbar.no";

export const sendContactEmail = async (name: string, email: string, message: string) => {
  if (!import.meta.env.PROD) {
    console.log("Sending email", {
      name,
      email,
      message,
    });
    return;
  }

  await resend.emails.send({
    from: "ikkesvar@echo-webkom.no",
    subject: "Kontaktskjema på hjemmesiden",
    to: [PROGRAMMERBAR_EMAIL],
    react: ContactUsEmail({
      name,
      email,
      message,
    }),
  });
};
