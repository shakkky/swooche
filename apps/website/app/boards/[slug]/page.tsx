import {
  Box,
  Button,
  Card,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import "server-only";

// Force dynamic rendering to avoid build-time data fetching
export const dynamic = "force-dynamic";
import { MdCalendarToday, MdPerson, MdPriorityHigh } from "react-icons/md";
import type { ClickupTaskDocument } from "@swooche/models";

interface PublicBoardPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Task {
  _id: string;
  name?: string;
  description?: string;
  status: {
    status: string;
    color: string;
    type: string;
    orderindex: number;
  };
  priority?: {
    priority?: string;
    color?: string;
    orderindex?: string;
    id?: string;
  };
  dueDate?: string;
  assignee?: string;
}

interface PublicBoard {
  _id: string;
  clientName: string;
  projectName: string;
  projectGoal?: string;
  slug: string;
  isPublished: boolean;
  createdAt: string;
  tasks: Task[];
}

// Cache the data fetching function for better performance
const getPublicBoard = cache(
  async (slug: string): Promise<PublicBoard | null> => {
    try {
      // Skip database operations during build time
      if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
        console.log("⚠️ Skipping database fetch during build for slug:", slug);
        return null;
      }

      // Ensure database connection
      const { ensureDatabaseConnection } = await import("../../../lib/db");
      await ensureDatabaseConnection();

      // Import models dynamically to avoid build-time issues
      const { BoardModel, ClientModel, ClickupTaskModel } = await import(
        "@swooche/models"
      );

      // First, get the board
      const board = await BoardModel.findOne({
        slug: slug,
        isPublished: true,
      });

      if (!board) {
        return null;
      }

      // Start parallel requests for client and tasks
      const clientPromise = ClientModel.findOne({
        _id: board.clientId,
      });

      const tasksPromise = ClickupTaskModel.find({
        boardId: board._id,
      });

      // Wait for both requests to complete in parallel
      const [client, tasks] = await Promise.all([clientPromise, tasksPromise]);

      if (!client) {
        return null;
      }

      return {
        _id: board._id.toString(),
        clientName: client.name,
        projectName: board.projectName,
        projectGoal: board.projectGoal,
        slug: board.slug!,
        isPublished: board.isPublished,
        createdAt: board.createdAt.toISOString(),
        tasks: tasks.map((task: ClickupTaskDocument) => ({
          _id: task._id.toString(),
          name: task.name,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          assignee: task.assignee,
        })),
      };
    } catch (error) {
      console.error("Error fetching public board:", error);
      return null;
    }
  }
);

export async function generateMetadata({
  params,
}: PublicBoardPageProps): Promise<Metadata> {
  const { slug } = await params;
  const board = await getPublicBoard(slug);

  if (!board) {
    return {
      title: "Board Not Found - Swooche",
    };
  }

  return {
    title: `${board.projectName} - ${board.clientName} | Swooche`,
    description:
      board.projectGoal ||
      `View the project board for ${board.projectName} by ${board.clientName}`,
    openGraph: {
      title: `${board.projectName} - ${board.clientName}`,
      description:
        board.projectGoal || `View the project board for ${board.projectName}`,
      type: "website",
    },
  };
}

function getPriorityColor(priority?: { priority?: string; color?: string }) {
  if (!priority || !priority.priority) return "gray";

  switch (priority.priority.toLowerCase()) {
    case "urgent":
      return "red";
    case "high":
      return "orange";
    case "normal":
      return "blue";
    case "low":
      return "green";
    default:
      return "gray";
  }
}

function getStatusColor(status: { status: string; color: string }) {
  switch (status.status.toLowerCase()) {
    case "completed":
    case "done":
      return "green";
    case "in progress":
    case "in development":
      return "blue";
    case "pending":
    case "to do":
      return "gray";
    case "blocked":
      return "red";
    default:
      return "gray";
  }
}

function toSentenceCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function getStatusLanes(tasks: Task[]) {
  // Group tasks by status
  const statusGroups = tasks.reduce((acc, task) => {
    const status = task.status.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Define the order of status lanes (you can customize this)
  const statusOrder = [
    "to do",
    "in progress",
    "in development",
    "review",
    "testing",
    "done",
    "completed",
    "blocked",
  ];

  // Create lanes in the defined order, plus any additional statuses
  const orderedLanes = statusOrder
    .filter((status) => statusGroups[status])
    .map((status) => ({
      status: toSentenceCase(status),
      tasks: statusGroups[status],
    }));

  // Add any remaining statuses that weren't in the predefined order
  const remainingStatuses = Object.keys(statusGroups).filter(
    (status) => !statusOrder.includes(status)
  );

  const additionalLanes = remainingStatuses.map((status) => ({
    status: toSentenceCase(status),
    tasks: statusGroups[status],
  }));

  return [...orderedLanes, ...additionalLanes];
}

export default async function PublicBoardPage({
  params,
}: PublicBoardPageProps) {
  const { slug } = await params;
  const board = await getPublicBoard(slug);

  if (!board) {
    notFound();
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <VStack gap={4} align="stretch">
          <VStack gap={2} align="start">
            <Text color="gray.600" fontSize="sm">
              {board.clientName}
            </Text>
            <Heading size="4xl" fontWeight="black">
              {board.projectName}
            </Heading>
            {board.projectGoal && (
              <Text color="gray.700" fontSize="lg">
                {board.projectGoal}
              </Text>
            )}
          </VStack>
        </VStack>

        {/* Tasks */}
        <VStack gap={6} align="stretch">
          <Heading size="lg">Tasks ({board.tasks.length})</Heading>

          {board.tasks.length === 0 ? (
            <Card.Root>
              <Card.Body>
                <Text color="gray.500" textAlign="center" py={8}>
                  No tasks available for this board.
                </Text>
              </Card.Body>
            </Card.Root>
          ) : (
            <Box>
              {/* Kanban Board with Vertical Lanes */}
              <HStack gap={2} align="start" overflowX="auto" pb={4}>
                {getStatusLanes(board.tasks).map((lane) => (
                  <VStack
                    key={lane.status}
                    gap={3}
                    align="stretch"
                    minW="280px"
                    flex="1"
                    bg="gray.100"
                    borderRadius="md"
                  >
                    {/* Lane Header */}
                    <VStack gap={1} align="start" p={4} pb={4}>
                      <HStack gap={2} align="center">
                        <Box
                          w={3}
                          h={3}
                          borderRadius="full"
                          bg={`${getStatusColor({
                            status: lane.status,
                            color: "",
                          })}.500`}
                        />
                        <Text
                          fontWeight="semibold"
                          fontSize="sm"
                          color="gray.700"
                        >
                          {lane.status}
                        </Text>
                      </HStack>
                      <Text fontSize="xs" color="gray.500">
                        {lane.tasks.length} task
                        {lane.tasks.length !== 1 ? "s" : ""}
                      </Text>
                    </VStack>

                    {/* Lane Tasks */}
                    <VStack gap={2} px={2} pb={8}>
                      {lane.tasks.map((task) => (
                        <Card.Root
                          key={task._id}
                          cursor="default"
                          width="full"
                          border="none"
                        >
                          <Card.Body p={4}>
                            <VStack gap={3} align="stretch">
                              {/* Task Header */}
                              <VStack gap={1} align="start">
                                <Text
                                  fontSize="sm"
                                  color="gray.800"
                                  fontWeight="semibold"
                                >
                                  {task.name || "Untitled Task"}
                                </Text>
                                {task.description && (
                                  <Text
                                    color="gray.600"
                                    fontSize="sm"
                                    lineHeight="1.4"
                                  >
                                    {task.description}
                                  </Text>
                                )}
                              </VStack>

                              {/* Task Meta */}
                              <VStack gap={2} align="stretch">
                                {task.priority && (
                                  <Box
                                    px={2}
                                    py={1}
                                    bg={`${getPriorityColor(
                                      task.priority
                                    )}.100`}
                                    color={`${getPriorityColor(
                                      task.priority
                                    )}.700`}
                                    borderRadius="md"
                                    fontSize="xs"
                                    fontWeight="medium"
                                    alignSelf="start"
                                  >
                                    <HStack gap={1}>
                                      <MdPriorityHigh size={10} />
                                      {task.priority.priority || "Normal"}
                                    </HStack>
                                  </Box>
                                )}

                                <VStack
                                  gap={1}
                                  align="stretch"
                                  fontSize="xs"
                                  color="gray.500"
                                >
                                  {task.dueDate && (
                                    <HStack gap={1}>
                                      <MdCalendarToday size={10} />
                                      <Text>
                                        Due:{" "}
                                        {new Date(
                                          task.dueDate
                                        ).toLocaleDateString()}
                                      </Text>
                                    </HStack>
                                  )}

                                  {task.assignee && (
                                    <HStack gap={1}>
                                      <MdPerson size={10} />
                                      <Text>{task.assignee}</Text>
                                    </HStack>
                                  )}
                                </VStack>
                              </VStack>
                            </VStack>
                          </Card.Body>
                        </Card.Root>
                      ))}
                    </VStack>
                  </VStack>
                ))}
              </HStack>
            </Box>
          )}
        </VStack>

        {/* Footer */}
        <Box
          textAlign="center"
          py={8}
          borderTop="1px solid"
          borderColor="gray.200"
        >
          <VStack gap={2}>
            <Text color="gray.600" fontSize="sm">
              This board was created with Swooche
            </Text>
            <Link
              href="https://app.swooche.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="solid" bg="black" color="white">
                Create Your Own Board
              </Button>
            </Link>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
