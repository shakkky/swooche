import { Box, Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  return (
    <Box display="flex" minHeight="100vh" bg="gray.50">
      <Sidebar />

      {/* Main Content Area */}
      <Box flex={1} ml="280px" p={8}>
        <Container maxW="6xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
