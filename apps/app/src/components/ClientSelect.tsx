import { useState, useRef, useEffect } from "react";
import { Box, Button, Field, Input, Text, VStack } from "@chakra-ui/react";
import { trpc } from "../lib/trpc";
import { useAuthenticatedTrpcQuery } from "../hooks/useAuthenticatedQuery";

interface ClientSelectProps {
  register: any;
  value?: string;
  error?: string;
}

export function ClientSelect({ register, value, error }: ClientSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newlyCreatedClient, setNewlyCreatedClient] = useState<{
    _id: string;
    name: string;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { onChange: registerOnChange } = register;

  // Fetch existing clients
  const {
    data: clientsData,
    isLoading,
    refetch,
  } = useAuthenticatedTrpcQuery(trpc.client.getClients.useQuery, undefined);

  // Create new client mutation
  const createClientMutation = trpc.client.createClient.useMutation({
    onSuccess: (data) => {
      registerOnChange({
        target: { name: register.name, value: data.client._id },
      });
      setNewlyCreatedClient({ _id: data.client._id, name: data.client.name });
      setSearchTerm(""); // Clear search term when client is created
      setIsOpen(false);
      // Refetch in background to update the list for future use
      refetch();
    },
    onError: (error) => {
      console.error("Error creating client:", error);
    },
  });

  const clients = clientsData?.clients || [];
  const selectedClient = clients.find((client) => client._id === value);

  // Use newly created client if it matches the current value
  const displayClient =
    newlyCreatedClient && newlyCreatedClient._id === value
      ? newlyCreatedClient
      : selectedClient;

  // Filter clients based on search term
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCreateClient = () => {
    if (searchTerm.trim().length < 2) return;

    createClientMutation.mutate({
      name: searchTerm.trim(),
    });
  };

  const handleSelectClient = (client: any) => {
    registerOnChange({ target: { name: register.name, value: client._id } });
    setSearchTerm(""); // Clear search term when client is selected
    setIsOpen(false);
  };

  return (
    <Field.Root invalid={!!error}>
      <Field.Label htmlFor="client" color="gray.700">
        Client*
      </Field.Label>

      <Box position="relative" ref={containerRef} w="full">
        <Input
          {...register}
          autoComplete="off"
          placeholder="Search or create a new client..."
          value={isOpen ? searchTerm : displayClient?.name || ""}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setNewlyCreatedClient(null); // Clear newly created client when user types
          }}
          onFocus={() => setIsOpen(true)}
          bg="white"
          borderColor="gray.300"
          _hover={{ borderColor: "gray.400" }}
          _focus={{
            borderColor: "blue.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
          }}
        />

        {/* Dropdown menu */}
        {isOpen && (
          <Box
            position="absolute"
            top="100%"
            left={0}
            right={0}
            bg="white"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            boxShadow="1px 1px 10px 2px rgba(0, 0, 0, 0.1)"
            zIndex={1000}
            maxHeight="200px"
            overflowY="auto"
          >
            {isLoading ? (
              <Box p={3}>
                <Text color="gray.500" fontSize="sm">
                  Loading clients...
                </Text>
              </Box>
            ) : (
              <VStack align="stretch" gap={0}>
                {/* Existing clients */}
                {filteredClients.map((client) => (
                  <Box
                    key={client._id}
                    p={3}
                    cursor="pointer"
                    _hover={{ bg: "gray.50" }}
                    onClick={() => handleSelectClient(client)}
                  >
                    <Text color="gray.800" fontSize="sm">
                      {client.name}
                    </Text>
                    {client.company && (
                      <Text color="gray.500" fontSize="sm">
                        {client.company}
                      </Text>
                    )}
                  </Box>
                ))}

                {/* Create new client option */}
                {searchTerm.trim().length >= 2 && (
                  <Box
                    p={3}
                    borderTop="1px solid"
                    borderColor="gray.200"
                    bg="white"
                  >
                    <VStack align="stretch" gap={2}>
                      <Text
                        fontSize="sm"
                        color="gray.500"
                        paddingBottom={2}
                        borderBottom="1px solid"
                        borderColor="gray.200"
                      >
                        No client found for "{searchTerm}".
                      </Text>
                      <Box>
                        <Button
                          size="sm"
                          color="white"
                          bg="black"
                          variant="solid"
                          onClick={handleCreateClient}
                          loading={createClientMutation.isPending}
                          loadingText="Creating..."
                        >
                          Create "{searchTerm}"
                        </Button>
                      </Box>
                    </VStack>
                  </Box>
                )}

                {/* No results */}
                {filteredClients.length === 0 &&
                  searchTerm.trim().length < 2 && (
                    <Box p={3}>
                      <Text color="gray.500" fontSize="sm">
                        Type at least 2 characters to search or create a client
                      </Text>
                    </Box>
                  )}
              </VStack>
            )}
          </Box>
        )}
      </Box>

      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
}
