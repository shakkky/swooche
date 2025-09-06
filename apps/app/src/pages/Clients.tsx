import { Heading, Text, VStack } from "@chakra-ui/react";

export function Clients() {
  return (
    <VStack align="start" gap={6}>
      <Heading size="lg" color="gray.800">
        Clients
      </Heading>
      <Text color="gray.600">
        Manage your client relationships and portal access.
      </Text>
    </VStack>
  );
}
