import { trpc } from "@/lib/trpc";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { useAuthenticatedTrpcQuery } from "../hooks/useAuthenticatedQuery";

// Skeleton component for board cards
const BoardCardSkeleton = () => {
  return (
    <Box
      p={4}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      bg="white"
    >
      <VStack align="start" gap={3}>
        <Box w="full">
          <Skeleton height="16px" width="60%" mb={1} />
          <Skeleton height="20px" width="80%" />
        </Box>

        <VStack align="start" gap={1} w="full">
          <Skeleton height="16px" width="100%" />
          <Skeleton height="16px" width="95%" />
          <Skeleton height="16px" width="85%" />
        </VStack>

        <Skeleton height="12px" width="40%" />
      </VStack>
    </Box>
  );
};

// Skeleton component for the page header
const PageHeaderSkeleton = () => {
  return (
    <HStack justify="space-between" align="center" mb={4}>
      <Skeleton height="32px" width="150px" />
      <Skeleton height="40px" width="180px" borderRadius="md" />
    </HStack>
  );
};

export function MyBoards() {
  const navigate = useNavigate();

  const { data: boardsData, isLoading } = useAuthenticatedTrpcQuery(
    trpc.board.getBoards.useQuery,
    undefined
  );

  const handleCreateBoard = useCallback(() => {
    navigate("/app/create-board");
  }, [navigate]);

  const { boards } = boardsData ?? {};

  const boardCards = useMemo(() => {
    if (!boards || boards.length === 0) return null;

    return boards.map((board) => (
      <Box
        key={board._id}
        p={4}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        bg="white"
        cursor="pointer"
        _hover={{ boxShadow: "1px 1px 10px 2px rgba(0, 0, 0, 0.1)" }}
        onClick={() => navigate(`/app/boards/${board._id}`)}
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
    ));
  }, [boards, navigate]);

  // Show full page skeleton on initial load
  if (isLoading && !boardsData) {
    return (
      <Box w="full">
        <PageHeaderSkeleton />
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          <BoardCardSkeleton />
          <BoardCardSkeleton />
          <BoardCardSkeleton />
          <BoardCardSkeleton />
          <BoardCardSkeleton />
          <BoardCardSkeleton />
        </SimpleGrid>
      </Box>
    );
  }

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
          <Icon as={MdAdd} boxSize={5} size="sm" />
          Create new board
        </Button>
      </HStack>

      {/* Loading State - Only show when refetching */}
      {isLoading && boardsData && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          <BoardCardSkeleton />
          <BoardCardSkeleton />
          <BoardCardSkeleton />
          <BoardCardSkeleton />
          <BoardCardSkeleton />
          <BoardCardSkeleton />
        </SimpleGrid>
      )}

      {/* Boards Grid */}
      {!isLoading && boardCards && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          {boardCards}
        </SimpleGrid>
      )}

      {/* Empty State */}
      {!isLoading && (!boards || boards.length === 0) && (
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
