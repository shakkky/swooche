import {
  Box,
  Card,
  Container,
  HStack,
  Skeleton,
  VStack,
} from "@chakra-ui/react";

export default function Loading() {
  return (
    <Container maxW="6xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Header Skeleton */}
        <VStack gap={4} align="stretch">
          <VStack gap={2} align="start">
            <HStack gap={2} align="center">
              <Skeleton height="24px" width="24px" borderRadius="md" />
              <Skeleton height="32px" width="300px" />
            </HStack>
            <HStack gap={2} align="center">
              <Skeleton height="16px" width="20px" />
              <Skeleton height="16px" width="150px" />
            </HStack>
            <Skeleton height="20px" width="400px" />
          </VStack>
        </VStack>

        {/* Tasks Skeleton */}
        <VStack gap={4} align="stretch">
          <Skeleton height="24px" width="120px" />

          <VStack gap={3} align="stretch">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card.Root key={index} variant="outline">
                <Card.Body>
                  <VStack gap={3} align="stretch">
                    <HStack justify="space-between" align="start">
                      <VStack gap={1} align="start" flex={1}>
                        <Skeleton height="20px" width="250px" />
                        <Skeleton height="16px" width="400px" />
                      </VStack>

                      <HStack gap={2}>
                        <Skeleton height="24px" width="80px" />
                        <Skeleton height="24px" width="100px" />
                      </HStack>
                    </HStack>

                    <HStack gap={4}>
                      <Skeleton height="16px" width="120px" />
                      <Skeleton height="16px" width="100px" />
                    </HStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            ))}
          </VStack>
        </VStack>

        {/* Footer Skeleton */}
        <Box
          textAlign="center"
          py={8}
          borderTop="1px solid"
          borderColor="gray.200"
        >
          <VStack gap={2}>
            <Skeleton height="16px" width="200px" mx="auto" />
            <Skeleton height="32px" width="150px" mx="auto" />
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
