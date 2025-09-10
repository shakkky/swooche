"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { MdRefresh } from "react-icons/md";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Public board page error:", error);
  }, [error]);

  return (
    <Container maxW="md" py={16}>
      <VStack gap={6} align="center" textAlign="center">
        <VStack gap={4}>
          <Heading size="xl" color="red.600">
            Something went wrong!
          </Heading>
          <Text color="gray.600" fontSize="lg">
            We encountered an error while loading this board. Please try again.
          </Text>
          {process.env.NODE_ENV === "development" && (
            <Box
              p={4}
              bg="red.50"
              border="1px solid"
              borderColor="red.200"
              borderRadius="md"
              maxW="full"
            >
              <Text fontSize="sm" color="red.700" fontFamily="mono">
                {error.message}
              </Text>
            </Box>
          )}
        </VStack>

        <Button onClick={reset} colorScheme="blue" size="lg">
          <MdRefresh style={{ marginRight: "8px" }} />
          Try Again
        </Button>
      </VStack>
    </Container>
  );
}
