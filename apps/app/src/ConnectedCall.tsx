import { useTwilioVoice } from "./contexts/TwilioVoiceContext";
import { Call } from "@twilio/voice-sdk";
import { Button, Heading, Text, VStack } from "@chakra-ui/react";

export const ConnectedCall = () => {
  const { callStatus, callDuration, error, endCall } = useTwilioVoice();

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (callStatus === Call.State.Open) {
    const formattedDuration = `${Math.floor(callDuration / 60)}:${
      callDuration % 60
    }`;
    return (
      <VStack gap={4} align="center" justify="center" p={8}>
        <Heading>📞 Call Connected</Heading>
        <Text>Duration: {formattedDuration}</Text>
        <Button onClick={endCall} variant="subtle">
          ❌ End Call
        </Button>
      </VStack>
    );
  }

  return null;
};
