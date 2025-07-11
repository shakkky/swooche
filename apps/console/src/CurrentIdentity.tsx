import { Badge, Box, Heading, Text } from "@chakra-ui/react";
import { useTwilioVoice } from "./contexts/TwilioVoiceContext";
import { Device } from "@twilio/voice-sdk";

export const CurrentIdentity = () => {
  const { started, identity, deviceState, error } = useTwilioVoice();

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!started) return null;

  if (!identity) return <Text>Starting Phone System...</Text>;

  return (
    <Box>
      <Heading>Hi, {identity}</Heading>
      <Text>✅ Phone System Connected</Text>
      <Badge
        colorPalette={
          deviceState === Device.State.Registered ? "green" : "orange"
        }
      >
        {deviceState}
      </Badge>
    </Box>
  );
};
