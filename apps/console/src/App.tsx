import { TwilioVoiceProvider } from "./contexts/TwilioVoiceContext";
import { IncomingCall } from "./IncomingCall";
import { CurrentIdentity } from "./CurrentIdentity";
import { ConnectedCall } from "./ConnectedCall";
import { Start } from "./Start";
import { Center } from "@chakra-ui/react";

const App = () => {
  return (
    <Center height="100vh" width="100vw">
      <TwilioVoiceProvider>
        <CurrentIdentity />
        <IncomingCall />
        <ConnectedCall />
        <Start />
      </TwilioVoiceProvider>
    </Center>
  );
};

export default App;
