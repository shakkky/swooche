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
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  MdAssignment,
  MdHome,
  MdLogout,
  MdMenu,
  MdPeople,
} from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const menuItems = [
  { id: "Home", label: "Home", icon: MdHome, path: "/app" },
  { id: "Clients", label: "Clients", icon: MdPeople, path: "/app/clients" },
  { id: "Tasks", label: "Tasks", icon: MdAssignment, path: "/app/tasks" },
];

// Sidebar content component that can be reused in both desktop and mobile
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { signOut, user } = useAuth();
  const location = useLocation();

  return (
    <VStack align="stretch" height="100%" gap={0}>
      {/* Logo/Brand Section */}
      <Box p={6}>
        <HStack gap={3}>
          <Box
            bg="brand.emphasized"
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
              onClick={onClose} // Close mobile drawer when navigating
            >
              <Button
                variant="ghost"
                justifyContent="start"
                height="42px"
                px={4}
                width="full"
                bg={isActive ? "blackAlpha.100" : "transparent"}
                color={isActive ? "blackAlpha.800" : "blackAlpha.600"}
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

        <VStack gap={3} justifyContent="space-between" alignItems="flex-start">
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
  );
}

export function Sidebar() {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  // Desktop sidebar
  if (!isMobile) {
    return (
      <Box
        width="280px"
        height="100vh"
        borderRight="1px solid"
        borderColor="gray.200"
        position="fixed"
        left={0}
        top={0}
        zIndex={10}
        bg="gray.50"
      >
        <SidebarContent />
      </Box>
    );
  }

  // Mobile header and sidebar
  return (
    <>
      {/* Mobile header */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        height="64px"
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        zIndex={20}
        display="flex"
        alignItems="center"
        px={4}
      >
        <Button variant="ghost" size="sm" onClick={onOpen} p={2}>
          <Icon as={MdMenu} boxSize={5} />
        </Button>
      </Box>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <Box
          position="fixed"
          top="64px"
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          zIndex={15}
          onClick={onClose}
        />
      )}

      {/* Mobile sidebar */}
      <Box
        position="fixed"
        top="64px"
        left={0}
        width="75%"
        height="calc(100vh - 64px)"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        zIndex={16}
        transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
        transition="transform 0.3s ease-in-out"
      >
        <SidebarContent onClose={onClose} />
      </Box>
    </>
  );
}
