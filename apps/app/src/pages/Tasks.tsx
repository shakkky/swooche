import { Heading, Text, VStack } from "@chakra-ui/react";

export function Tasks() {
  return (
    <VStack align="start" gap={6}>
      <Heading size="lg" color="gray.800">
        Tasks
      </Heading>
      <Text color="gray.600">
        Track and manage your project tasks and deliverables.
      </Text>
    </VStack>
  );
}
