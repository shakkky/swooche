import { Box } from "@chakra-ui/react";

export default function BoardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box minH="100vh" bg="white">
      {children}
    </Box>
  );
}
