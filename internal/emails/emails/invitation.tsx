import {
  Body,
  Container,
  Head,
  Html,
  Text,
  Tailwind,
  Link,
} from "@react-email/components";

export interface InvitationEmailProps {
  email?: string;
}

const InvitationEmail = ({ email }: InvitationEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Text className="text-center text-2xl font-medium">
              Velkommen til Programmerbar
            </Text>

            <Text>
              Du kan nå lage bruker på{" "}
              <Link href="https://programmer.bar">programmer.bar</Link>! For å
              registrere din bruker, logg inn med følgende e-post: {email}.
            </Text>

            <Link
              className="w-full text-center rounded-lg bg-blue-500 p-2 mx-auto text-white"
              href="https://programmer.bar/logg-inn"
            >
              Registrer deg her
            </Link>

            <Text className="text-sm text-gray-500">
              Om du ikke registrerer deg innen 7 dager, vil invitasjonen utløpe.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

InvitationEmail.PreviewProps = {
  email: "ola.nordmann@echo.uib.no",
} as InvitationEmailProps;

export default InvitationEmail;
