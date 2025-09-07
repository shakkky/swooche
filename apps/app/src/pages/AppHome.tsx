import { Heading, Text, VStack, Box } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { MyBoards } from "../components/MyBoards";

export function AppHome() {
  const { user } = useAuth();

  return (
    <VStack align="start" gap={8}>
      <Box>
        <Heading size="2xl" color="gray.800" mb={2}>
          Welcome,{" "}
          {user?.user_metadata?.full_name
            ?.split(" ")[0]
            .charAt(0)
            .toUpperCase() +
            user?.user_metadata?.full_name?.split(" ")[0].slice(1) ||
            user?.user_metadata?.full_name}
        </Heading>
        <Text color="gray.600">
          Manage your client portals and projects from this dashboard.
        </Text>
      </Box>

      <MyBoards />
    </VStack>
  );
}
