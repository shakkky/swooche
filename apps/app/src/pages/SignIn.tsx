import {
  Badge,
  Box,
  Button,
  HStack,
  Icon,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../contexts/AuthContext";

export function SignIn() {
  const { signInWithGoogle } = useAuth();

  return (
    <Box
      bg="brand.solid"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={{ base: 8, md: 20 }}
    >
      <VStack maxWidth="600px" gap={12} alignItems="center" textAlign="center">
        {/* Logo/Brand Section */}
        <VStack gap={12}>
          <HStack gap={4} alignItems="center">
            <Icon
              as="svg"
              width={20}
              height={20}
              viewBox="0 0 1110 942"
              fill="currentColor"
              stroke="currentColor"
              color="onBrand.fg"
            >
              <use href="/swooche-icon.svg#icon" />
            </Icon>
            <Text
              fontSize="8xl"
              letterSpacing="-0.02em"
              lineHeight="0.9"
              fontFamily="yellowtail"
              fontWeight={900}
              color="onBrand.contrast"
            >
              Swooche
            </Text>
          </HStack>

          <Text
            fontSize={{ base: "lg", md: "xl" }}
            maxWidth="500px"
            color="onBrand.muted"
            lineHeight="1.4"
          >
            White-label portals that make you look professional while saving
            hours every week.
          </Text>
        </VStack>

        {/* Sign In Section */}
        <VStack gap={6} width="100%">
          <Button
            size="xl"
            w="full"
            onClick={signInWithGoogle}
            bg="white"
            color="onBrand.solid"
            borderColor="white"
            borderWidth="2px"
            borderRadius="full"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "xs",
            }}
            transition="all 0.25s"
            fontWeight="600"
            fontSize="lg"
            py={6}
          >
            <HStack gap={3}>
              <FcGoogle size={24} />
              <Text>Continue with Google</Text>
            </HStack>
          </Button>

          <Text fontSize="sm" color="onBrand.muted" maxWidth="400px">
            By signing in, you agree to our{" "}
            <Link
              href={`${import.meta.env.VITE_WEBSITE_URL}/docs/terms`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href={`${import.meta.env.VITE_WEBSITE_URL}/docs/privacy`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
            .
          </Text>
        </VStack>

        {/* Features Preview */}
        <VStack gap={4} mt={8}>
          <Text fontSize="sm" color="onBrand.muted" fontWeight="medium">
            Get instant access to
          </Text>
          <HStack gap={4} flexWrap="wrap" justifyContent="center">
            <Badge
              colorScheme="green"
              variant="solid"
              fontSize="sm"
              px={3}
              py={2}
              borderRadius="full"
              bg="green.500"
              color="white"
            >
              ✓ Client Portals
            </Badge>
            <Badge
              colorScheme="blue"
              variant="solid"
              fontSize="sm"
              px={3}
              py={2}
              borderRadius="full"
              bg="blue.500"
              color="white"
            >
              ✓ Project Tracking
            </Badge>
            <Badge
              colorScheme="purple"
              variant="solid"
              fontSize="sm"
              px={3}
              py={2}
              borderRadius="full"
              bg="purple.500"
              color="white"
            >
              ✓ Automated Updates
            </Badge>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
}
