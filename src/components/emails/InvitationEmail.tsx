import * as React from "react";
import { Body, Container, Head, Html, Link, Preview, Text } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface InvitationEmailProps {
  link?: string;
}

export const InvitationEmail = ({ link }: InvitationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Lag bruker på programmer.bar</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Text className="mb-4 text-center text-2xl font-medium">Du kan nå lage en bruker!</Text>
            <Text className="mb-8 text-center text-gray-600">
              Du har blitt invitert til å lage en bruker på{" "}
              <Link href="https://programmer.bar">programmer.bar</Link>. Følg lenken under for å
              lage en bruker.
            </Text>

            <Text className="mb-10 text-center">
              <Link
                className="rounded-lg border bg-blue-400 px-4 py-2 font-medium text-white shadow-lg"
                href={link}
              >
                Lag bruker her
              </Link>
            </Text>

            <Text className="text-center text-xs text-gray-600">
              Denne invitasjoner er gyldig i 7 dager.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

InvitationEmail.PreviewProps = {
  link: "https://google.com",
} as InvitationEmailProps;

export default InvitationEmail;
