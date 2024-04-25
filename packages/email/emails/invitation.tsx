import * as React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";
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
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Text className="text-2xl font-medium text-center mb-4">
              Du kan nå lage en bruker!
            </Text>
            <Text className="text-center text-gray-600 mb-8">
              Du har blitt invitert til å lage en bruker på{" "}
              <Link href="https://programmer.bar">programmer.bar</Link>. Følg
              lenken under for å lage en bruker.
            </Text>

            <Text className="text-center mb-10">
              <Link
                className="py-2 px-4 border bg-blue-400 rounded-lg shadow-lg font-medium text-white"
                href={link}
              >
                Lag bruker her
              </Link>
            </Text>

            <Text className="text-xs text-center text-gray-600">
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
