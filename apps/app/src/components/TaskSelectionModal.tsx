import { trpc } from "@/lib/trpc";
import {
  Badge,
  Box,
  Button,
  Dialog,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import clickupLogo from "../assets/logos/clickup.png";
import { useAuthenticatedTrpcQuery } from "../hooks/useAuthenticatedQuery";

interface TaskSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTasksSelected: (tasks: any[]) => void;
}

type SelectionStep = "workspace" | "space" | "list" | "tasks";

interface SelectionState {
  step: SelectionStep;
  selectedWorkspace: { id: string; name: string } | null;
  selectedSpace: { id: string; name: string } | null;
  selectedList: { id: string; name: string } | null;
}

export const TaskSelectionModal = ({
  isOpen,
  onClose,
  onTasksSelected,
}: TaskSelectionModalProps) => {
  const [selectionState, setSelectionState] = useState<SelectionState>({
    step: "workspace",
    selectedWorkspace: null,
    selectedSpace: null,
    selectedList: null,
  });

  // Fetch workspaces
  const {
    data: workspacesData,
    isLoading: workspacesLoading,
    error: workspacesError,
  } = useAuthenticatedTrpcQuery(
    trpc.connection.getClickUpWorkspaces.useQuery,
    undefined,
    { enabled: isOpen && selectionState.step === "workspace" }
  );

  // Fetch spaces
  const {
    data: spacesData,
    isLoading: spacesLoading,
    error: spacesError,
  } = useAuthenticatedTrpcQuery(
    trpc.connection.getClickUpSpaces.useQuery,
    selectionState.selectedWorkspace
      ? { workspaceId: selectionState.selectedWorkspace.id }
      : undefined,
    {
      enabled:
        isOpen &&
        selectionState.step === "space" &&
        !!selectionState.selectedWorkspace,
    }
  );

  // Fetch folderless lists
  const {
    data: listsData,
    isLoading: listsLoading,
    error: listsError,
  } = useAuthenticatedTrpcQuery(
    trpc.connection.getClickUpFolderlessLists.useQuery,
    selectionState.selectedSpace
      ? { spaceId: selectionState.selectedSpace.id }
      : undefined,
    {
      enabled:
        isOpen &&
        selectionState.step === "list" &&
        !!selectionState.selectedSpace,
    }
  );

  // Fetch tasks
  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
  } = useAuthenticatedTrpcQuery(
    trpc.connection.getClickUpTasks.useQuery,
    selectionState.selectedList
      ? { listId: selectionState.selectedList.id }
      : undefined,
    {
      enabled:
        isOpen &&
        selectionState.step === "tasks" &&
        !!selectionState.selectedList,
    }
  );

  const handleWorkspaceSelect = (workspace: { id: string; name: string }) => {
    setSelectionState((prev) => ({
      ...prev,
      selectedWorkspace: workspace,
      step: "space",
    }));
  };

  const handleSpaceSelect = (space: { id: string; name: string }) => {
    setSelectionState((prev) => ({
      ...prev,
      selectedSpace: space,
      step: "list",
    }));
  };

  const handleListSelect = (list: { id: string; name: string }) => {
    setSelectionState((prev) => ({
      ...prev,
      selectedList: list,
      step: "tasks",
    }));
  };

  const handleTasksConfirm = () => {
    if (tasksData?.tasks) {
      onTasksSelected(tasksData.tasks);
      onClose();
    }
  };

  const handleBack = () => {
    setSelectionState((prev) => {
      switch (prev.step) {
        case "space":
          return { ...prev, step: "workspace", selectedWorkspace: null };
        case "list":
          return { ...prev, step: "space", selectedSpace: null };
        case "tasks":
          return { ...prev, step: "list", selectedList: null };
        default:
          return prev;
      }
    });
  };

  const handleClose = () => {
    setSelectionState({
      step: "workspace",
      selectedWorkspace: null,
      selectedSpace: null,
      selectedList: null,
    });
    onClose();
  };

  const renderStepContent = () => {
    switch (selectionState.step) {
      case "workspace":
        if (workspacesLoading) {
          return (
            <VStack gap={4} py={8}>
              <Spinner size="lg" />
              <Text color="gray.500">Loading workspaces...</Text>
            </VStack>
          );
        }

        if (workspacesError || !workspacesData?.workspaces) {
          return (
            <VStack gap={4} py={8}>
              <Text color="red.500">Failed to load workspaces</Text>
              <Button onClick={handleClose} variant="outline">
                Close
              </Button>
            </VStack>
          );
        }

        const workspaces = workspacesData.workspaces;

        // Auto-select if only one workspace
        if (workspaces.length === 1) {
          setTimeout(() => handleWorkspaceSelect(workspaces[0]), 100);
          return (
            <VStack gap={4} py={8}>
              <Spinner size="lg" />
              <Text color="gray.500">Auto-selecting workspace...</Text>
            </VStack>
          );
        }

        return (
          <VStack gap={4} align="stretch">
            <Text color="gray.600" fontSize="sm">
              Select a workspace to continue:
            </Text>
            {workspaces.map((workspace) => (
              <Button
                key={workspace.id}
                variant="outline"
                justifyContent="flex-start"
                h="auto"
                p={4}
                onClick={() => handleWorkspaceSelect(workspace)}
              >
                <HStack gap={3} w="full">
                  {workspace.color && (
                    <Box w={4} h={4} borderRadius="full" bg={workspace.color} />
                  )}
                  <VStack align="start" gap={1} flex={1}>
                    <Text fontWeight="semibold">{workspace.name}</Text>
                  </VStack>
                </HStack>
              </Button>
            ))}
          </VStack>
        );

      case "space":
        if (spacesLoading) {
          return (
            <VStack gap={4} py={8}>
              <Spinner size="lg" />
              <Text color="gray.500">Loading spaces...</Text>
            </VStack>
          );
        }

        if (spacesError || !spacesData?.spaces) {
          return (
            <VStack gap={4} py={8}>
              <Text color="red.500">Failed to load spaces</Text>
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
            </VStack>
          );
        }

        const spaces = spacesData.spaces;

        // Auto-select if only one space
        if (spaces.length === 1) {
          setTimeout(() => handleSpaceSelect(spaces[0]), 100);
          return (
            <VStack gap={4} py={8}>
              <Spinner size="lg" />
              <Text color="gray.500">Auto-selecting space...</Text>
            </VStack>
          );
        }

        return (
          <VStack gap={4} align="stretch">
            <Text color="gray.600" fontSize="sm">
              Select a space from{" "}
              <strong>{selectionState.selectedWorkspace?.name}</strong>:
            </Text>
            {spaces.map((space) => (
              <Button
                key={space.id}
                variant="outline"
                justifyContent="flex-start"
                h="auto"
                p={4}
                onClick={() => handleSpaceSelect(space)}
              >
                <HStack gap={3} w="full">
                  {space.color && (
                    <Box w={4} h={4} borderRadius="full" bg={space.color} />
                  )}
                  <VStack align="start" gap={1} flex={1}>
                    <Text fontWeight="semibold">{space.name}</Text>
                  </VStack>
                </HStack>
              </Button>
            ))}
          </VStack>
        );

      case "list":
        if (listsLoading) {
          return (
            <VStack gap={4} py={8}>
              <Spinner size="lg" />
              <Text color="gray.500">Loading lists...</Text>
            </VStack>
          );
        }

        if (listsError || !listsData?.lists) {
          return (
            <VStack gap={4} py={8}>
              <Text color="red.500">Failed to load lists</Text>
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
            </VStack>
          );
        }

        const lists = listsData.lists;

        // Auto-select if only one list
        if (lists.length === 1) {
          setTimeout(() => handleListSelect(lists[0]), 100);
          return (
            <VStack gap={4} py={8}>
              <Spinner size="lg" />
              <Text color="gray.500">Auto-selecting list...</Text>
            </VStack>
          );
        }

        return (
          <VStack gap={4} align="stretch">
            <Text color="gray.600" fontSize="sm">
              Select a list from{" "}
              <strong>{selectionState.selectedSpace?.name}</strong>:
            </Text>
            {lists.map((list) => (
              <Button
                key={list.id}
                variant="outline"
                justifyContent="flex-start"
                h="auto"
                p={4}
                onClick={() => handleListSelect(list)}
              >
                <HStack gap={3} w="full">
                  {list.color && (
                    <Box w={4} h={4} borderRadius="full" bg={list.color} />
                  )}
                  <VStack align="start" gap={1} flex={1}>
                    <Text fontWeight="semibold">{list.name}</Text>
                  </VStack>
                </HStack>
              </Button>
            ))}
          </VStack>
        );

      case "tasks":
        if (tasksLoading) {
          return (
            <VStack gap={4} py={8}>
              <Spinner size="lg" />
              <Text color="gray.500">Loading tasks...</Text>
            </VStack>
          );
        }

        if (tasksError || !tasksData?.tasks) {
          return (
            <VStack gap={4} py={8}>
              <Text color="red.500">Failed to load tasks</Text>
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
            </VStack>
          );
        }

        const tasks = tasksData.tasks;

        return (
          <VStack gap={4} align="stretch">
            <Text color="gray.600" fontSize="sm">
              Found <strong>{tasks.length}</strong> tasks in{" "}
              <strong>{selectionState.selectedList?.name}</strong>:
            </Text>
            <Box
              maxH="400px"
              overflowY="auto"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
            >
              {tasks.map((task) => (
                <Box
                  key={task.id}
                  p={4}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                  _last={{ borderBottom: "none" }}
                >
                  <VStack align="start" gap={2}>
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="semibold" fontSize="sm">
                        {task.name}
                      </Text>
                      <Badge
                        colorScheme={
                          task.status?.color === "#f50000" ||
                          task.status?.color === "red"
                            ? "red"
                            : task.status?.color === "#ffcc00" ||
                              task.status?.color === "yellow"
                            ? "yellow"
                            : "blue"
                        }
                        size="sm"
                      >
                        {task.status?.status}
                      </Badge>
                    </HStack>
                    {task.description && (
                      <Text color="gray.600" fontSize="xs">
                        {task.description}
                      </Text>
                    )}
                    <HStack gap={2} flexWrap="wrap">
                      {task.tags &&
                        task.tags.length > 0 &&
                        task.tags.map((tag: any, index: number) => (
                          <Badge key={index} size="sm" variant="subtle">
                            {typeof tag === "string"
                              ? tag
                              : tag.name || tag.tag_fg || "tag"}
                          </Badge>
                        ))}
                      {task.priority && (
                        <Badge
                          size="sm"
                          colorScheme={
                            task.priority?.color === "#f50000" ||
                            task.priority?.color === "red"
                              ? "red"
                              : task.priority?.color === "#ffcc00" ||
                                task.priority?.color === "yellow"
                              ? "yellow"
                              : "blue"
                          }
                        >
                          {task.priority?.priority}
                        </Badge>
                      )}
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </Box>
            <HStack justify="space-between">
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
              <Button onClick={handleTasksConfirm} colorScheme="blue">
                Import {tasks.length} Tasks
              </Button>
            </HStack>
          </VStack>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (selectionState.step) {
      case "workspace":
        return "Select Workspace";
      case "space":
        return "Select Space";
      case "list":
        return "Select List";
      case "tasks":
        return "Review Tasks";
      default:
        return "Import Tasks";
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="2xl" maxH="90vh">
          <Dialog.Header>
            <HStack gap={3}>
              <Image src={clickupLogo} alt="ClickUp" w={6} h={6} />
              <Dialog.Title>{getStepTitle()}</Dialog.Title>
            </HStack>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body pb={6}>{renderStepContent()}</Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
