import { Heading, Text, VStack, Box } from "@chakra-ui/react";
import { useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MyBoards } from "../components/MyBoards";

export function AppHome() {
  const { user } = useAuth();

  const displayName = useMemo(() => {
    if (!user?.user_metadata?.full_name) return "";

    const firstName = user.user_metadata.full_name.split(" ")[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1);
  }, [user?.user_metadata?.full_name]);

  return (
    <VStack align="start" gap={8}>
      <Box>
        <Heading size="2xl" color="gray.800" mb={2}>
          Welcome, {displayName}
        </Heading>
        <Text color="gray.600">
          Manage your client portals and projects from this dashboard.
        </Text>
      </Box>

      <MyBoards />
    </VStack>
  );
}
