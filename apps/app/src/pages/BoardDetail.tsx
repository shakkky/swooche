import { trpc } from "@/lib/trpc";
import {
  Box,
  Button,
  Center,
  Dialog,
  Heading,
  HStack,
  Icon,
  Image,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { MdAdd } from "react-icons/md";
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

const SwimLane: FC<{ children: React.ReactNode; title: string }> = ({
  children,
  title,
}) => {
  return (
    <Box width="full" bg="gray.100" borderRadius="md">
      {/* Header */}
      <Box p={4} pb={4}>
        <HStack justify="space-between" align="center">
          <Text fontWeight="600" color="gray.600" fontSize="sm">
            {title}
          </Text>
        </HStack>
      </Box>

      {/* Content */}
      <Box px={2} pb={8}>
        <VStack gap={2}>
          {/* Render all tasks that have a "todo" status */}
          {children}
        </VStack>
      </Box>
    </Box>
  );
};

const TaskCard: FC<{ task: any }> = ({ task }) => {
  return (
    <VStack
      gap={2}
      alignItems="start"
      p={4}
      bg="white"
      borderRadius="md"
      w="full"
    >
      <Text fontSize="sm" color="gray.800" fontWeight="semibold">
        {task.name}
      </Text>
      <Text
        fontSize="xs"
        color="gray.500"
        overflow="hidden"
        textOverflow="ellipsis"
        display="-webkit-box"
        style={{
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        {task.description}
      </Text>
    </VStack>
  );
};

const Board: FC<{ isConnected: boolean; tasks: any[] }> = ({
  isConnected,
  tasks,
}) => {
  const inProgressTasks = tasks.filter(
    (task) => task.status?.status === "in progress"
  );
  const reviewTasks = tasks.filter((task) => task.status?.status === "review");
  const doneTasks = tasks.filter((task) => task.status?.status === "done");
  const todoTasks = tasks.filter((task) => task.status?.status === "to do");

  return (
    <Box minH="600px" overflowX="auto">
      <HStack gap={2} align="start" width="full">
        <SwimLane title="To Do">
          {todoTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SwimLane>

        <SwimLane title="In Progress">
          {inProgressTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SwimLane>

        <SwimLane title="Review">
          {reviewTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SwimLane>

        <SwimLane title="Done">
          {doneTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SwimLane>
      </HStack>

      {/* Connection Overlay */}
      {!isConnected ? <SetupConnectionsPrompt /> : null}
    </Box>
  );
};

export function BoardDetail() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [selectedTasks, setSelectedTasks] = useState<any[]>([]);

  const { data: connectionsData, isLoading: isConnectionsLoading } =
    useAuthenticatedTrpcQuery(
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
    setSelectedTasks(tasks);
  };

  const {
    data: boardData,
    isLoading: isBoardLoading,
    error,
  } = useAuthenticatedTrpcQuery(
    trpc.board.getBoard.useQuery,
    boardId ? { boardId } : undefined
  );

  const { board } = boardData ?? {};

  if (isConnectionsLoading || isBoardLoading) {
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

          {/* Import Tasks Button */}
          {isConnected && (
            <HStack justify="flex-end" mb={4}>
              <Button
                onClick={onTaskModalOpen}
                variant="solid"
                color="white"
                bg="black"
                _hover={{ bg: "gray.800" }}
              >
                <Icon as={MdAdd} boxSize={5} size="sm" />
                <Text>Import Tasks from ClickUp</Text>
              </Button>
            </HStack>
          )}
        </HStack>
        {board.projectGoal && (
          <Text color="gray.600" fontSize="sm">
            {board.projectGoal}
          </Text>
        )}
      </VStack>

      {!isConnected ? (
        <Board
          isConnected={isConnected}
          tasks={[
            {
              id: "1",
              name: "Task 1",
              description: "Task 1 description",
              status: {
                status: "to do",
              },
            },
            {
              id: "2",
              name: "Task 2",
              description: "Task 2 description",
              status: {
                status: "in progress",
              },
            },
          ]}
        />
      ) : null}

      {isConnected && selectedTasks.length > 0 ? (
        <Board isConnected={isConnected} tasks={selectedTasks} />
      ) : (
        <Board
          isConnected={isConnected}
          tasks={[
            {
              id: "1",
              name: "Campaign Performance & Optimization (Example Task)",
              description:
                "A/B testing, performance analysis, and campaign optimization",
              status: {
                status: "to do",
              },
            },
            {
              id: "2",
              name: "Social Media & PPC Launch (Example Task)",
              description:
                "Facebook, Instagram, and Google Ads campaigns are live and optimizing",
              status: {
                status: "in progress",
              },
            },
            {
              id: "3",
              name: "Email Marketing Series (Example Task)",
              description:
                "Holiday email sequences and automation workflows being built",
              status: {
                status: "review",
              },
            },
            {
              id: "4",
              name: "Campaign Strategy & Creative (Example Task)",
              description:
                "Campaign concept, messaging, and visual assets approved by ACME team",
              status: {
                status: "done",
              },
            },
          ]}
        />
      )}

      {/* Task Selection Modal */}
      <TaskSelectionModal
        isOpen={isTaskModalOpen}
        onClose={onTaskModalClose}
        onTasksSelected={handleTasksSelected}
      />
    </Box>
  );
}
