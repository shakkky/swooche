import { Box, Button, Heading, HStack, Icon, Text } from "@chakra-ui/react";
import { PiPhoneLight, PiPhoneSlash } from "react-icons/pi";
import { useTwilioVoice } from "./contexts/TwilioVoiceContext";

export const IncomingCall = () => {
  const { incomingCall, acceptCall, rejectCall, error } = useTwilioVoice();

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!incomingCall) return null;

  return (
    <HStack
      position="absolute"
      top={4}
      right={4}
      padding={4}
      bg="bg.emphasized"
      gap={8}
      borderRadius="md"
    >
      <Box>
        <Heading>Incoming Call</Heading>
        <Text>{incomingCall.from}</Text>
      </Box>
      <HStack gap={2} justifyContent="center" mt={4}>
        <Button onClick={acceptCall} colorPalette="green" borderRadius="full">
          <Icon size="md">
            <PiPhoneLight />
          </Icon>
        </Button>
        <Button onClick={rejectCall} colorPalette="red" borderRadius="full">
          <Icon size="sm">
            <PiPhoneSlash />
          </Icon>
        </Button>
      </HStack>
    </HStack>
  );
};
