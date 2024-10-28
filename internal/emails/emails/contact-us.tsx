import * as React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Text,
  Tailwind,
} from "@react-email/components";

export interface ContactUsEmailProps {
  name?: string;
  email?: string;
  message?: string;
}

const ContactUsEmail = ({ name, email, message }: ContactUsEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
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
