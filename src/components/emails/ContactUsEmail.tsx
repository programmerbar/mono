import * as React from "react";
import { Body, Container, Head, Html, Text } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface ContactUsEmailProps {
  name?: string;
  email?: string;
  message?: string;
}

export const ContactUsEmail = ({ name, email, message }: ContactUsEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Text>Navn: {name}</Text>
            <Text>E-post: {email}</Text>
            <Text>Melding: {message}</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ContactUsEmail.PreviewProps = {
  name: "Ola Nordmann",
  email: "ola.nordmann@echo.uib.no",
  message: "Hei, jeg vil gjerne ha kontakt med dere.",
} as ContactUsEmailProps;

export default ContactUsEmail;
