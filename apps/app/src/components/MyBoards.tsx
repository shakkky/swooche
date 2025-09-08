import { trpc } from "@/lib/trpc";
import {
  Box,
  Button,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuthenticatedTrpcQuery } from "../hooks/useAuthenticatedQuery";

export function MyBoards() {
  const navigate = useNavigate();

  const { data: boardsData, isLoading } = useAuthenticatedTrpcQuery(
    trpc.getBoards.useQuery,
    undefined
  );

  const handleCreateBoard = () => {
    navigate("/app/create-board");
  };

  const { boards } = boardsData ?? {};

  return (
    <Box w="full">
      <HStack justify="space-between" align="center" mb={4}>
        <Heading size="xl" color="gray.800">
          My Boards
        </Heading>
        <Button
          variant="solid"
          bg="black"
          color="white"
          px={4}
          _hover={{
            bg: "gray.800",
          }}
          onClick={handleCreateBoard}
        >
          Create new board
        </Button>
      </HStack>

      {isLoading ? (
        <Box
          p={6}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          bg="gray.50"
          textAlign="center"
        >
          <Text color="gray.500" fontSize="sm">
            Loading boards...
          </Text>
        </Box>
      ) : boards?.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          {boards.map((board) => (
            <Box
              key={board._id}
              p={4}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              bg="white"
              cursor="pointer"
              _hover={{ boxShadow: "1px 1px 10px 2px rgba(0, 0, 0, 0.1)" }}
            >
              <VStack align="start" gap={3}>
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>
                    {board.clientName}
                  </Text>
                  <Heading size="sm" color="gray.800">
                    {board.projectName}
                  </Heading>
                </Box>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  display="-webkit-box"
                  style={{ WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}
                >
                  {board.projectGoal}
                </Text>
                <Text fontSize="xs" color="gray.400">
                  Created {new Date(board.createdAt).toLocaleDateString()}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Box
          p={6}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          bg="gray.50"
          textAlign="center"
        >
          <Text color="gray.500" fontSize="sm">
            No boards yet. Create your first board to get started.
          </Text>
        </Box>
      )}
    </Box>
  );
}
