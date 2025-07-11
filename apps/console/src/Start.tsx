import { Button } from "@chakra-ui/react";
import { useTwilioVoice } from "./contexts/TwilioVoiceContext";

export const Start = () => {
  const { error, start, started } = useTwilioVoice();

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (started) {
    return null;
  }

  return <Button onClick={start}>🔓 Start Phone System</Button>;
};
