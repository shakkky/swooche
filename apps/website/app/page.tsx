import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <div>
      <main>
        <Box
          bg="brand.solid"
          color="brand.contrast"
          p={12}
          height="100vh"
          width="100vw"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          gap={16}
        >
          <Heading
            as="h1"
            fontSize={{ base: "8xl", md: "158px" }}
            fontFamily="modak"
            fontWeight="normal"
          >
            Swooche
          </Heading>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={8}
            maxWidth="800px"
          >
            <Text fontSize="xl" fontWeight={600}>
              Give your customers the experience of calling a full business
              phone system. Even if it&apos;s just you.
            </Text>
            <Flex direction={{ base: "column", md: "row" }} gap={4}>
              <Button
                colorPalette="onBrand"
                variant="solid"
                size="xl"
                fontWeight={800}
                color="brand.solid"
              >
                Reserve your business number now
              </Button>
              <Button
                colorPalette="onBrand"
                variant="outline"
                fontWeight={800}
                size="xl"
                color="brand.contrast"
                borderColor="brand.contrast"
              >
                See what Swooche can do for your business
              </Button>
            </Flex>
            <Text fontSize="md" color="brand.muted">
              Get ready to swooche your customers off their feet. With
              AI-powered call summaries, greetings, configurable call
              forwarding, and smart calendar booking suggestions.
            </Text>
          </Box>
        </Box>
      </main>
    </div>
  );
}
