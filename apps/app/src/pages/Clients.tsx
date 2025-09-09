import {
  Box,
  Button,
  Dialog,
  Field,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  SimpleGrid,
  Skeleton,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdAdd, MdDelete } from "react-icons/md";
import { useAuthenticatedTrpcQuery } from "../hooks/useAuthenticatedQuery";
import { trpc } from "../lib/trpc";

interface Client {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  createdAt: string;
}

interface CreateClientForm {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
}

interface EditClientForm extends CreateClientForm {
  clientId: string;
}

// Skeleton component for client cards
const ClientCardSkeleton = () => {
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
          <Skeleton height="20px" width="70%" mb={1} />
          <Skeleton height="16px" width="50%" />
        </Box>

        <VStack align="start" gap={1} w="full">
          <Skeleton height="16px" width="85%" />
          <Skeleton height="16px" width="60%" />
        </VStack>

        <HStack justify="space-between" w="full" mt="auto">
          <Skeleton height="12px" width="40%" />
        </HStack>
      </VStack>
    </Box>
  );
};

// Skeleton component for form fields
const FormFieldSkeleton = () => {
  return (
    <VStack align="start" gap={2} w="full">
      <Skeleton height="16px" width="30%" />
      <Skeleton height="40px" width="100%" borderRadius="md" />
    </VStack>
  );
};

// Skeleton component for the page header
const PageHeaderSkeleton = () => {
  return (
    <HStack justify="space-between" align="center" w="full">
      <VStack align="start" gap={2}>
        <Skeleton height="32px" width="120px" />
        <Skeleton height="20px" width="300px" />
      </VStack>
      <Skeleton height="40px" width="120px" borderRadius="md" />
    </HStack>
  );
};

export function Clients() {
  const { open, onOpen, onClose } = useDisclosure();
  const {
    open: editOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    open: deleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  // Fetch clients data
  const {
    data: clientsData,
    isLoading,
    error,
    refetch,
  } = useAuthenticatedTrpcQuery(trpc.client.getClients.useQuery, undefined);

  // Create client mutation
  const createClientMutation = trpc.client.createAClient.useMutation({
    onSuccess: () => {
      refetch();
      onClose();
      reset();
      setIsCreating(false);
    },
    onError: (error) => {
      console.error("Error creating client:", error);
      setIsCreating(false);
    },
  });

  // Update client mutation
  const updateClientMutation = trpc.client.updateClient.useMutation({
    onSuccess: () => {
      refetch();
      onEditClose();
      resetEdit();
      setIsEditing(false);
      setEditingClient(null);
    },
    onError: (error) => {
      console.error("Error updating client:", error);
      setIsEditing(false);
    },
  });

  // Delete client mutation
  const deleteClientMutation = trpc.client.deleteClient.useMutation({
    onSuccess: () => {
      refetch();
      onDeleteClose();
      setIsDeleting(false);
      setDeletingClient(null);
    },
    onError: (error) => {
      console.error("Error deleting client:", error);
      setIsDeleting(false);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClientForm>();

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<EditClientForm>();

  const onSubmit = (data: CreateClientForm) => {
    setIsCreating(true);
    createClientMutation.mutate(data);
  };

  const onEditSubmit = (data: EditClientForm) => {
    setIsEditing(true);
    updateClientMutation.mutate({
      clientId: editingClient?._id || "",
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
    });
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    resetEdit({
      clientId: client._id,
      name: client.name,
      email: client.email || "",
      phone: client.phone || "",
      company: client.company || "",
    });
    onEditOpen();
  };

  const handleDeleteClient = (client: Client) => {
    setDeletingClient(client);
    onDeleteOpen();
  };

  const confirmDeleteClient = () => {
    if (deletingClient) {
      setIsDeleting(true);
      deleteClientMutation.mutate({ clientId: deletingClient._id });
    }
  };

  const clients: Client[] = clientsData?.clients || [];

  // Show full page skeleton on initial load
  if (isLoading && !clientsData) {
    return (
      <VStack align="start" gap={6} w="full">
        <PageHeaderSkeleton />
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4} w="full">
          <ClientCardSkeleton />
          <ClientCardSkeleton />
          <ClientCardSkeleton />
          <ClientCardSkeleton />
          <ClientCardSkeleton />
          <ClientCardSkeleton />
        </SimpleGrid>
      </VStack>
    );
  }

  return (
    <VStack align="start" gap={6} w="full">
      <HStack justify="space-between" align="center" w="full">
        <VStack align="start" gap={2}>
          <Heading size="lg" color="gray.800">
            Clients
          </Heading>
          <Text color="gray.600">
            Manage your client relationships and portal access.
          </Text>
        </VStack>
        <Button
          variant="solid"
          bg="black"
          color="white"
          px={4}
          _hover={{
            bg: "gray.800",
          }}
          onClick={onOpen}
        >
          <Icon as={MdAdd} boxSize={5} size="sm" />
          Add Client
        </Button>
      </HStack>

      {/* Loading State - Only show when refetching */}
      {isLoading && clientsData && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4} w="full">
          <ClientCardSkeleton />
          <ClientCardSkeleton />
          <ClientCardSkeleton />
          <ClientCardSkeleton />
          <ClientCardSkeleton />
          <ClientCardSkeleton />
        </SimpleGrid>
      )}

      {/* Error State */}
      {error && (
        <Box
          p={6}
          border="1px solid"
          borderColor="red.200"
          borderRadius="lg"
          bg="red.50"
          textAlign="center"
          w="full"
        >
          <Text color="red.500" fontSize="sm">
            Failed to load clients. Please try again.
          </Text>
          <Button
            mt={3}
            size="sm"
            variant="outline"
            colorScheme="red"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </Box>
      )}

      {/* Clients Grid */}
      {!isLoading && !error && clients.length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4} w="full">
          {clients.map((client) => (
            <Box
              key={client._id}
              p={4}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              bg="white"
              cursor="pointer"
              position="relative"
              _hover={{
                boxShadow: "1px 1px 10px 2px rgba(0, 0, 0, 0.1)",
                "& .delete-icon": {
                  opacity: 1,
                },
              }}
              transition="all 0.2s"
              onClick={() => handleEditClient(client)}
            >
              {/* Delete Icon */}
              <IconButton
                className="delete-icon"
                aria-label="Delete client"
                size="sm"
                variant="ghost"
                position="absolute"
                top={2}
                right={2}
                opacity={0}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClient(client);
                }}
                transition="opacity 0.2s"
              >
                <Icon as={MdDelete} color="red.500" />
              </IconButton>
              <VStack align="start" gap={3}>
                <Box>
                  <Heading size="sm" color="gray.800" mb={1}>
                    {client.name}
                  </Heading>
                  {client.company && (
                    <Text fontSize="sm" color="gray.500" mb={2}>
                      {client.company}
                    </Text>
                  )}
                </Box>

                <VStack align="start" gap={1} w="full">
                  {client.email && (
                    <Text fontSize="sm" color="gray.600">
                      {client.email}
                    </Text>
                  )}
                  {client.phone && (
                    <Text fontSize="sm" color="gray.600">
                      {client.phone}
                    </Text>
                  )}
                </VStack>

                <HStack justify="space-between" w="full" mt="auto">
                  <Text fontSize="xs" color="gray.400">
                    Added {new Date(client.createdAt).toLocaleDateString()}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* Empty State */}
      {!isLoading && !error && clients.length === 0 && (
        <Box
          p={8}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          bg="gray.50"
          textAlign="center"
          w="full"
        >
          <VStack gap={4}>
            <Text color="gray.500" fontSize="lg">
              No clients yet
            </Text>
            <Text color="gray.400" fontSize="sm">
              Start by adding your first client to manage your relationships.
            </Text>
            <Button variant="solid" bg="black" color="white" onClick={onOpen}>
              Add Your First Client
            </Button>
          </VStack>
        </Box>
      )}

      {/* Create Client Dialog */}
      <Dialog.Root open={open} onOpenChange={onClose}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="md">
            <Dialog.Header>
              <Dialog.Title>Add New Client</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body pb={6}>
              {isCreating ? (
                <VStack gap={4}>
                  <FormFieldSkeleton />
                  <FormFieldSkeleton />
                  <FormFieldSkeleton />
                  <FormFieldSkeleton />
                  <HStack gap={3} w="full" justify="flex-end" pt={4}>
                    <Skeleton height="40px" width="80px" borderRadius="md" />
                    <Skeleton height="40px" width="120px" borderRadius="md" />
                  </HStack>
                </VStack>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <VStack gap={4}>
                    <Field.Root invalid={!!errors.name}>
                      <Field.Label htmlFor="name" color="gray.700">
                        Client Name *
                      </Field.Label>
                      <Input
                        id="name"
                        {...register("name", {
                          required: "Client name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
                          },
                        })}
                        placeholder="Enter client name"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                        }}
                      />
                      <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.email}>
                      <Field.Label htmlFor="email" color="gray.700">
                        Email
                      </Field.Label>
                      <Input
                        id="email"
                        {...register("email", {
                          validate: (value) => {
                            if (!value || value.trim() === "") return true;
                            return (
                              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                value
                              ) || "Invalid email address"
                            );
                          },
                        })}
                        type="email"
                        placeholder="Enter email address"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                        }}
                      />
                      <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.phone}>
                      <Field.Label htmlFor="phone" color="gray.700">
                        Phone
                      </Field.Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="Enter phone number"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                        }}
                      />
                      <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.company}>
                      <Field.Label htmlFor="company" color="gray.700">
                        Company
                      </Field.Label>
                      <Input
                        id="company"
                        {...register("company")}
                        placeholder="Enter company name"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                        }}
                      />
                      <Field.ErrorText>
                        {errors.company?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    <HStack gap={3} w="full" justify="flex-end" pt={4}>
                      <Button variant="outline" onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="solid"
                        bg="black"
                        color="white"
                        loading={isCreating}
                        loadingText="Creating..."
                      >
                        Create Client
                      </Button>
                    </HStack>
                  </VStack>
                </form>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* Edit Client Dialog */}
      <Dialog.Root open={editOpen} onOpenChange={onEditClose}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="md">
            <Dialog.Header>
              <Dialog.Title>Edit Client</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body pb={6}>
              {isEditing ? (
                <VStack gap={4}>
                  <FormFieldSkeleton />
                  <FormFieldSkeleton />
                  <FormFieldSkeleton />
                  <FormFieldSkeleton />
                  <HStack gap={3} w="full" justify="flex-end" pt={4}>
                    <Skeleton height="40px" width="80px" borderRadius="md" />
                    <Skeleton height="40px" width="120px" borderRadius="md" />
                  </HStack>
                </VStack>
              ) : (
                <form onSubmit={handleEditSubmit(onEditSubmit)}>
                  <VStack gap={4}>
                    <Field.Root invalid={!!editErrors.name}>
                      <Field.Label htmlFor="edit-name" color="gray.700">
                        Client Name *
                      </Field.Label>
                      <Input
                        id="edit-name"
                        {...registerEdit("name", {
                          required: "Client name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
                          },
                        })}
                        placeholder="Enter client name"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                        }}
                      />
                      <Field.ErrorText>
                        {editErrors.name?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!editErrors.email}>
                      <Field.Label htmlFor="edit-email" color="gray.700">
                        Email
                      </Field.Label>
                      <Input
                        id="edit-email"
                        {...registerEdit("email", {
                          validate: (value) => {
                            if (!value || value.trim() === "") return true;
                            return (
                              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                value
                              ) || "Invalid email address"
                            );
                          },
                        })}
                        type="email"
                        placeholder="Enter email address"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                        }}
                      />
                      <Field.ErrorText>
                        {editErrors.email?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!editErrors.phone}>
                      <Field.Label htmlFor="edit-phone" color="gray.700">
                        Phone
                      </Field.Label>
                      <Input
                        id="edit-phone"
                        {...registerEdit("phone")}
                        placeholder="Enter phone number"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                        }}
                      />
                      <Field.ErrorText>
                        {editErrors.phone?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!editErrors.company}>
                      <Field.Label htmlFor="edit-company" color="gray.700">
                        Company
                      </Field.Label>
                      <Input
                        id="edit-company"
                        {...registerEdit("company")}
                        placeholder="Enter company name"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                        }}
                      />
                      <Field.ErrorText>
                        {editErrors.company?.message}
                      </Field.ErrorText>
                    </Field.Root>

                    <HStack gap={3} w="full" justify="flex-end" pt={4}>
                      <Button variant="outline" onClick={onEditClose}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="solid"
                        bg="black"
                        color="white"
                        loading={isEditing}
                        loadingText="Updating..."
                      >
                        Update Client
                      </Button>
                    </HStack>
                  </VStack>
                </form>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={deleteOpen} onOpenChange={onDeleteClose}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="md">
            <Dialog.Header>
              <Dialog.Title>Delete Client</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <VStack gap={4} align="start">
                <Text color="gray.600">
                  Are you sure you want to delete{" "}
                  <strong>{deletingClient?.name}</strong>? This action cannot be
                  undone.
                </Text>
                <Text fontSize="sm" color="gray.500">
                  This will permanently remove the client and all associated
                  data.
                </Text>
                <HStack gap={3} w="full" justify="flex-end" pt={4}>
                  <Button variant="outline" onClick={onDeleteClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="solid"
                    colorScheme="red"
                    loading={isDeleting}
                    loadingText="Deleting..."
                    onClick={confirmDeleteClient}
                  >
                    Delete Client
                  </Button>
                </HStack>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </VStack>
  );
}
