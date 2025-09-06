import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  HStack,
  Icon,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdAssignment, MdHome, MdLogout, MdPeople } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Sidebar() {
  const { signOut, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { id: "Home", label: "Home", icon: MdHome, path: "/app" },
    { id: "Clients", label: "Clients", icon: MdPeople, path: "/app/clients" },
    { id: "Tasks", label: "Tasks", icon: MdAssignment, path: "/app/tasks" },
  ];

  return (
    <Box
      width="280px"
      height="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      position="fixed"
      left={0}
      top={0}
      zIndex={10}
    >
      <VStack align="stretch" height="100%" gap={0}>
        {/* Logo/Brand Section */}
        <Box p={6}>
          <HStack gap={3}>
            <Box
              bg="brand.solid"
              borderRadius="lg"
              p={2}
              boxSize="40px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="lg" fontWeight="bold" color="white">
                S
              </Text>
            </Box>
            <Text fontWeight="bold" color="gray.800">
              Swooche
            </Text>
          </HStack>
        </Box>

        {/* Navigation Menu */}
        <VStack align="stretch" flex={1} p={4} gap={2}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="ghost"
                  justifyContent="start"
                  height="42px"
                  px={4}
                  width="full"
                  bg={isActive ? "blackAlpha.100" : "transparent"}
                  color={isActive ? "blackAlpha.800" : "blackAlpha.400"}
                  fontWeight={isActive ? "semibold" : "normal"}
                  _hover={{
                    bg: isActive ? "blackAlpha.200" : "blackAlpha.50",
                    color: isActive ? "blackAlpha.800" : "blackAlpha.600",
                  }}
                >
                  <HStack gap={3}>
                    <Icon as={item.icon} boxSize={5} />
                    <Text>{item.label}</Text>
                  </HStack>
                </Button>
              </Link>
            );
          })}
        </VStack>

        {/* Bottom Section */}
        <Box p={4}>
          <Separator mb={4} size="xs" />

          <VStack
            gap={3}
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <HStack gap={3}>
              <AvatarGroup>
                <Avatar.Root>
                  <Avatar.Fallback name={user?.user_metadata?.full_name} />
                  <Avatar.Image src={user?.user_metadata?.avatar_url} />
                </Avatar.Root>
              </AvatarGroup>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                {user?.user_metadata?.full_name}
              </Text>
            </HStack>
            <Button
              variant="solid"
              bg="black"
              color="white"
              width="full"
              px={4}
              _hover={{
                bg: "gray.800",
              }}
              onClick={signOut}
            >
              <Icon as={MdLogout} boxSize={5} />
              Sign Out
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
