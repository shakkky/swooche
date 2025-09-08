import { trpc } from "@/lib/trpc";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import clickupLogo from "../assets/logos/clickup.png";
import swoocheLogo from "../assets/logos/swooche.png";
import { getBaseUrl, getClickUpClientId } from "../config";

type ConnectionStatus = "loading" | "success" | "error" | "processing";

export function Connect() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<ConnectionStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const hasProcessedRef = useRef(false);

  const client = searchParams.get("client");
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  const exchangeCodeMutation =
    trpc.connection.exchangeClickUpCode.useMutation();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Prevent duplicate processing
      if (hasProcessedRef.current) {
        console.log("OAuth callback already processed, skipping...");
        return;
      }

      if (!client) {
        setStatus("error");
        setErrorMessage("No client specified in the connection request.");
        return;
      }

      if (error) {
        setStatus("error");
        setErrorMessage(`OAuth error: ${error}`);
        return;
      }

      if (!code) {
        setStatus("error");
        setErrorMessage("No authorization code received from ClickUp.");
        return;
      }

      // Mark as processed to prevent duplicate calls
      hasProcessedRef.current = true;

      // Start processing the OAuth code
      setStatus("processing");

      try {
        // Exchange the authorization code for an access token
        const result = (await exchangeCodeMutation.mutateAsync({
          code: code!,
          state: state || undefined,
        })) as { success: boolean; message: string; connectionId?: string };

        if (result.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(
            result.message || "Failed to complete the connection."
          );
        }
      } catch (err) {
        console.error("Error processing OAuth callback:", err);
        setStatus("error");
        setErrorMessage("Failed to complete the connection. Please try again.");
        // Reset the processed flag on error so user can retry
        hasProcessedRef.current = false;
      }
    };

    handleOAuthCallback();
  }, [client, code, error, state, exchangeCodeMutation]);

  const handleContinue = () => {
    // Navigate back to the board or home page
    const returnUrl =
      localStorage.getItem("clickup-oauth-return-url") || "/app";
    localStorage.removeItem("clickup-oauth-return-url");
    navigate(returnUrl);
  };

  const handleRetry = () => {
    // Redirect back to ClickUp OAuth
    const clientId = getClickUpClientId();
    const redirectUri = encodeURIComponent(
      `${getBaseUrl()}/app/connect?client=clickup`
    );
    const oauthUrl = `https://app.clickup.com/api?client_id=${clientId}&redirect_uri=${redirectUri}`;
    window.location.href = oauthUrl;
  };

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <VStack gap={6} textAlign="center">
            <VStack gap={4}>
              <HStack gap={4}>
                <Box w={12} h={12}>
                  <Image
                    src={swoocheLogo}
                    alt="Swooche Logo"
                    w={12}
                    h={12}
                    borderRadius="md"
                  />
                </Box>
                <Text fontSize="lg" color="gray.500">
                  +
                </Text>
                <Box w={12} h={12}>
                  <Image src={clickupLogo} alt="ClickUp Logo" w={12} h={12} />
                </Box>
              </HStack>
              <Heading size="lg" color="gray.800">
                Connecting to ClickUp
              </Heading>
              <Text color="gray.600">
                Please wait while we set up your connection...
              </Text>
            </VStack>
            <Spinner size="lg" color="blue.500" />
          </VStack>
        );

      case "processing":
        return (
          <VStack gap={6} textAlign="center">
            <VStack gap={4}>
              <HStack gap={4}>
                <Box w={12} h={12}>
                  <Image
                    src={swoocheLogo}
                    alt="Swooche Logo"
                    w={12}
                    h={12}
                    borderRadius="md"
                  />
                </Box>
                <Text fontSize="lg" color="gray.500">
                  +
                </Text>
                <Box w={12} h={12}>
                  <Image src={clickupLogo} alt="ClickUp Logo" w={12} h={12} />
                </Box>
              </HStack>
              <Heading size="lg" color="gray.800">
                Finalizing Connection
              </Heading>
              <Text color="gray.600">
                We're setting up your ClickUp integration...
              </Text>
            </VStack>
            <Spinner size="lg" color="blue.500" />
          </VStack>
        );

      case "success":
        return (
          <VStack gap={6} textAlign="center">
            <VStack gap={4}>
              <Box
                w={16}
                h={16}
                bg="green.100"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="2xl">✅</Text>
              </Box>
              <Heading size="lg" color="gray.800">
                Connection Successful!
              </Heading>
              <Text color="gray.600">
                Your ClickUp workspace has been successfully connected to
                Swooche. You can now sync your tasks and manage your project
                workflow.
              </Text>
            </VStack>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={handleContinue}
              w="full"
              maxW="300px"
            >
              Continue to Dashboard
            </Button>
          </VStack>
        );

      case "error":
        return (
          <VStack gap={6} textAlign="center">
            <VStack gap={4}>
              <Box
                w={16}
                h={16}
                bg="red.100"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="2xl">❌</Text>
              </Box>
              <Heading size="lg" color="gray.800">
                Connection Failed
              </Heading>
              <Box
                p={4}
                bg="red.50"
                border="1px solid"
                borderColor="red.200"
                borderRadius="md"
              >
                <Text color="red.800" fontWeight="semibold" mb={2}>
                  Error!
                </Text>
                <Text color="red.600" fontSize="sm">
                  {errorMessage}
                </Text>
              </Box>
            </VStack>
            <VStack gap={3} w="full" maxW="300px">
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleRetry}
                w="full"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleContinue}
                w="full"
              >
                Go to Dashboard
              </Button>
            </VStack>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <Center minH="100vh" bg="gray.50">
      <Box
        w="full"
        maxW="500px"
        p={8}
        bg="white"
        borderRadius="xl"
        boxShadow="0 10px 25px rgba(0, 0, 0, 0.1)"
        border="1px solid"
        borderColor="gray.200"
      >
        {renderContent()}
      </Box>
    </Center>
  );
}
