import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { TwilioVoiceProvider } from "../contexts/TwilioVoiceContext";
import { IncomingCall } from "../IncomingCall";
import { ConnectedCall } from "../ConnectedCall";
import { Start } from "../Start";
import { CurrentIdentity } from "../CurrentIdentity";

export function Home() {
  const { user, signOut } = useAuth();

  return (
    <Container maxW="6xl" py={6}>
      <VStack gap={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Box>
            <Heading size="lg">Dashboard</Heading>
            <Text color="gray.600">
              Welcome back, {user?.user_metadata?.full_name || user?.email}
            </Text>
          </Box>
          <HStack gap={4}>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </HStack>
        </HStack>

        {/* Main Content */}
        <Box>
          <TwilioVoiceProvider>
            <CurrentIdentity />
            <IncomingCall />
            <ConnectedCall />
            <Start />
          </TwilioVoiceProvider>
        </Box>
      </VStack>
    </Container>
  );
}
