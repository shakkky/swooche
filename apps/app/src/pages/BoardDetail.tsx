import { trpc } from "@/lib/trpc";
import {
  Badge,
  Box,
  Button,
  Center,
  Dialog,
  Heading,
  HStack,
  Image,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import clickupLogo from "../assets/logos/clickup.png";
import swoocheLogo from "../assets/logos/swooche.png";
import { TaskSelectionModal } from "../components/TaskSelectionModal";
import { getBaseUrl, getClickUpClientId } from "../config";
import { useAuthenticatedTrpcQuery } from "../hooks/useAuthenticatedQuery";

const ConnectClickUpModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const handleConnect = () => {
    // Store the current URL to return to after OAuth
    localStorage.setItem("clickup-oauth-return-url", window.location.pathname);

    // Redirect to ClickUp OAuth
    const clientId = getClickUpClientId();
    const redirectUri = encodeURIComponent(
      `${getBaseUrl()}/app/connect?client=clickup`
    );
    const oauthUrl = `https://app.clickup.com/api?client_id=${clientId}&redirect_uri=${redirectUri}`;
    window.location.href = oauthUrl;
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="lg">
          <Dialog.Header>
            <Dialog.Title>Connect ClickUp</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body pb={6}>
            <VStack gap={4} align="stretch">
              <HStack justify="center" gap={4} mb={4} mt={4}>
                <Box w={16} h={16} objectFit="contain">
                  <Image
                    src={swoocheLogo}
                    alt="Swooche Logo"
                    w={16}
                    h={16}
                    borderRadius="md"
                  />
                </Box>

                <Text fontSize="sm" color="gray.500">
                  +
                </Text>

                <Box w={16} h={16} objectFit="contain">
                  <Image src={clickupLogo} alt="ClickUp Logo" w={16} h={16} />
                </Box>
              </HStack>

              <Text color="gray.600">
                To connect ClickUp, you'll need to authorize Swooche to access
                your ClickUp workspace.
              </Text>
              <Box p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" color="gray.500" mb={2}>
                  What we'll access:
                </Text>
                <VStack align="start" gap={1}>
                  <Text fontSize="sm">• Read your tasks and projects</Text>
                  <Text fontSize="sm">• Sync task status updates</Text>
                  <Text fontSize="sm">• Create and update tasks</Text>
                </VStack>
              </Box>
              <HStack justify="space-between">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleConnect}>
                  Authorize ClickUp
                </Button>
              </HStack>
            </VStack>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

const SetupConnectionsPrompt = () => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(255, 255, 255, 0.8)"
        backdropFilter="blur(4px)"
        borderRadius="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          bg="white"
          p={8}
          borderRadius="xl"
          boxShadow="0 10px 25px rgba(0, 0, 0, 0.1)"
          maxW="400px"
          textAlign="center"
          border="1px solid"
          borderColor="gray.200"
        >
          <VStack gap={4}>
            <Box w={16} h={16} objectFit="contain">
              <Image src={clickupLogo} alt="ClickUp" w={16} h={16} />
            </Box>
            <VStack gap={2}>
              <Heading size="md" color="gray.800">
                Connect Your Tools
              </Heading>
              <Text color="gray.600" fontSize="sm">
                Connect ClickUp to start syncing your tasks and managing your
                project workflow.
              </Text>
            </VStack>
            <Button
              size="lg"
              onClick={onOpen}
              w="full"
              color="white"
              bg="black"
            >
              Connect ClickUp
            </Button>
            <Text color="gray.400" fontSize="xs">
              You'll be redirected to ClickUp to authorize the connection
            </Text>
          </VStack>
        </Box>
      </Box>

      <ConnectClickUpModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const ExampleBoard = () => {
  const { data: connectionsData, isLoading } = useAuthenticatedTrpcQuery(
    trpc.connection.getConnections.useQuery,
    undefined
  );
  const { connections } = connectionsData ?? {};

  const isConnected = connections?.some(
    (connection) => connection.provider === "clickup"
  );

  const {
    open: isTaskModalOpen,
    onOpen: onTaskModalOpen,
    onClose: onTaskModalClose,
  } = useDisclosure();

  const handleTasksSelected = (tasks: any[]) => {
    console.log("Selected tasks:", tasks);
    // TODO: Implement task import logic
    onTaskModalClose();
  };

  return (
    <>
      <Box position="relative">
        {/* Import Tasks Button */}
        {isConnected && (
          <HStack justify="flex-end" mb={4}>
            <Button
              onClick={onTaskModalOpen}
              colorScheme="blue"
              variant="outline"
            >
              <HStack gap={2}>
                <Image src={clickupLogo} alt="ClickUp" w={4} h={4} />
                <Text>Import Tasks from ClickUp</Text>
              </HStack>
            </Button>
          </HStack>
        )}

        {/* Swimlanes Container */}
        <Box
          position="relative"
          minH="600px"
          p={4}
          bg="gray.50"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          {/* Swimlanes */}
          <VStack gap={4} align="stretch">
            {/* Sample Swimlanes */}
            <Box
              p={4}
              bg="white"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
            >
              <Text fontWeight="semibold" mb={2}>
                To Do
              </Text>
              <Text color="gray.500" fontSize="sm">
                No tasks yet
              </Text>
            </Box>
            <Box
              p={4}
              bg="white"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
            >
              <Text fontWeight="semibold" mb={2}>
                In Progress
              </Text>
              <Text color="gray.500" fontSize="sm">
                No tasks yet
              </Text>
            </Box>
            <Box
              p={4}
              bg="white"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
            >
              <Text fontWeight="semibold" mb={2}>
                Review
              </Text>
              <Text color="gray.500" fontSize="sm">
                No tasks yet
              </Text>
            </Box>
            <Box
              p={4}
              bg="white"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
            >
              <Text fontWeight="semibold" mb={2}>
                Done
              </Text>
              <Text color="gray.500" fontSize="sm">
                No tasks yet
              </Text>
            </Box>
          </VStack>

          {/* Connection Overlay */}
          {!isConnected && !isLoading ? <SetupConnectionsPrompt /> : null}
        </Box>
      </Box>

      {/* Task Selection Modal */}
      <TaskSelectionModal
        isOpen={isTaskModalOpen}
        onClose={onTaskModalClose}
        onTasksSelected={handleTasksSelected}
      />
    </>
  );
};

export function BoardDetail() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();

  const {
    data: boardData,
    isLoading,
    error,
  } = useAuthenticatedTrpcQuery(
    trpc.board.getBoard.useQuery,
    boardId ? { boardId } : undefined
  );

  const { board } = boardData ?? {};

  if (isLoading) {
    return (
      <Center h="400px">
        <VStack>
          <Spinner size="lg" />
          <Text color="gray.500">Loading board...</Text>
        </VStack>
      </Center>
    );
  }

  if (error || !board) {
    return (
      <Center h="400px">
        <VStack>
          <Text color="red.500">Board not found</Text>
          <Button onClick={() => navigate("/app")} variant="outline">
            Back to Home
          </Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Box w="full" h="full" position="relative">
      {/* Header */}
      <VStack align="start" mb={6} gap={2}>
        <HStack justify="space-between" w="full" align="center">
          <VStack align="start" gap={1}>
            <Text fontSize="sm" color="gray.500">
              {board.clientName}
            </Text>
            <Heading size="xl" color="gray.800">
              {board.projectName}
            </Heading>
          </VStack>
          <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
            Board
          </Badge>
        </HStack>
        {board.projectGoal && (
          <Text color="gray.600" fontSize="sm">
            {board.projectGoal}
          </Text>
        )}
      </VStack>

      <ExampleBoard />
    </Box>
  );
}
