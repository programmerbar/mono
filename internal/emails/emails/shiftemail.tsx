import {
  Body,
  Container,
  Head,
  Html,
  Text,
  Tailwind,
} from "@react-email/components";

import { normalDate } from "$lib/date";

export interface ShiftEmailProps {
  shift: {
    startAt: string;
    endAt: string;
    summary: string;
    description?: string;
  };
  user: {
    name: string;
    email: string;
  };
}

const ShiftEmail = ({ shift, user }: ShiftEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Text className="text-center text-2xl font-medium">
              Hei {user.name}, du har fått en ny vakt!
            </Text>

            <Text className="mt-4">
              Du har blitt tildelt en vakt med følgende detaljer:
            </Text>

            <Text className="mt-2">
              <strong>Fra:</strong>{" "}
              {normalDate(new Date(shift.startAt).toLocaleString())}
            </Text>

            <Text className="mt-1">
              <strong>Til:</strong>{" "}
              {normalDate(new Date(shift.endAt).toLocaleString())}
            </Text>

            {shift.description && (
              <Text className="mt-2">
                <strong>Beskrivelse:</strong> {shift.description}
              </Text>
            )}

            <Text className="mt-4">
              Kalenderinvitasjonen er vedlagt denne e-posten.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ShiftEmail.PreviewProps = {
  shift: {
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 3600000).toISOString(),
    summary: "Vakt for programmerbar fredagsåpent",
    description: "Programmerbar.",
  },
  user: {
    name: "Ola Nordmann",
    email: "ola.nordmann@example.com",
  },
} as ShiftEmailProps;

export default ShiftEmail;
