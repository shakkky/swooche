import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../contexts/AuthContext";

export function SignIn() {
  const { signInWithGoogle } = useAuth();

  return (
    <Container maxW="md" py={10}>
      <VStack gap={8} textAlign="center">
        <Box>
          <Heading size="lg" mb={2}>
            Welcome to Swooche
          </Heading>
          <Text color="gray.600">Sign in to access your dashboard</Text>
        </Box>

        <Button size="lg" w="full" onClick={signInWithGoogle} variant="outline">
          <FcGoogle />
          Continue with Google
        </Button>
      </VStack>
    </Container>
  );
}
