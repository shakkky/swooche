import { trpc } from "@/lib/trpc";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Skeleton,
  Text,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { MdLink, MdCheckCircle, MdError, MdRefresh } from "react-icons/md";
import { useCallback, useMemo } from "react";
import { useAuthenticatedTrpcQuery } from "../hooks/useAuthenticatedQuery";
import clickupLogo from "../assets/logos/clickup.png";
import { toaster } from "../components/ui/toaster";

// Skeleton component for connection cards
const ConnectionCardSkeleton = () => {
  return (
    <Box
      p={4}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      bg="white"
    >
      <VStack align="start" gap={3}>
        <HStack justify="space-between" align="center" w="full">
          <HStack gap={3}>
            <Skeleton height="24px" width="24px" borderRadius="md" />
            <Skeleton height="20px" width="120px" />
          </HStack>
          <Skeleton height="24px" width="80px" borderRadius="md" />
        </HStack>
        <VStack align="start" gap={2} w="full">
          <Skeleton height="16px" width="100%" />
          <Skeleton height="16px" width="80%" />
        </VStack>
      </VStack>
    </Box>
  );
};

// Skeleton component for the page header
const PageHeaderSkeleton = () => {
  return (
    <HStack justify="space-between" align="center" mb={6}>
      <Skeleton height="32px" width="200px" />
      <Skeleton height="40px" width="150px" borderRadius="md" />
    </HStack>
  );
};

export function MyConnections() {
  const {
    data: connectionsData,
    isLoading,
    refetch,
  } = useAuthenticatedTrpcQuery(
    trpc.connection.getConnections.useQuery,
    undefined
  );

  const testConnectionMutation = trpc.connection.testConnection.useMutation({
    onSuccess: (data) => {
      refetch();
      toaster.create({
        title: "Connection Test Successful",
        description: (data as any).message || "Connection is working properly",
        type: "success",
        duration: 4000,
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Connection Test Failed",
        description: error.message || "Failed to test connection",
        type: "error",
        duration: 5000,
      });
    },
  });

  const handleTestConnection = useCallback(
    (connectionId: string) => {
      const loadingToaster = toaster.create({
        title: "Testing Connection",
        description: "Checking connection status...",
        type: "loading",
        duration: 0,
      });

      testConnectionMutation.mutate(
        { connectionId },
        {
          onSuccess: () => {
            toaster.dismiss(loadingToaster);
          },
          onError: () => {
            toaster.dismiss(loadingToaster);
          },
        }
      );
    },
    [testConnectionMutation]
  );

  const { connections } = connectionsData ?? {};

  const getProviderInfo = useCallback((provider: string) => {
    switch (provider.toLowerCase()) {
      case "clickup":
        return {
          name: "ClickUp",
          color: "#7B68EE",
          description: "Project management and task tracking",
          logo: clickupLogo,
          hasLogo: true,
        };
      case "slack":
        return {
          name: "Slack",
          color: "#4A154B",
          description: "Team communication and collaboration",
          logo: null,
          hasLogo: false,
        };
      case "notion":
        return {
          name: "Notion",
          color: "#000000",
          description: "All-in-one workspace",
          logo: null,
          hasLogo: false,
        };
      default:
        return {
          name: provider.charAt(0).toUpperCase() + provider.slice(1),
          color: "#6B7280",
          description: "Third-party integration",
          logo: null,
          hasLogo: false,
        };
    }
  }, []);

  const connectionCards = useMemo(() => {
    if (!connections || connections.length === 0) return null;

    return connections.map((connection) => {
      const providerInfo = getProviderInfo(connection.provider);
      const isTesting = testConnectionMutation.isPending;

      return (
        <Box
          key={connection._id}
          p={4}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          bg="white"
        >
          <VStack align="start" gap={3}>
            <HStack justify="space-between" align="center" w="full">
              <HStack gap={3}>
                <Box
                  w={24}
                  h={24}
                  borderRadius="md"
                  bg={providerInfo.hasLogo ? "transparent" : providerInfo.color}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {providerInfo.hasLogo ? (
                    <Image
                      src={providerInfo.logo}
                      alt={`${providerInfo.name} logo`}
                      w={24}
                      h={24}
                      objectFit="contain"
                    />
                  ) : (
                    <Icon as={MdLink} color="white" boxSize={4} />
                  )}
                </Box>
                <VStack align="start" gap={0}>
                  <Text fontWeight="semibold" fontSize="md">
                    {providerInfo.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {providerInfo.description}
                  </Text>
                </VStack>
              </HStack>
              <Badge colorScheme="green" variant="subtle">
                <Icon as={MdCheckCircle} boxSize={3} mr={1} />
                Connected
              </Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              Connected on {new Date(connection.createdAt).toLocaleDateString()}
            </Text>
            <HStack gap={2}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleTestConnection(connection._id)}
                loading={isTesting}
                loadingText="Testing..."
              >
                <Icon as={MdRefresh} />
                Test Connection
              </Button>
              <Button size="sm" variant="ghost" colorScheme="red">
                <Icon as={MdError} boxSize={5} />
                Disconnect
              </Button>
            </HStack>
          </VStack>
        </Box>
      );
    });
  }, [
    connections,
    getProviderInfo,
    testConnectionMutation.isPending,
    handleTestConnection,
  ]);

  // Show full page skeleton on initial load
  if (isLoading && !connectionsData) {
    return (
      <VStack align="start" gap={8}>
        <PageHeaderSkeleton />
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} w="full">
          <ConnectionCardSkeleton />
          <ConnectionCardSkeleton />
          <ConnectionCardSkeleton />
        </SimpleGrid>
      </VStack>
    );
  }

  return (
    <VStack align="start" gap={8}>
      <HStack justify="space-between" align="center" w="full">
        <Box>
          <Heading size="2xl" color="gray.800" mb={2}>
            My Connections
          </Heading>
          <Text color="gray.600">
            Manage your OAuth integrations and third-party connections.
          </Text>
        </Box>
        <Button
          variant="solid"
          bg="black"
          color="white"
          px={4}
          _hover={{
            bg: "gray.800",
          }}
          onClick={() => (window.location.href = "/app/connect")}
        >
          <Icon as={MdLink} boxSize={5} />
          Add Connection
        </Button>
      </HStack>

      {/* Loading State - Only show when refetching */}
      {isLoading && connectionsData && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} w="full">
          <ConnectionCardSkeleton />
          <ConnectionCardSkeleton />
          <ConnectionCardSkeleton />
        </SimpleGrid>
      )}

      {/* Connections Grid */}
      {!isLoading && connectionCards && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} w="full">
          {connectionCards}
        </SimpleGrid>
      )}

      {/* Empty State */}
      {!isLoading && (!connections || connections.length === 0) && (
        <Box
          p={6}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          bg="gray.50"
          textAlign="center"
          w="full"
        >
          <VStack gap={4}>
            <Icon as={MdLink} boxSize={12} color="gray.400" />
            <VStack gap={2}>
              <Heading size="md" color="gray.600">
                No connections yet
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Connect your favorite tools to get started with Swooche.
              </Text>
            </VStack>
            <Button
              variant="solid"
              bg="black"
              color="white"
              px={6}
              _hover={{
                bg: "gray.800",
              }}
              onClick={() => (window.location.href = "/app/connect")}
            >
              <Icon as={MdLink} boxSize={5} />
              Add Your First Connection
            </Button>
          </VStack>
        </Box>
      )}
    </VStack>
  );
}
