import { trpc } from "@/lib/trpc";
import {
  Badge,
  Box,
  Button,
  Center,
  Dialog,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Skeleton,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FC } from "react";
import { MdAdd, MdDelete, MdEdit, MdContentCopy } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import clickupLogo from "../assets/logos/clickup.png";
import swoocheLogo from "../assets/logos/swooche.png";
import { TaskSelectionModal } from "../components/TaskSelectionModal";
import { PublishBoardModal } from "../components/PublishBoardModal";
import { toaster } from "../components/ui/toaster";
import { getBaseUrl, getBaseWebsiteUrl, getClickUpClientId } from "../config";
import { useAuthenticatedTrpcQuery } from "../hooks/useAuthenticatedQuery";

const DeleteBoardModal = ({
  isOpen,
  onClose,
  onConfirm,
  boardName,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  boardName: string;
  isLoading: boolean;
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="md">
          <Dialog.Header>
            <Dialog.Title>Delete Board</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body pb={6}>
            <VStack gap={4} align="stretch">
              <Text color="gray.600">
                Are you sure you want to delete the board "{boardName}"? This
                action cannot be undone.
              </Text>
              <HStack justify="space-between">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={onConfirm}
                  loading={isLoading}
                  loadingText="Deleting..."
                >
                  Delete Board
                </Button>
              </HStack>
            </VStack>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

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
        <VStack gap={2}>{children}</VStack>
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

const SkeletonTaskCard: FC = () => {
  return (
    <VStack
      gap={2}
      alignItems="start"
      p={4}
      bg="white"
      borderRadius="md"
      w="full"
    >
      <Skeleton height="16px" width="80%" />
      <VStack gap={1} align="start" w="full">
        <Skeleton height="12px" width="100%" />
        <Skeleton height="12px" width="90%" />
        <Skeleton height="12px" width="75%" />
      </VStack>
    </VStack>
  );
};

const HideBoardModal = ({
  isOpen,
  onClose,
  onConfirm,
  boardName,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  boardName: string;
  isLoading: boolean;
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="md">
          <Dialog.Header>
            <Dialog.Title>Hide Board</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body pb={6}>
            <VStack gap={4} align="stretch">
              <Text color="gray.600">
                Are you sure you want to hide the board "{boardName}"? This will
                make it private and no longer accessible to the public.
              </Text>
              <Box
                p={4}
                bg="orange.50"
                borderRadius="md"
                border="1px solid"
                borderColor="orange.200"
              >
                <Text fontSize="sm" color="orange.700" fontWeight="medium">
                  ⚠️ Warning: Anyone with the public link will no longer be able
                  to access this board.
                </Text>
              </Box>
              <HStack justify="space-between">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="orange"
                  onClick={onConfirm}
                  loading={isLoading}
                  loadingText="Hiding..."
                >
                  Hide Board
                </Button>
              </HStack>
            </VStack>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

const Board: FC<{
  isConnected: boolean;
  tasks: any[];
  isLoading?: boolean;
}> = ({ isConnected, tasks, isLoading = false }) => {
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
          {isLoading ? (
            <>
              <SkeletonTaskCard />
              <SkeletonTaskCard />
            </>
          ) : (
            todoTasks.map((task) => (
              <TaskCard key={task._id || task.clickupTaskId} task={task} />
            ))
          )}
        </SwimLane>

        <SwimLane title="In Progress">
          {isLoading ? (
            <>
              <SkeletonTaskCard />
            </>
          ) : (
            inProgressTasks.map((task) => (
              <TaskCard key={task._id || task.clickupTaskId} task={task} />
            ))
          )}
        </SwimLane>

        <SwimLane title="Review">
          {isLoading ? (
            <>
              <SkeletonTaskCard />
              <SkeletonTaskCard />
            </>
          ) : (
            reviewTasks.map((task) => (
              <TaskCard key={task._id || task.clickupTaskId} task={task} />
            ))
          )}
        </SwimLane>

        <SwimLane title="Done">
          {isLoading ? (
            <>
              <SkeletonTaskCard />
            </>
          ) : (
            doneTasks.map((task) => (
              <TaskCard key={task._id || task.clickupTaskId} task={task} />
            ))
          )}
        </SwimLane>
      </HStack>

      {/* Connection Overlay */}
      {!isConnected ? <SetupConnectionsPrompt /> : null}
    </Box>
  );
};

const exampleTasks = [
  {
    id: "1",
    name: "Campaign Performance & Optimization (Example Task)",
    description: "A/B testing, performance analysis, and campaign optimization",
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
    description: "Holiday email sequences and automation workflows being built",
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
];

const TogglePublicBoard: FC<{
  isPublished: boolean;
  slug: string;
  handleCopyUrl: () => void;
  onHideModalOpen: () => void;
  onPublishModalOpen: () => void;
}> = ({
  isPublished,
  slug,
  handleCopyUrl,
  onHideModalOpen,
  onPublishModalOpen,
}) => {
  return isPublished ? (
    <HStack gap={0} align="center">
      <HStack gap={1} align="center">
        <Text
          fontSize="xs"
          color="green.600"
          fontFamily="mono"
          cursor="pointer"
          onClick={handleCopyUrl}
          _hover={{ textDecoration: "underline" }}
        >
          {getBaseWebsiteUrl()}/boards/{slug}{" "}
          <Icon as={MdContentCopy} boxSize={3} onClick={handleCopyUrl} />
        </Text>
      </HStack>
      <Button size="xs" variant="plain" onClick={onHideModalOpen} fontSize="xs">
        Hide board
      </Button>
    </HStack>
  ) : (
    <HStack gap={0} align="center">
      <Badge colorScheme="gray" variant="subtle">
        Board not publicly available
      </Badge>
      <Button
        size="xs"
        variant="plain"
        onClick={onPublishModalOpen}
        textDecoration="underline"
      >
        Make available
      </Button>
    </HStack>
  );
};

export function BoardDetail() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();

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

  const {
    open: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const {
    open: isPublishModalOpen,
    onOpen: onPublishModalOpen,
    onClose: onPublishModalClose,
  } = useDisclosure();

  const {
    open: isHideModalOpen,
    onOpen: onHideModalOpen,
    onClose: onHideModalClose,
  } = useDisclosure();

  const utils = trpc.useUtils();

  const linkTasksMutation = trpc.tasks.linkTasks.useMutation({
    onSuccess: (data: any) => {
      console.log("Tasks linked successfully:", data);
      // Invalidate and refetch the board tasks query to get updated data from backend
      utils.tasks.getBoardTasks.invalidate({ boardId });
      onTaskModalClose();

      // Show the publish modal after successful task linking only if board isn't already published
      if (!board?.isPublished) {
        onPublishModalOpen();
      }
    },
    onError: (error) => {
      console.error("Error linking tasks:", error);
      toaster.create({
        title: "Failed to Link Tasks",
        description: error.message || "Something went wrong. Please try again.",
        type: "error",
      });
    },
  });

  const deleteBoardMutation = trpc.board.deleteBoard.useMutation({
    onSuccess: (data: any) => {
      console.log("Board deleted successfully:", data);
      toaster.create({
        title: "Board deleted successfully",
        description: `Board and ${data.deletedTasksCount} associated tasks have been deleted.`,
        type: "success",
      });
      onDeleteModalClose();
      navigate("/app");
    },
    onError: (error) => {
      console.error("Error deleting board:", error);
      toaster.create({
        title: "Failed to delete board",
        description:
          error.message || "An error occurred while deleting the board.",
        type: "error",
      });
    },
  });

  const hideBoardMutation = trpc.board.toggleBoardPublish.useMutation({
    onSuccess: (data: any) => {
      console.log("Board hidden:", data);
      toaster.create({
        title: "Board Hidden",
        description:
          "Your board is now private and no longer accessible to the public.",
        type: "success",
      });
      // Invalidate and refetch the board query to get updated data
      utils.board.getBoard.invalidate({ boardId });
      onHideModalClose();
    },
    onError: (error) => {
      console.error("Error hiding board:", error);
      toaster.create({
        title: "Failed to hide board",
        description:
          error.message || "An error occurred while hiding the board.",
        type: "error",
      });
    },
  });

  const handleTasksSelected = (tasks: any[]) => {
    if (!boardId) {
      console.error("No board ID available");
      return;
    }

    linkTasksMutation.mutate({
      boardId,
      tasks,
    });
  };

  const handleDeleteBoard = () => {
    if (!boardId) {
      console.error("No board ID available");
      return;
    }

    deleteBoardMutation.mutate({ boardId });
  };

  const handleHideBoard = () => {
    if (!boardId) {
      console.error("No board ID available");
      return;
    }

    hideBoardMutation.mutate({ boardId });
  };

  const handleCopyUrl = async () => {
    if (!board?.slug) return;

    const url = `${getBaseWebsiteUrl()}/boards/${board.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toaster.create({
        title: "Link copied!",
        description: "The public board URL has been copied to your clipboard.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toaster.create({
        title: "Failed to copy",
        description: "Could not copy the URL to clipboard.",
        type: "error",
      });
    }
  };

  const {
    data: boardData,
    isLoading: isBoardLoading,
    error,
  } = useAuthenticatedTrpcQuery(
    trpc.board.getBoard.useQuery,
    boardId ? { boardId } : undefined
  );

  const { data: boardTasksData, isLoading: isBoardTasksLoading } =
    useAuthenticatedTrpcQuery(
      trpc.tasks.getBoardTasks.useQuery,
      boardId ? { boardId } : undefined
    );

  const { board } = boardData ?? {};
  const { tasks: boardTasks } = boardTasksData ?? {};

  if (isConnectionsLoading || isBoardLoading || isBoardTasksLoading) {
    return (
      <Box w="full" h="full" position="relative">
        {/* Header Skeleton */}
        <VStack align="start" mb={6} gap={2}>
          <HStack justify="space-between" w="full" align="center">
            <VStack align="start" gap={1}>
              <Skeleton height="16px" width="120px" />
              <Skeleton height="32px" width="200px" />
            </VStack>
            <Skeleton height="24px" width="60px" borderRadius="full" />
          </HStack>
          <Skeleton height="16px" width="300px" />
        </VStack>

        {/* Board Skeleton */}
        <Board isConnected tasks={[]} isLoading={true} />
      </Box>
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
      <VStack align="start" mb={6} gap={4}>
        <HStack justify="space-between" w="full" align="start">
          <VStack align="start" gap={1}>
            <Text fontSize="sm" color="gray.500">
              {board.clientName}
            </Text>
            <Heading size="xl" color="gray.800">
              {board.projectName}
            </Heading>
            {board.projectGoal && (
              <Text color="gray.600" fontSize="sm">
                {board.projectGoal}
              </Text>
            )}

            {/* Public Status Display */}
            <TogglePublicBoard
              isPublished={board.isPublished}
              slug={board.slug}
              handleCopyUrl={handleCopyUrl}
              onHideModalOpen={onHideModalOpen}
              onPublishModalOpen={onPublishModalOpen}
            />
          </VStack>

          {/* Action Buttons */}
          <VStack justify="flex-end" gap={2}>
            <HStack justify="flex-end" gap={2}>
              {isConnected && (
                <Button
                  onClick={onTaskModalOpen}
                  variant="solid"
                  color="white"
                  bg="black"
                  _hover={{ bg: "gray.800" }}
                  loading={linkTasksMutation.isPending}
                  loadingText="Importing..."
                >
                  <Icon as={MdAdd} boxSize={5} size="sm" />
                  <Text>Import Tasks from ClickUp</Text>
                </Button>
              )}
              <IconButton
                onClick={() => navigate(`/app/boards/${boardId}/edit`)}
                variant="outline"
                colorScheme="blue"
                aria-label="Edit board"
                _hover={{ bg: "blue.50", borderColor: "blue.300" }}
              >
                <Icon as={MdEdit} boxSize={5} />
              </IconButton>
              <IconButton
                onClick={onDeleteModalOpen}
                variant="outline"
                colorScheme="red"
                aria-label="Delete board"
                _hover={{ bg: "red.50", borderColor: "red.300" }}
              >
                <Icon as={MdDelete} boxSize={5} />
              </IconButton>
            </HStack>
          </VStack>
        </HStack>
      </VStack>

      <Board
        isConnected={isConnected}
        tasks={
          !isConnected || boardTasks.length < 1 ? exampleTasks : boardTasks
        }
      />

      <TaskSelectionModal
        isOpen={isTaskModalOpen}
        onClose={onTaskModalClose}
        onTasksSelected={handleTasksSelected}
        existingTasks={boardTasks || []}
      />

      <DeleteBoardModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={handleDeleteBoard}
        boardName={board?.projectName || ""}
        isLoading={deleteBoardMutation.isPending}
      />

      <PublishBoardModal
        isOpen={isPublishModalOpen}
        onClose={onPublishModalClose}
        boardId={boardId || ""}
        boardName={board?.projectName || ""}
        publicUrl={
          board.slug ? `${getBaseWebsiteUrl()}/boards/${board.slug}` : undefined
        }
        onPublishSuccess={() => {
          // Refetch board data after successful publish
          utils.board.getBoard.invalidate({ boardId });
        }}
      />

      <HideBoardModal
        isOpen={isHideModalOpen}
        onClose={onHideModalClose}
        onConfirm={handleHideBoard}
        boardName={board?.projectName || ""}
        isLoading={hideBoardMutation.isPending}
      />
    </Box>
  );
}
