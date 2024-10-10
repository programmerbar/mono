import ContactUsEmail from "../components/emails/ContactUsEmail";
import { Resend } from "resend";

export const PROGRAMMERBAR_EMAIL = "styret@programmerbar.no";
export const FROM_EMAIL = "ikkesvar@programmer.bar";

export const sendContactEmail = async (
  name: string,
  email: string,
  message: string,
  apiKey: string,
) => {
  if (!import.meta.env.PROD) {
    console.log("Sending email", {
      name,
      email,
      message,
    });
    return;
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: FROM_EMAIL,
    subject: "Kontaktskjema på hjemmesiden",
    to: [PROGRAMMERBAR_EMAIL],
    react: ContactUsEmail({
      name,
      email,
      message,
    }),
  });
};
