import { Button, Container, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { MdHome, MdSearch } from "react-icons/md";

export default function NotFound() {
  return (
    <Container maxW="md" py={16}>
      <VStack gap={6} align="center" textAlign="center">
        <VStack gap={4}>
          <Heading size="xl" color="gray.600">
            Board Not Found
          </Heading>
          <Text color="gray.500" fontSize="lg">
            The board you&apos;re looking for doesn&apos;t exist or is no longer
            available.
          </Text>
        </VStack>

        <VStack gap={3}>
          <Link href="/">
            <Button colorScheme="blue" size="lg">
              <MdHome style={{ marginRight: "8px" }} />
              Go Home
            </Button>
          </Link>

          <Text fontSize="sm" color="gray.400">
            or
          </Text>

          <Link href="https://swooche.com">
            <Button variant="outline" size="lg">
              <MdSearch style={{ marginRight: "8px" }} />
              Explore Swooche
            </Button>
          </Link>
        </VStack>
      </VStack>
    </Container>
  );
}
