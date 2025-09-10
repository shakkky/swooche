import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { trpc } from "../lib/trpc";
import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  Textarea,
  VStack,
  HStack,
  Text,
  Skeleton,
  Center,
} from "@chakra-ui/react";
import { ClientSelect } from "../components/ClientSelect";
import { useAuthenticatedTrpcQuery } from "../hooks/useAuthenticatedQuery";
import { toaster } from "../components/ui/toaster";

interface EditBoardForm {
  clientId: string;
  projectName: string;
  projectGoal: string;
}

export function EditBoard() {
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<EditBoardForm>({
    defaultValues: {
      clientId: "",
      projectName: "",
      projectGoal: "",
    },
  });

  const selectedClientId = watch("clientId");

  // Fetch board data to prefill the form
  const {
    data: boardData,
    isLoading: isBoardLoading,
    error,
  } = useAuthenticatedTrpcQuery(
    trpc.board.getBoard.useQuery,
    boardId ? { boardId } : undefined
  );

  const { board } = boardData ?? {};

  // Reset form when board data is loaded
  React.useEffect(() => {
    if (board) {
      reset({
        clientId: board.clientId,
        projectName: board.projectName,
        projectGoal: board.projectGoal || "",
      });
    }
  }, [board, reset]);

  const editBoardMutation = trpc.board.editBoard.useMutation({
    onSuccess: (data) => {
      toaster.create({
        title: "Board updated successfully",
        description: "Your board has been updated.",
        type: "success",
      });
      navigate(`/app/boards/${boardId}`);
    },
    onError: (error) => {
      console.error("Error updating board:", error);
      toaster.create({
        title: "Failed to update board",
        description:
          error.message || "An error occurred while updating the board.",
        type: "error",
      });
    },
  });

  const onSubmit = (data: EditBoardForm) => {
    if (!boardId) {
      console.error("No board ID available");
      return;
    }

    editBoardMutation.mutate({
      boardId,
      ...data,
    });
  };

  const handleCancel = () => {
    navigate(`/app/boards/${boardId}`);
  };

  if (isBoardLoading) {
    return (
      <Box maxW="2xl" mx="auto">
        <VStack align="start" gap={8}>
          <Box>
            <Skeleton height="32px" width="200px" mb={2} />
            <Skeleton height="16px" width="300px" />
          </Box>

          <Box w="full">
            <VStack align="stretch" gap={6}>
              <Skeleton height="60px" width="full" />
              <Skeleton height="60px" width="full" />
              <Skeleton height="120px" width="full" />
              <HStack justify="flex-end" gap={4} pt={4}>
                <Skeleton height="40px" width="80px" />
                <Skeleton height="40px" width="120px" />
              </HStack>
            </VStack>
          </Box>
        </VStack>
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
    <Box maxW="2xl" mx="auto">
      <VStack align="start" gap={8}>
        <Box>
          <Heading size="lg" color="gray.800" mb={2}>
            Edit Board
          </Heading>
          <Text color="gray.600">Update your project board details.</Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit(onSubmit)} w="full">
          <VStack align="stretch" gap={6}>
            <ClientSelect
              register={register("clientId", {
                required: "Please select or create a client",
              })}
              value={selectedClientId}
              error={errors.clientId?.message}
            />

            <Field.Root invalid={!!errors.projectName}>
              <Field.Label htmlFor="projectName" color="gray.700">
                Project Name*
              </Field.Label>
              <Input
                id="projectName"
                placeholder="What's the name of this project? E.g. Marketing Campaign for 2025"
                {...register("projectName", {
                  required: "Project name is required",
                  minLength: {
                    value: 2,
                    message: "Project name must be at least 2 characters",
                  },
                })}
                bg="white"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                }}
              />
              <Field.ErrorText>{errors.projectName?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.projectGoal}>
              <Field.Label htmlFor="projectGoal" color="gray.700">
                Project Goal
              </Field.Label>
              <Textarea
                id="projectGoal"
                placeholder="Describe the main goal and objectives of this project"
                rows={4}
                {...register("projectGoal", {
                  minLength: {
                    value: 10,
                    message: "Isn't your project goal a bit more specific?",
                  },
                })}
                bg="white"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                }}
                resize="vertical"
              />
              <Field.ErrorText>{errors.projectGoal?.message}</Field.ErrorText>
            </Field.Root>

            <HStack justify="flex-end" gap={4} pt={4}>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={editBoardMutation.isPending}
                color="gray.600"
                borderColor="gray.300"
                _hover={{
                  bg: "gray.50",
                  borderColor: "gray.400",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={editBoardMutation.isPending}
                loadingText="Updating..."
                variant="solid"
                bg="black"
                color="white"
                px={4}
                _hover={{
                  bg: "gray.800",
                }}
              >
                Update Board
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
