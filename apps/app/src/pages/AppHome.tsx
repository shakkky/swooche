import { Heading, Text, VStack } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";

export function AppHome() {
  const { user } = useAuth();

  return (
    <VStack align="start" gap={6}>
      <Heading size="lg" color="gray.800">
        Welcome,{" "}
        {user?.user_metadata?.full_name?.split(" ")[0].charAt(0).toUpperCase() +
          user?.user_metadata?.full_name?.split(" ")[0].slice(1) ||
          user?.user_metadata?.full_name}
      </Heading>
      <Text color="gray.600">
        Manage your client portals and projects from this dashboard.
      </Text>
    </VStack>
  );
}
