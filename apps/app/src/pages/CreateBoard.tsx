import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
} from "@chakra-ui/react";
import { ClientSelect } from "../components/ClientSelect";

interface CreateBoardForm {
  clientId: string;
  projectName: string;
  projectGoal: string;
}

export function CreateBoard() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateBoardForm>({
    defaultValues: {
      clientId: "",
      projectName: "",
      projectGoal: "",
    },
  });

  const selectedClientId = watch("clientId");

  const createBoardMutation = trpc.createBoard.useMutation({
    onSuccess: () => {
      navigate("/app");
    },
    onError: (error) => {
      console.error("Error creating board:", error);
    },
  });

  const onSubmit = (data: CreateBoardForm) => {
    createBoardMutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Box maxW="2xl" mx="auto">
      <VStack align="start" gap={8}>
        <Box>
          <Heading size="lg" color="gray.800" mb={2}>
            Create New Board
          </Heading>
          <Text color="gray.600">
            Set up a new project board for your client.
          </Text>
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
                disabled={createBoardMutation.isPending}
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
                loading={createBoardMutation.isPending}
                loadingText="Creating..."
                variant="solid"
                bg="black"
                color="white"
                px={4}
                _hover={{
                  bg: "gray.800",
                }}
              >
                Create Board
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
