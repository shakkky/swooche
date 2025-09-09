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
  Heading,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import clickupLogo from "../assets/logos/clickup.png";
import { useAuthenticatedTrpcQuery } from "../hooks/useAuthenticatedQuery";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTasksSelected: (tasks: any[]) => void;
}

interface TaskItemProps {
  task: any;
  isSelected?: boolean;
}

const TaskItem = ({ task, isSelected = false }: TaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task", task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      p={3}
      bg={isSelected ? "blue.50" : "white"}
      border="1px solid"
      borderColor={isSelected ? "blue.300" : "gray.300"}
      borderRadius="md"
      cursor="grab"
      _hover={{
        bg: isSelected ? "blue.100" : "gray.50",
        borderColor: isSelected ? "blue.400" : "gray.400",
        transform: "translateY(-1px)",
        boxShadow: "md",
      }}
      _active={{
        cursor: "grabbing",
        transform: "scale(1.02)",
        boxShadow: "lg",
      }}
      transition="all 0.2s"
      position="relative"
      // Don't interfere with drop zone detection
      pointerEvents="auto"
      // Add a data attribute to identify this as a task
      data-task-id={task.id}
    >
      <VStack align="start" gap={1}>
        <HStack justify="space-between" w="full">
          <Text fontWeight="semibold" fontSize="xs">
            {task.name}
          </Text>
          <Badge
            colorScheme={
              task.status?.color === "#f50000" || task.status?.color === "red"
                ? "red"
                : task.status?.color === "#ffcc00" ||
                  task.status?.color === "yellow"
                ? "yellow"
                : "blue"
            }
            size="xs"
          >
            {task.status?.status}
          </Badge>
        </HStack>
        {task.description && (
          <Text color="gray.600" fontSize="xs">
            {task.description}
          </Text>
        )}
        <HStack gap={1} flexWrap="wrap">
          {task.tags &&
            task.tags.length > 0 &&
            task.tags.slice(0, 2).map((tag: any, index: number) => (
              <Badge key={index} size="xs" variant="subtle">
                {typeof tag === "string"
                  ? tag
                  : tag.name || tag.tag_fg || "tag"}
              </Badge>
            ))}
          {task.priority && (
            <Badge
              size="xs"
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
  );
};

type SelectionStep = "workspace" | "space" | "list" | "tasks";

interface SelectionState {
  step: SelectionStep;
  selectedWorkspace: { id: string; name: string } | null;
  selectedSpace: { id: string; name: string } | null;
  selectedList: { id: string; name: string } | null;
}

const DroppableArea = ({
  id,
  children,
  bg,
  borderColor,
}: {
  id: string;
  children: React.ReactNode;
  bg: string;
  borderColor: string;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: "task-drop-zone" },
  });

  return (
    <Box
      ref={setNodeRef}
      bg={isOver ? `${bg}.100` : bg}
      borderColor={isOver ? `${borderColor}.400` : `${borderColor}`}
      borderWidth="1px"
      borderStyle={isOver ? "dashed" : "solid"}
      borderRadius="md"
      p={4}
      minH="200px"
      flex={1}
      overflowY="auto"
      transition="all 0.2s"
      position="relative"
      _hover={{
        borderColor: `${borderColor}.300`,
        bg: `${bg}.75`,
      }}
      // Make the drop zone capture all pointer events
      pointerEvents="auto"
      // Ensure this element is always the drop target
      data-drop-zone={id}
    >
      {children}
      {isOver && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg="white"
          p={3}
          borderRadius="md"
          boxShadow="lg"
          border="2px dashed"
          borderColor="blue.400"
          pointerEvents="none"
          zIndex={10}
        >
          <Text fontSize="sm" color="blue.600" fontWeight="semibold">
            Drop here
          </Text>
        </Box>
      )}
    </Box>
  );
};

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

  const [availableTasks, setAvailableTasks] = useState<any[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<any[]>([]);
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [tasksInitialized, setTasksInitialized] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectionState({
        step: "workspace",
        selectedWorkspace: null,
        selectedSpace: null,
        selectedList: null,
      });
      setAvailableTasks([]);
      setSelectedTasks([]);
      setActiveTask(null);
      setTasksInitialized(false);
    }
  }, [isOpen]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

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
    if (selectedTasks.length > 0) {
      onTasksSelected(selectedTasks);
      onClose();
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = [...availableTasks, ...selectedTasks].find(
      (t) => t.id === active.id
    );
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      console.log("No drop target found");
      return;
    }

    const task = [...availableTasks, ...selectedTasks].find(
      (t) => t.id === active.id
    );
    if (!task) {
      console.log("Task not found:", active.id);
      return;
    }

    console.log("Drag end:", { taskId: task.id, overId: over.id });

    // Determine which array the task is currently in
    const isCurrentlyInAvailable = availableTasks.some((t) => t.id === task.id);
    const isCurrentlyInSelected = selectedTasks.some((t) => t.id === task.id);

    console.log("Current state:", {
      isCurrentlyInAvailable,
      isCurrentlyInSelected,
    });

    // Determine the target drop zone
    let targetDropZone = over.id;

    // If we dropped on a task, find which drop zone it belongs to
    if (over.data?.current?.type === "task") {
      const droppedOnTask = over.data.current.task;
      const isDroppedTaskInAvailable = availableTasks.some(
        (t) => t.id === droppedOnTask.id
      );
      const isDroppedTaskInSelected = selectedTasks.some(
        (t) => t.id === droppedOnTask.id
      );

      if (isDroppedTaskInAvailable) {
        targetDropZone = "available-tasks";
      } else if (isDroppedTaskInSelected) {
        targetDropZone = "selected-tasks";
      }

      console.log("Dropped on task, determined target zone:", targetDropZone);
    }

    if (targetDropZone === "available-tasks" && isCurrentlyInSelected) {
      // Moving from selected to available
      console.log("Moving from selected to available");
      setSelectedTasks((prev) => prev.filter((t) => t.id !== task.id));
      setAvailableTasks((prev) => [...prev, task]);
    } else if (targetDropZone === "selected-tasks" && isCurrentlyInAvailable) {
      // Moving from available to selected
      console.log("Moving from available to selected");
      setAvailableTasks((prev) => prev.filter((t) => t.id !== task.id));
      setSelectedTasks((prev) => [...prev, task]);
    } else {
      console.log("No valid move detected", {
        targetDropZone,
        isCurrentlyInAvailable,
        isCurrentlyInSelected,
      });
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
          // Reset tasks when going back from tasks step
          setAvailableTasks([]);
          setSelectedTasks([]);
          setTasksInitialized(false);
          return { ...prev, step: "list", selectedList: null };
        default:
          return prev;
      }
    });
  };

  const getBackButtonProps = () => {
    // If we're on the tasks step, check if there were multiple options at each step
    if (selectionState.step === "tasks") {
      const hadMultipleWorkspaces =
        workspacesData?.teams && workspacesData.teams.length > 1;
      const hadMultipleSpaces =
        spacesData?.spaces && spacesData.spaces.length > 1;
      const hadMultipleLists = listsData?.lists && listsData.lists.length > 1;

      // If there were multiple options at any step, show "Back"
      if (hadMultipleWorkspaces || hadMultipleSpaces || hadMultipleLists) {
        return {
          onClick: handleBack,
          children: "Back",
        };
      } else {
        // If all steps had only one option, show "Cancel"
        return {
          onClick: handleClose,
          children: "Cancel",
        };
      }
    }

    // For other steps, always show "Back"
    return {
      onClick: handleBack,
      children: "Back",
    };
  };

  const handleClose = () => {
    // Full reset of all state
    setSelectionState({
      step: "workspace",
      selectedWorkspace: null,
      selectedSpace: null,
      selectedList: null,
    });
    setAvailableTasks([]);
    setSelectedTasks([]);
    setActiveTask(null);
    setTasksInitialized(false);
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

        // Initialize available tasks when data is loaded (only once)
        if (!tasksInitialized && tasksData.tasks.length > 0) {
          setAvailableTasks(tasksData.tasks);
          setTasksInitialized(true);
        }

        return (
          <VStack gap={4} align="stretch" h="500px" maxH="500px">
            <Text color="gray.600" fontSize="sm">
              Drag tasks from ClickUp to your board:
            </Text>

            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <HStack gap={4} flex={1} align="stretch" minH={0}>
                {/* Available Tasks Section */}
                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={3}
                  flex={1}
                  display="flex"
                  flexDirection="column"
                >
                  <Heading size="sm" color="gray.700" mb={2}>
                    Available Tasks ({availableTasks.length})
                  </Heading>
                  <DroppableArea
                    id="available-tasks"
                    bg="gray.50"
                    borderColor="gray.200"
                  >
                    <SortableContext
                      items={availableTasks.map((task) => task.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <VStack gap={2} align="stretch">
                        {availableTasks.map((task) => (
                          <TaskItem key={task.id} task={task} />
                        ))}
                      </VStack>
                    </SortableContext>
                  </DroppableArea>
                </Box>

                {/* Selected Tasks Section */}
                <Box
                  border="1px solid"
                  borderColor="blue.200"
                  borderRadius="md"
                  p={3}
                  flex={1}
                  display="flex"
                  flexDirection="column"
                >
                  <Heading size="sm" color="blue.700" mb={2}>
                    Board Tasks ({selectedTasks.length})
                  </Heading>
                  <DroppableArea
                    id="selected-tasks"
                    bg="blue.50"
                    borderColor="blue.200"
                  >
                    <SortableContext
                      items={selectedTasks.map((task) => task.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <VStack gap={2} align="stretch">
                        {selectedTasks.map((task) => (
                          <TaskItem key={task.id} task={task} isSelected />
                        ))}
                        {selectedTasks.length === 0 && (
                          <Box
                            p={6}
                            textAlign="center"
                            color="gray.500"
                            border="2px dashed"
                            borderColor="blue.300"
                            borderRadius="md"
                          >
                            <Text fontSize="sm">
                              Drop tasks here to add them to your board
                            </Text>
                          </Box>
                        )}
                      </VStack>
                    </SortableContext>
                  </DroppableArea>
                </Box>
              </HStack>

              <DragOverlay>
                {activeTask ? (
                  <Box
                    p={3}
                    bg="white"
                    border="2px solid"
                    borderColor="blue.400"
                    borderRadius="md"
                    boxShadow="xl"
                    transform="rotate(2deg)"
                    opacity={0.9}
                  >
                    <VStack align="start" gap={1}>
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="semibold" fontSize="xs">
                          {activeTask.name}
                        </Text>
                        <Badge
                          colorScheme={
                            activeTask.status?.color === "#f50000" ||
                            activeTask.status?.color === "red"
                              ? "red"
                              : activeTask.status?.color === "#ffcc00" ||
                                activeTask.status?.color === "yellow"
                              ? "yellow"
                              : "blue"
                          }
                          size="xs"
                        >
                          {activeTask.status?.status}
                        </Badge>
                      </HStack>
                      {activeTask.description && (
                        <Text color="gray.600" fontSize="xs">
                          {activeTask.description}
                        </Text>
                      )}
                    </VStack>
                  </Box>
                ) : null}
              </DragOverlay>
            </DndContext>

            <HStack justify="space-between">
              {(() => {
                const backButtonProps = getBackButtonProps();
                return (
                  <Button {...backButtonProps} variant="outline">
                    {backButtonProps.children}
                  </Button>
                );
              })()}
              <Button
                onClick={handleTasksConfirm}
                colorScheme="blue"
                disabled={selectedTasks.length === 0}
              >
                Import {selectedTasks.length} Tasks
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
        <Dialog.Content maxW="8xl" maxH="90vh">
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
