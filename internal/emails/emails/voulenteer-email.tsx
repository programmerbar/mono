import {
  Body,
  Container,
  Head,
  Html,
  Text,
  Tailwind,
  Heading,
} from "@react-email/components";

export interface VoulenteerEmailProps {
  email: string;
  name: string;
}

const VoulenteerEmail = ({ email, name }: VoulenteerEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading>Ny frivillig-søknad</Heading>

            <Text>
              En ny person har søkt om å bli frivillig hos Programmerbar:
            </Text>
            <Container>
              <Text>Navn: {name}</Text>
              <Text>E-post: {email}</Text>
            </Container>
            <p>
              Brukeren har blitt lagt til i databasen og kan nå logge inn med
              Feide.
            </p>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

VoulenteerEmail.PreviewProps = {
  name: "Ola Nordmann",
  email: "ola.nordmann@uib.no",
} as VoulenteerEmailProps;

export default VoulenteerEmail;
