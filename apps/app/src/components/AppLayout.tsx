import { Box, Container, useBreakpointValue } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useMemo } from "react";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const mainContentStyles = useMemo(
    () => ({
      flex: 1,
      ml: isMobile ? "0" : "280px",
      p: isMobile ? 4 : 8,
      pt: isMobile ? "80px" : 8, // Add top padding on mobile for header (64px + 16px)
    }),
    [isMobile]
  );

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />

      {/* Main Content Area */}
      <Box {...mainContentStyles}>
        <Container maxW="6xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
